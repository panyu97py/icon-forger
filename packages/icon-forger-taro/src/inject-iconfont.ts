import { IconForgerPlugin } from '@icon-forger/compiler'
import { Compilation, Compiler } from 'webpack'
import path from 'path'
import fs from 'fs'
import { Node } from 'postcss-value-parser'
import { transformFontUrl } from './transform-font-url'

const styleSuffixMap:Record<string, string> = {
  weapp: '.wxss',
  alipay: '.acss',
  tt: '.ttss'
}

const MimeTypeMap:Record<string, string> = {
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf'
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

        const files = fs.readdirSync(iconFontAssetsDir)
        const cssFiles = files.filter((file) => /\.css$/.test(file))
        cssFiles.forEach((file) => {
          const cssSource = fs.readFileSync(path.resolve(iconFontAssetsDir, file), 'utf-8')
          const originEntryStyleAssetSource = compilationAssets[`app${styleSuffix}`].source().toString()
          const assetCssFileName = file.replace(/\.css$/, styleSuffix)
          const process = (nodes: Node[]) => {
            return nodes.map(node => {
              const { value: rawUrl, ...rest } = node
              const url = rawUrl.replace(/[?#].*$/, '')
              const buffer = fs.readFileSync(path.resolve(iconFontAssetsDir, url))
              const base64 = buffer.toString('base64')
              const mime = MimeTypeMap[path.extname(url)]
              const value = `data:${mime};base64,${base64}`
              return { ...rest, value }
            })
          }
          compilationAssets[assetCssFileName] = new RawSource(transformFontUrl(cssSource, process))
          compilationAssets[`app${styleSuffix}`] = new RawSource(originEntryStyleAssetSource.concat(`@import './${assetCssFileName}';\n`))
        })
      })
    })
  }
}
