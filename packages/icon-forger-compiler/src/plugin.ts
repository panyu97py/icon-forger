import fs from "fs";
import path from 'path';
import { generateFonts, FontAssetType, OtherAssetType } from 'fantasticon';
import { Compiler, Compilation, NormalModule } from 'webpack'
import {LoaderOptions} from "./loader";

interface IconAssetInfo {
    name: string;
    path: string;
    source: string;
}

export interface InjectIconfontStyleOpt{
    compiler:Compiler;
    pluginName:string;
    cssSource:string;
}

export interface IconForgerPluginOptions  extends LoaderOptions{
    injectIconfontStyle:(opt:InjectIconfontStyleOpt) => void;
    cacheDir?: string;
}

const PLUGIN_NAME = 'IconForgerPlugin';

export class IconForgerPlugin {
    private options: IconForgerPluginOptions;

    private iconMap = new Map<string, IconAssetInfo>();

    constructor(options: IconForgerPluginOptions) {
        this.options = options;
    }

    apply(compiler: Compiler) {

        compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: Compilation) => {

            compilation.hooks.succeedModule.tap(PLUGIN_NAME, (module) => {

                const {resource} = module as NormalModule;

                if (!resource?.endsWith('.svg')) return;

                const name = path.basename(resource, '.svg');

                const source = fs.readFileSync(resource, 'utf-8');

                this.iconMap.set(name, {name, path: resource, source: source});

            });

            const stage = compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS

            compilation.hooks.processAssets.tapPromise({name:PLUGIN_NAME, stage} ,async ()=>{
                const cacheDir = path.resolve('node_modules/.cache', this.options.cacheDir || 'icon-forger');
                const sourcesDir = path.resolve(cacheDir,'sources');
                const iconfontDir  = path.resolve(cacheDir,'iconfont');
                fs.rmSync(cacheDir, {recursive: true, force: true});
                fs.mkdirSync(cacheDir, { recursive: true });
                const iconAssets =   this.iconMap.values()
                fs.mkdirSync(sourcesDir, { recursive: true });
                iconAssets.forEach(icon =>fs.writeFileSync(path.resolve(sourcesDir, `${icon.name}.svg`), icon.source));
                await generateFonts({
                    inputDir: sourcesDir,
                    outputDir: iconfontDir,
                    name: 'iconfont',
                    fontTypes: [FontAssetType.WOFF2],
                    assetTypes: [OtherAssetType.CSS],
                });
                const cssSource = fs.readFileSync(path.resolve(iconfontDir,'iconfont.css'), 'utf-8');
                this.options.injectIconfontStyle({cssSource, compiler, pluginName:PLUGIN_NAME});
            })
        });
    }
}
