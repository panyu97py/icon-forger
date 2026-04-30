# @icon-forger/taro

> Taro 场景下的 SVG 图标编译插件，把业务中的 `.svg` 组件引用转换成统一的 `BaseIcon` 运行时，并在构建阶段自动生成和注入 iconfont 资源。

## ✨ 功能特性

- **开箱即用**：直接通过 Taro 插件接入，无需手动串联 Babel 和 Webpack 能力
- **SVG 组件替换**：将来源于 `.svg` 的 JSX 组件替换成 `<BaseIcon />`
- **自动生成字体**：收集命中的 SVG 资源并生成 `woff2` 与配套样式
- **自动注入样式**：把 iconfont 样式注入到小程序入口样式中

## 📦 安装

```bash
npm install @icon-forger/taro
```

### yarn 安装

```bash
yarn add @icon-forger/taro
```

### pnpm 安装

```bash
pnpm add @icon-forger/taro
```

## ⚙️ 配置

```js
// config/index.js
module.exports = {
  compiler: {
    type: 'webpack5'
  },
  plugins: ['@icon-forger/taro']
}
```

## 🚀 使用

```tsx
import {Icon} from '@/assets/icons/search.svg'

export default function Demo () {
  return <Search size={28} color="#222222" className="demo-icon" />
}
```

## 📝 工作原理

1. 在 Taro `babelLoader` 中自动注入 `@icon-forger/compiler/babel`
2. 遇到来源于 `.svg` 的 JSX 组件时，替换成 `<BaseIcon name="图标名" />`
3. 透传原 JSX 上的属性，例如 `size`、`color`、`className`
4. 注册 `IconForgerPlugin` 统一收集 SVG 资源并生成 iconfont
5. 注册 `InjectIconFont` 将生成后的字体样式注入到 `app` 入口样式

## ⚠️ 注意事项

1. **依赖 Taro 构建链**：该包不是通用 React 图标库，主要服务于 Taro 插件接入场景。
2. **依赖 `@tarojs/components` 与 `@tarojs/taro`**：使用前请保证宿主项目已经安装对应 peerDependencies。
3. **样式后缀按环境注入**：当前支持 `weapp`、`alipay`、`tt` 三类样式后缀映射。

## 📄 许可证

MIT License
