<div align="center">
  <h1>📚 知序笔记 · ZhixuBiji</h1>
  <p>一款纯本地、零服务器的轻量读书笔记应用 — 专注原文摘录、要点总结与感悟记录</p>
  <p>
    <img alt="React" src="https://img.shields.io/badge/React-19-61dafb?logo=react" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript" />
    <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_v4-4.1-38bdf8?logo=tailwindcss" />
    <img alt="Vite" src="https://img.shields.io/badge/Vite-6.2-646cff?logo=vite" />
    <img alt="Capacitor" src="https://img.shields.io/badge/Capacitor-8.5-119def?logo=capacitor" />
    <img alt="Android Gradle Plugin" src="https://img.shields.io/badge/AGP-8.13-3ddc84?logo=android" />
  </p>
  <p>
    <a href="https://github.com/niklaus3016/zhixubiji/actions/workflows/build-android.yml">
      <img alt="Build Status" src="https://github.com/niklaus3016/zhixubiji/actions/workflows/build-android.yml/badge.svg" />
    </a>
  </p>
</div>

---

## ✨ 功能特性

- 📖 **三分类读书笔记**：原文摘录 / 要点总结 / 个人感悟 — 贴合读书用户的真实场景
- 🏷️ **标签管理**：跨书按标签聚合笔记，快速检索与分类
- 📊 **阅读数据统计**：KPI 卡片、状态分布、笔记偏好一目了然
- 🔍 **全局搜索**：模糊匹配书名、作者、原文、思考、页码、标签
- 💾 **纯本地存储**：IndexedDB，零后端服务器，100% 隐私可控
- 📤 **多档导出**：单笔记 txt / 整本书 Markdown / 全库 JSON 备份
- 📱 **Android 原生打包**：Capacitor 8 壳 + Gradle 自动构建签名 APK
- 🔐 **隐私合规**：首次启动协议与隐私政策弹窗，支持查看完整条款

---

## 🛠️ 技术栈

| 层 | 技术 |
|---|---|
| UI 框架 | React 19 + TypeScript |
| 构建工具 | Vite 6 |
| 样式方案 | Tailwind CSS v4 + `@tailwindcss/vite` 插件 |
| 图标 | lucide-react |
| 本地数据库 | IndexedDB（原生 API 封装）|
| 移动端壳 | Capacitor 8（Android，minSdk 24 / targetSdk 36 / compileSdk 36）|
| CI/CD | GitHub Actions（自动构建 Debug + Release APK）|

---

## ⚙️ 本地开发

### 前置条件

- Node.js ≥ 20
- Android JDK 17（仅在本地编译 APK 时需要）

### 启动 Web 应用

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（默认端口 3031，可 0.0.0.0 外部访问）
npm run dev
```

浏览器打开 `http://localhost:3031` 即可预览。

### 代码检查

```bash
npm run lint   # TypeScript 类型检查
npm run build  # 生产构建到 dist/
```

---

## 📦 构建 Android APK

### 方式一：GitHub Actions（推荐）

推送代码到 `main` 分支会自动触发 CI，构建 Debug + Release 两个签名版 APK，产物在 Actions 详情页底部以 Artifact 形式下载（保留 30 天）。

**运行页面**：👉 [GitHub Actions → Build Android APK](https://github.com/niklaus3016/zhixubiji/actions/workflows/build-android.yml)

### 方式二：本地构建

```bash
# 1. 构建 web 资源并同步到 Android 工程
npm run build
npx cap sync android

# 2. 生成签名 keystore（只需一次，记录好密码和 alias）
cd android
keytool -genkeypair -v \
  -keystore my-release-key.keystore \
  -alias zhixubiji \
  -keyalg RSA -keysize 2048 \
  -validity 10000 \
  -storepass 你的密码 \
  -keypass 你的密码

# 3. 设置密码环境变量
export KEYSTORE_PASSWORD=你的密码
export KEY_ALIAS=zhixubiji
export KEY_PASSWORD=你的密码

# 4. 构建 Release APK（已签名）
./gradlew assembleRelease

# 5. 输出路径
ls app/build/outputs/apk/release/app-release.apk
```

验证签名：
```bash
keytool -printcert -jarfile app/build/outputs/apk/release/app-release.apk
```

---

## 🔑 GitHub Secrets 配置

仓库 Settings → Secrets and variables → Actions 需配置以下 Secrets：

| Secret 名 | 说明 |
|---|---|
| `KEYSTORE_BASE64` | `my-release-key.keystore` 文件的 base64 编码 |
| `KEYSTORE_PASSWORD` | keystore 的存储密码（store password）|
| `KEY_ALIAS` | 密钥别名（如 `zhixubiji`）|
| `KEY_PASSWORD` | 密钥密码（key password，可与 store password 相同）|

生成 `KEYSTORE_BASE64` 的命令：
```bash
# Linux / macOS
base64 -w 0 my-release-key.keystore
```

---

## 🗂️ 项目结构

```
project/
├── src/
│   ├── App.tsx                 # 入口，状态 + 基于 tab 的伪路由
│   ├── main.tsx                # React 挂载点
│   ├── index.css               # 全局暗色主题
│   ├── types.ts                # Book / ReadingNote / Tag 类型
│   ├── components/             # 8 个 UI 组件
│   │   ├── Header / BottomNav  # 顶/底导航
│   │   ├── BookCard / BookModal
│   │   ├── NoteCard / RichToolbar
│   │   ├── GlobalSearchModal
│   │   ├── ConfirmModal
│   │   └── PrivacyConsent      # 首次启动协议弹窗 + 协议详情
│   ├── lib/
│   │   ├── db.ts               # IndexedDB 封装（含默认种子数据）
│   │   └── formatters.ts       # 日期 / badge / Markdown 导出工具
│   └── views/                  # 6 个页面
│       ├── LibraryView         # 书籍库（grid/list 切换 + 过滤）
│       ├── BookDetailView      # 书籍详情 + 笔记列表
│       ├── NoteEditView        # 笔记编辑（摘录/总结/感悟三分类）
│       ├── TagsView            # 标签聚合
│       ├── StatsView           # 阅读数据统计
│       └── SettingsView        # 设置 + 备份/导入 + 隐私协议
├── android/                    # Capacitor 生成的 Android 工程
├── .github/workflows/
│   └── build-android.yml       # CI：自动构建 Debug + Release APK
├── capacitor.config.json
├── vite.config.ts              # Tailwind v4 + React 插件
├── tsconfig.json
├── package.json
└── privacy-policy-zxbj.html    # 在线隐私政策网页版
```

---

## 📄 应用元信息

| 项 | 值 |
|---|---|
| 应用名称 | 知序笔记 |
| 应用 ID / 包名 | `com.zhixubiji.app` |
| 版本 | V1.0 (versionCode 1) |
| 开发公司 | 光年跃迁（温州）科技有限公司 |
| 联系邮箱 | Jp112022@163.com |
| 隐私政策生效日期 | 2026年08月18日 |

---

## 📜 License & Credits

开发公司：**光年跃迁（温州）科技有限公司**  
联系邮箱：[Jp112022@163.com](mailto:Jp112022@163.com)

© 2026 光年跃迁（温州）科技有限公司 版权所有
