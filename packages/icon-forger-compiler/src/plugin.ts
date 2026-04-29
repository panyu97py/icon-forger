import fs from 'fs'
import path from 'path'
import { SyncHook } from 'tapable'
import { generateFonts, FontAssetType, OtherAssetType } from 'fantasticon'
import { Compiler, Compilation, NormalModule } from 'webpack'
import { CompilationAssets, EmitIconFontAssetsOpts, Hooks, IconAssetInfo } from './types'

const compilationHooksMap = new WeakMap<Compilation, Hooks>()

const PLUGIN_NAME = 'IconForgerPlugin'

export interface IconForgerPluginOptions {
    cacheDir?: string;
}

export class IconForgerPlugin {
  private options?: IconForgerPluginOptions

  private iconMap = new Map<string, IconAssetInfo>()

  constructor (options?: IconForgerPluginOptions) {
    this.options = options
  }

  static getCompilationHooks (compilation: Compilation) {
    if (!compilationHooksMap.has(compilation)) {
      const hooks = {
        emitIconFontAssets: new SyncHook<EmitIconFontAssetsOpts>(['opts'])
      }
      compilationHooksMap.set(compilation, hooks)
    }
    return compilationHooksMap.get(compilation)
  }

  apply (compiler: Compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: Compilation) => {
      compilation.hooks.succeedModule.tap(PLUGIN_NAME, (module) => {
        const { resource } = module as NormalModule

        if (!resource?.endsWith('.svg')) return

        const name = path.basename(resource, '.svg')

        const source = fs.readFileSync(resource, 'utf-8')

        this.iconMap.set(name, { name, path: resource, source })
      })

      const stage = compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS

      compilation.hooks.processAssets.tapPromise({ name: PLUGIN_NAME, stage }, async (assets:CompilationAssets) => {
        if (compilation.compiler.isChild()) return

        const cacheDir = path.resolve('node_modules/.cache', this.options?.cacheDir || 'icon-forger')
        const sourcesDir = path.resolve(cacheDir, 'sources')
        const iconfontDir = path.resolve(cacheDir, 'iconfont')

        // 清空缓存目录
        fs.rmSync(cacheDir, { recursive: true, force: true })
        fs.mkdirSync(cacheDir, { recursive: true })

        // 创建缓存目录
        fs.mkdirSync(sourcesDir, { recursive: true })
        fs.mkdirSync(iconfontDir, { recursive: true })

        // 编译图标字体
        const iconAssets = Array.from(this.iconMap.values())
        iconAssets.forEach(icon => fs.writeFileSync(path.resolve(sourcesDir, `${icon.name}.svg`), icon.source))
        await generateFonts({
          inputDir: sourcesDir,
          outputDir: iconfontDir,
          templates: {
            [OtherAssetType.CSS]: path.resolve(__dirname, './template/css.hbs')
          },
          name: 'iconfont',
          selector: '.iconfont',
          prefix: 'iconfont',
          fontTypes: [FontAssetType.WOFF2],
          assetTypes: [OtherAssetType.CSS]
        })

        compilationHooksMap.get(compilation)?.emitIconFontAssets.call({ iconFontAssetsDir: iconfontDir, compilationAssets: assets })
      })
    })
  }
}
