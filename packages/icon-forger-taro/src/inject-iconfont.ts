import { IconForgerPlugin } from '@icon-forger/compiler'
import { Compilation, Compiler } from 'webpack'
import path from 'path'
import fs from 'fs'

const styleSuffix:Record<string, string> = {
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
        const { [process.env.TARO_ENV!]: suffix } = styleSuffix
        if (!iconFontAssetsDir || !compilationAssets || !suffix) return
        const originEntryStyleAssetSource = compilationAssets[`app${suffix}`].source().toString()
        const cssSource = fs.readFileSync(path.resolve(iconFontAssetsDir, 'iconfont.css'), 'utf-8')
        const woff2Source = fs.readFileSync(path.resolve(iconFontAssetsDir, 'iconfont.woff2'), 'utf-8')
        const newEntryStyleAssetSource = originEntryStyleAssetSource.concat(`@import './iconfont${suffix}';\n`)
        compilationAssets['iconfont.woff2'] = new RawSource(woff2Source)
        compilationAssets[`iconfont${suffix}`] = new RawSource(cssSource)
        compilationAssets[`app${suffix}`] = new RawSource(newEntryStyleAssetSource)
      })
    })
  }
}
