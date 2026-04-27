import {sources} from "webpack";
import {SyncHook} from "tapable";

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
