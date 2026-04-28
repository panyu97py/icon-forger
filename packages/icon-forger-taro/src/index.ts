import type { IPluginContext } from '@tarojs/service'
import { IconForgerPlugin, TemplateCodeOpts } from '@icon-forger/compiler'
import { InjectIconFont } from './inject-iconfont'
import template from '@babel/template'
import { JSXElement } from '@babel/types'

export default (ctx: IPluginContext) => {
  ctx.modifyWebpackChain(({ chain }) => {
    chain.module
      .rule('script')
      .use('babelLoader')
      .tap((options:any) => {
        const { plugins: curPlugins = [], ...rest } = options
        const iconForgerPluginOpts = {
          dependRequire: ['import { BaseIcon } from "@icon-forger/taro/base-icon"'],
          templateCode: (opts:TemplateCodeOpts) => {
            const jsxElementNode = template.expression(`<BaseIcon name="${opts.iconName}" />`, { plugins: ['jsx'] })() as JSXElement
            const { openingElement, ...jsxElementNodeRest } = jsxElementNode
            const { attributes, ...openingElementRest } = openingElement
            const finalAttributes = [...attributes, ...opts.attributes]
            const finalOpeningElements = { ...openingElementRest, attributes: finalAttributes }
            return { ...jsxElementNodeRest, openingElement: finalOpeningElements }
          }
        }
        const iconForgerPlugin = [require.resolve('@icon-forger/compiler/babel'), iconForgerPluginOpts]
        return { ...rest, plugins: [...curPlugins, iconForgerPlugin] }
      })
    chain.plugin('icon-forger-plugin').use(IconForgerPlugin)
    chain.plugin('inject-iconfont').use(InjectIconFont)
  })
}
