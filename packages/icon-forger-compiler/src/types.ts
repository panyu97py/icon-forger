import { sources } from 'webpack'
import { SyncHook } from 'tapable'
import { JSXAttribute, JSXOpeningElement, JSXSpreadAttribute } from '@babel/types'
import { PluginPass } from '@babel/core'

export type CompilationAssets = Record<string, sources.Source>

export interface EmitIconFontAssetsOpts{
    iconFontAssetsDir?: string;
    compilationAssets?:CompilationAssets
}

export interface Hooks {
    emitIconFontAssets: SyncHook<EmitIconFontAssetsOpts>;
}

export interface IconAssetInfo {
    name: string;
    path: string;
    source: string;
}

export interface TemplateCodeOpts{
    iconName: string;
    attributes: Array<JSXSpreadAttribute|JSXAttribute>;
}

export interface TransformOpts {
    dependRequire?: string[];
    templateCode: (opts:TemplateCodeOpts) => JSXOpeningElement
}

export interface TransformState extends PluginPass {
    opts: TransformOpts
    dependRequire: Set<string>
}
