import type {IPluginContext} from '@tarojs/service'
import {IconForgerPlugin} from "@icon-forger/compiler";

export default (ctx: IPluginContext) => {
    ctx.modifyWebpackChain(({ chain }) => {
        const template = (iconName:string) => {
            return `
                import {Text} from '@tarojs/components';
                export const Icon = (props) => {
                    const { color, size } = props
                    return <Text className="icon-${iconName}" style={{color, fontSize: size || 16}}></Text>
                }
            `
        }
        chain.module
            .rule('icon-forger-svg')
            .test(/\.svg$/)
            .resourceQuery({ not: [/iconForger/] })
            .use('icon-forger-loader')
            .loader(require.resolve('@icon-forger/compiler/loader'))
            .options({template})
            .end();

        chain.plugin('icon-forger-plugin').use(IconForgerPlugin)
    })
}
