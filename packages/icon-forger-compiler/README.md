# @icon-forger/compiler

> `icon-forger` 的编译核心，提供 Babel 插件、Webpack 插件以及供上层接入层消费的编译钩子。

## ✨ 功能特性

- **Babel 转换能力**：识别来源于 `.svg` 的 JSX 组件并替换成自定义运行时模板
- **Webpack 收集能力**：在构建期收集命中的 SVG 资源
- **字体生成能力**：基于 `fantasticon` 生成 `woff2` 和配套 CSS
- **可扩展钩子**：通过 `emitIconFontAssets` 暴露字体输出目录给上层继续处理

## 📦 安装

```bash
npm install @icon-forger/compiler
```

### yarn 安装

```bash
yarn add @icon-forger/compiler
```

### pnpm 安装

```bash
pnpm add @icon-forger/compiler
```

## ⚙️ 使用

更推荐通过 `@icon-forger/taro` 间接使用；如果需要自定义接入层，可以组合 Babel 插件与 Webpack 插件：

```ts
import template from '@babel/template'
import type { JSXElement } from '@babel/types'
import { IconForgerPlugin } from '@icon-forger/compiler'

const iconForgerBabelPlugin = [
  require.resolve('@icon-forger/compiler/babel'),
  {
    dependRequire: ['import { BaseIcon } from "./base-icon"'],
    templateCode: ({ iconName, attributes }) => {
      const node = template.expression(
        `<BaseIcon name="${iconName}" />`,
        { plugins: ['jsx'] }
      )() as JSXElement

      node.openingElement.attributes.push(...attributes)
      return node
    }
  }
]

export default {
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [iconForgerBabelPlugin]
          }
        }
      }
    ]
  },
  plugins: [new IconForgerPlugin()]
}
```

## 🔧 导出项

| 导出路径 | 说明 |
| --- | --- |
| `@icon-forger/compiler` | 导出 `IconForgerPlugin`、类型定义等核心能力 |
| `@icon-forger/compiler/babel` | Babel 插件入口，用于替换 `.svg` JSX 组件 |
| `@icon-forger/compiler/plugin` | `IconForgerPlugin` 单独导出入口 |

## 📝 工作原理

1. Babel 插件追踪 JSX 元素的 import 绑定来源
2. 当绑定来源是 `.svg` 文件时，替换原 JSX 并注入依赖 import
3. Webpack 插件在 `succeedModule` 阶段收集 SVG 源码
4. 在 `processAssets` 阶段把 SVG 写入缓存目录并调用 `fantasticon` 生成字体
5. 通过 `emitIconFontAssets` 钩子把字体输出目录暴露给上层接入包继续处理

## ⚠️ 注意事项

1. **需要自行提供运行时模板**：直接使用 Babel 插件时，必须传入 `templateCode` 来定义 SVG 替换结果。
2. **依赖 Webpack 5 与 Babel 7**：当前类型和实现都按这套编译基础设施设计。
3. **缓存目录默认位于 `node_modules/.cache/icon-forger`**：如需隔离缓存，可通过 `IconForgerPlugin` 的 `cacheDir` 选项覆盖。

## 📄 许可证

MIT License
