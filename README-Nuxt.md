# 拼音打印工具 - Nuxt.js 版本

## 项目说明

本项目是从 Vue.js + Vite 项目迁移到 Nuxt.js 3 的版本，保持了原有的功能特性，同时获得了 Nuxt.js 的 SSR、路由自动生成等优势。

## 项目结构

```
pinyin-print/
├── pages/                 # Nuxt.js 页面 (自动路由)
│   ├── index.vue          # 首页 (原 home.vue)
│   ├── print.vue          # 打印页面
│   ├── page1.vue          # 页面1
│   └── page2.vue          # 页面2
├── components/            # 组件目录
│   ├── ui/                # UI 组件
│   ├── animation/         # 动画组件
│   └── print/             # 打印组件
├── stores/                # Pinia 状态管理
├── plugins/               # Nuxt.js 插件
├── assets/                # 静态资源
├── utils/                 # 工具函数
├── config/                # 配置文件
├── api/                   # API 接口
└── public/                # 公共静态文件
```

## 主要功能

1. **3D全景展示** - 首页包含基于 Three.js 的 3D 交互展示
2. **拼音打印** - 支持上传 Word 文档，自动生成拼音并导出 PDF
3. **响应式设计** - 适配桌面端和移动端
4. **动画效果** - 多种开场动画和视角控制

## 安装和运行

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 开发模式

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

访问 http://localhost:8080

### 生产构建

```bash
npm run build
# 或
yarn build
# 或
pnpm build
```

### 预览生产构建

```bash
npm run preview
# 或
yarn preview
# 或
pnpm preview
```

## 路由说明

Nuxt.js 基于文件系统自动生成路由：

- `/` -> `pages/index.vue` (首页)
- `/print` -> `pages/print.vue` (打印页面)
- `/page1` -> `pages/page1.vue` (页面1)
- `/page2` -> `pages/page2.vue` (页面2)

## 环境变量

- `NUXT_PUBLIC_APP_TITLE` - 应用标题
- `NUXT_PUBLIC_HTTP_URL` - API 基础地址

## 主要依赖

- **Nuxt 3** - 全栈 Vue 框架
- **Three.js** - 3D 图形库
- **Pinia** - 状态管理
- **Vant** - 移动端 UI 组件库
- **pinyin-pro** - 拼音处理
- **html2canvas** + **jsPDF** - PDF 生成

## 迁移说明

### 从原 Vue 项目迁移的主要变化：

1. **路由系统** - 从 vue-router 改为 Nuxt.js 文件系统路由
2. **项目结构** - 调整为 Nuxt.js 推荐的目录结构
3. **插件系统** - 使用 Nuxt.js 插件替代 main.js 中的配置
4. **环境变量** - 从 `VITE_` 前缀改为 `NUXT_PUBLIC_` 前缀
5. **构建工具** - 从 Vite 改为 Nuxt.js 内置的构建系统

### 保留的原有功能：

- 所有组件逻辑
- Three.js 3D 展示
- PDF 打印功能
- 样式和动画
- API 调用逻辑

## 开发说明

1. 使用 `~/` 别名引用项目根目录
2. 页面组件自动获得 SEO Meta 功能
3. 支持服务端渲染 (SSR) 和静态生成 (SSG)
4. 组件自动导入，无需手动引入
5. 支持 TypeScript

## 部署

### 静态部署

```bash
npm run generate
```

生成的静态文件在 `.output/public` 目录

### 服务端部署

```bash
npm run build
npm run start
```

## 注意事项

1. Three.js 等客户端库需要在 `.client.ts` 后缀的插件中引入
2. 大文件资源建议放在 `public/` 目录
3. 环境变量需要 `NUXT_PUBLIC_` 前缀才能在客户端访问