import { IconForgerPlugin } from '@icon-forger/compiler'
import { Compilation, Compiler } from 'webpack'
import path from 'path'
import fs from 'fs'

const styleSuffixMap:Record<string, string> = {
  weapp: '.wxss',
  alipay: '.acss',
  tt: '.ttss'
}

const PLUGIN_NAME = 'InjectIconFont'

export class InjectIconFont {
  apply (compiler: Compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: Compilation) => {
      const hooks = IconForgerPlugin.getCompilationHooks(compilation)
      hooks?.emitIconFontAssets.tap(PLUGIN_NAME, (opt) => {
        const { RawSource } = compiler.webpack.sources
        const { iconFontAssetsDir, compilationAssets } = opt
        const { [process.env.TARO_ENV!]: styleSuffix } = styleSuffixMap
        if (!iconFontAssetsDir || !compilationAssets || !styleSuffix) return

        // 遍历字体文件目录，将所有文件添加到 compilationAssets 中
        const files = fs.readdirSync(iconFontAssetsDir)
        files.forEach((file) => {
          const fullPath = path.resolve(iconFontAssetsDir, file)
          const stat = fs.statSync(fullPath)
          // 只处理字体文件
          if (!stat.isFile() || !/\.(woff2|woff|ttf|eot)$/.test(file)) return
          const buffer = fs.readFileSync(fullPath)
          compilationAssets[file] = new RawSource(buffer)
        })

        const cssFiles = files.filter((file) => /\.css$/.test(file))
        cssFiles.forEach((file) => {
          const cssSource = fs.readFileSync(path.resolve(iconFontAssetsDir, file), 'utf-8')
          const originEntryStyleAssetSource = compilationAssets[`app${styleSuffix}`].source().toString()
          const assetCssFileName = file.replace(/\.css$/, styleSuffix)
          compilationAssets[assetCssFileName] = new RawSource(cssSource)
          compilationAssets[`app${styleSuffix}`] = new RawSource(originEntryStyleAssetSource.concat(`@import './${assetCssFileName}';\n`))
        })
      })
    })
  }
}
