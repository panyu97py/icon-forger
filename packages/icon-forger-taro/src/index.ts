import type { IPluginContext } from '@tarojs/service'
import {IconForgerPlugin,iconForgerLoader,InjectIconfontStyleOpt} from "@icon-forger/compiler";
import { Compilation } from 'webpack'

const styleSuffix:Record<string, string>={
    'weapp':'.wxss',
    'alipay':'.acss',
    'tt':'.ttss'
}

export default (ctx: IPluginContext) => {
    ctx.modifyWebpackChain(({ chain }) => {
        const template = (iconName:string) => {
            return `
            import {Text} from '@tarojs/components';
            export const Icon = (props) => {
                const { color, size } = props
                return <Text className="iconfont-${iconName}" style={{color, fontSize: size || 16}}></Text>
            }
            `
        }
        chain.module
            .rule('icon-forger-svg')
            .test(/\.svg$/)
            .use('icon-forger-loader')
            .loader(iconForgerLoader)
            .options({template})
            .end();

        const injectIconfontStyle = (opt:InjectIconfontStyleOpt) => {
            const {compiler,pluginName,cssSource} = opt;
            compiler.hooks.compilation.tap(pluginName, (compilation: Compilation) => {
                const stage = compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE // 最早阶段，在优化前

                compilation.hooks.processAssets.tap({ name: pluginName, stage }, (assets) => {

                    const {[process.env.TARO_ENV!]:suffix} = styleSuffix

                    if (!suffix) return

                    const entryStyleAssetName = `app${suffix}`

                    const iconfontStyleAssetName = `iconfont${suffix}`

                    const originEntryStyleAssetSource = assets[entryStyleAssetName].source().toString()

                    const newEntryStyleAssetSource =originEntryStyleAssetSource.concat(`@import './${iconfontStyleAssetName}';\n`)

                    compilation.assets[iconfontStyleAssetName] =  new compiler.webpack.sources.RawSource(cssSource)

                    compilation.assets[iconfontStyleAssetName] = new compiler.webpack.sources.RawSource(newEntryStyleAssetSource)
                })
            })
        }
        chain.plugin('icon-forger-plugin').use(IconForgerPlugin,[{injectIconfontStyle}])
    })
}
