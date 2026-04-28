import type { IPluginContext } from '@tarojs/service'
import { IconForgerPlugin } from '@icon-forger/compiler'
import { InjectIconFont } from './inject-iconfont'

export * from './base-icon'

export default (ctx: IPluginContext) => {
  ctx.modifyWebpackChain(({ chain }) => {
    chain.plugin('icon-forger-plugin').use(IconForgerPlugin)
    chain.plugin('inject-iconfont').use(InjectIconFont)
  })
}
