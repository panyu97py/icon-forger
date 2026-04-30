<div align="center">
  <h1>icon-forger</h1>
  <p>一组面向 <strong>Taro（Webpack5）小程序</strong> 的 SVG 图标编译工具链。</p>
  <p>通过 <strong>SVG 组件替换</strong>、<strong>构建期 iconfont 生成</strong> 与 <strong>入口样式自动注入</strong>，让业务图标接入更轻、更统一。</p>
  <a href="https://www.npmjs.com/package/@icon-forger/compiler">
    <img src="https://img.shields.io/npm/v/%40icon-forger%2Ftaro.svg?style=flat-square" alt="npm version">
  </a>
  <a href="https://www.npmjs.com/package/@icon-forger/compiler">
    <img src="https://img.shields.io/npm/l/%40icon-forger%2Ftaro.svg?style=flat-square" alt="npm license">
  </a>
  <a href="https://www.npmjs.com/package/@icon-forger/compiler">
    <img src="https://img.shields.io/npm/dt/%40icon-forger%2Ftaro.svg?style=flat-square" alt="npm downloads">
  </a>
  <a href="https://github.com/panyu97py/icon-forger">
    <img src="https://img.shields.io/github/commit-activity/w/panyu97py/icon-forger" alt="GitHub commit activity">
  </a>
</div>

## ✨ Features

- 🧱 将业务中的 `.svg` 组件编译为统一的 `BaseIcon` 运行时组件
- 🔤 构建阶段自动收集命中的 SVG 资源，并生成 `woff2` iconfont 与配套样式
- 🎯 自动保留原 JSX 属性透传，尽量减少业务接入改造成本
- 🎨 自动把 iconfont 样式注入 Taro 小程序入口样式，无需手动维护字体文件
- 🧩 提供 Taro 接入层与编译核心，既可开箱即用，也支持按需组合
- ⚙️ 支持自定义 Babel 模板与 Webpack 扩展，方便适配不同运行时方案

## 📦 Packages

| Package | Description |
| --- | --- |
| [`@icon-forger/taro`](./packages/icon-forger-taro/README.md) | Taro 插件封装，内置 Babel 转换、iconfont 生成与样式注入能力 |
| [`@icon-forger/compiler`](./packages/icon-forger-compiler/README.md) | 编译核心，提供 Babel 插件、Webpack 插件与可扩展编译钩子 |

## 📁 Repository Structure

```text
.
├── assets/
│   ├── alipay-pay-code.JPG
│   └── wechat-pay-code.JPG
├── example/
│   └── example-applet-react/
├── packages/
│   ├── icon-forger-compiler/
│   └── icon-forger-taro/
├── .github/workflows/
└── README.md
```

## ❤️ 支持项目 / Sponsor

如果 `icon-forger` 在你的项目中帮你：

- 成功统一了 SVG 图标接入方式 📦
- 节省了图标字体生成、维护与排查时间 ⏱️

欢迎通过打赏的方式支持项目持续维护与迭代 🙏

你的支持将用于：

- 新版本 Taro / Webpack 构建链适配
- 图标生成性能与稳定性优化
- 文档、示例与最佳实践完善

开源不易，感谢你的认可 ❤️

### ☕️ 请作者喝杯咖啡

如果这个项目对你有帮助，可以请作者喝杯咖啡 ☕  
每一份支持，都会转化为更稳定、更好用的图标编译方案。

| 微信 | 支付宝 |
| :---: | :---: |
| <img src="./assets/wechat-pay-code.JPG" height="200" /> | <img src="./assets/alipay-pay-code.JPG" height="200" /> |

感谢你的支持，开源不易 ❤️

### 🌟 其他支持方式

- 给仓库点一个 `Star`
- 提交 Issue 或 Pull Request 分享你的使用反馈与改进建议
- 在团队或社区中推荐本项目

## 📄 License

MIT License

## 🤝 Contributing

欢迎提交 Issue 和 Pull Request。
