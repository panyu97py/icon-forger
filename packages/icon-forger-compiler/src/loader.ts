import path from 'path';
import webpack from 'webpack';

export interface LoaderOptions {
    template:(iconName:string) => string;
}

export function iconForgerLoader (this: webpack.LoaderContext<LoaderOptions>, source: string) {
    const name = path.basename(this.resourcePath, '.svg');

    const componentCode = this.getOptions().template(name);

    const requestPath = this.utils.contextify(this.context, this.resourcePath);

    return `
      import url from ${requestPath};
    
      import 'virtual:iconfont';
    
      export default url;
    
      ${componentCode}
      `;
}
