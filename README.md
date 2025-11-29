# BeautySexMap - 成人/情趣用品 UX 旅程生成器

<div align="center">

**用同理心设计。为私密产品生成详细的用户旅程图。**

[功能特性](#功能特性) • [快速开始](#快速开始) • [使用指南](#使用指南) • [技术栈](#技术栈)

</div>

---

## 📖 项目简介

BeautySexMap 是一个专业的 UX 研究工具，专为成人健康科技（SexTech）领域设计。通过 AI 驱动的智能分析，帮助产品设计师和用户体验研究员快速生成详细、富有同理心的用户旅程图。

### 核心价值

- **同理心驱动**：基于科学、不带偏见的研究视角
- **场景化分析**：支持多种环境、社交、时间和情绪场景
- **专业深度**：涵盖痛点、机会点、技术支撑等多维度分析
- **品牌洞察**：深度理解不同品牌（Lelo、Satisfyer、We-Vibe、Lovense、小怪兽、大人糖等）的差异化定位

## ✨ 功能特性

### 🤖 多模型支持

- **Google Gemini** - 快速响应，结构化输出
- **ChatGPT (OpenAI)** - 深度理解，高质量分析
- **DeepSeek** - 中文优化，专业术语支持

### 🎯 场景变量配置

- **环境场景**：卧室、浴室、旅行/酒店、公共场所/远程
- **社交情境**：独处自娱、伴侣互动、异地远程
- **时间节奏**：早晨匆忙、晚间放松、深夜、周末闲暇
- **情绪目标**：放松治愈、探索冒险、激情强烈、趣味调皮

### 📊 旅程图维度

每个旅程阶段包含：

- **目标**：用户在此阶段的意图
- **行为**：用户的具体操作
- **想法**：用户的内心独白
- **情绪与连接**：情感状态可视化（1-10 分情绪曲线）
- **接触点**：设备、应用或物理对象
- **痛点**：具体的摩擦点和困难
- **机会点**：可操作的设计改进建议
- **技术实现支撑点**：专业的技术方案

### 🛠️ 编辑与导出

- **实时编辑**：支持在线编辑旅程图的各个阶段和字段
- **阶段管理**：添加、删除、重命名旅程阶段
- **图片导出**：一键导出高清旅程图为 PNG 图片
- **背景信息**：支持上传文件或粘贴参考资料，增强分析深度

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 或 **yarn** >= 1.22.0

### 安装步骤

1. **克隆仓库**

```bash
git clone git@github.com:taptaq/SEX_UX_JOURNEY.git
cd beautySexMap---ux-journey-generator
```

2. **安装依赖**

```bash
npm install
```

3. **配置环境变量**

创建 `.env.local` 文件（可选，也可以在应用内直接输入 API Key）：

```env
# Google Gemini API Key
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI API Key (可选)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# DeepSeek API Key (可选)
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

> 💡 **获取 API Key**
>
> - Gemini: [Google AI Studio](https://aistudio.google.com/app/apikey)
> - OpenAI: [OpenAI Platform](https://platform.openai.com/api-keys)
> - DeepSeek: [DeepSeek Platform](https://platform.deepseek.com/)

4. **启动开发服务器**

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

### 预览生产构建

```bash
npm run preview
```

## 📚 使用指南

### 基本流程

1. **选择 AI 模型**

   - 在顶部导航栏选择要使用的 AI 模型（Gemini / ChatGPT / DeepSeek）
   - 输入对应的 API Key（如果未在环境变量中配置）
2. **描述用户画像和故事线**

   - 在文本框中输入目标用户的描述和主要故事线
   - 例如：`一位忙碌的市场主管为了缓解压力，第一次尝试使用APP控制的跳蛋...`
3. **添加背景信息（可选）**

   - 点击 "+ 添加背景信息 / 参考资料"
   - 可以粘贴文本或上传文件（.txt, .md, .json）
   - 支持品牌资料、用户访谈、产品文档等
4. **生成旅程图**

   - 点击 "生成旅程图" 按钮
   - 等待 AI 分析生成（通常需要 10-30 秒）
5. **调整场景变量**

   - 生成后，可以在顶部面板调整场景变量
   - 系统会自动重新生成旅程图（500ms 防抖）
6. **编辑和优化**

   - 点击任意字段进行编辑
   - 可以添加、删除或重命名阶段
   - 所有修改实时保存
7. **导出旅程图**

   - 点击右上角 "导出图片" 按钮
   - 生成高清 PNG 图片，可用于报告和演示

### 高级功能

#### 品牌分析

在用户描述中提及具体品牌（如 Lelo、Satisfyer、小怪兽等），AI 会结合品牌特色进行分析：

- 品牌核心理念
- 主要卖点和功能特性
- 差异化定位
- 优化建议

#### 背景信息增强

上传或粘贴以下类型的背景信息可以显著提升分析质量：

- 品牌定位文档
- 用户访谈记录
- 竞品分析报告
- 产品功能说明
- 市场调研数据

#### 场景变量组合

不同的场景变量组合会产生完全不同的旅程图：

- **独处 + 深夜 + 放松** → 关注隐私、静音、易用性
- **伴侣 + 旅行 + 冒险** → 关注同步、便携、互动性
- **远程 + 周末 + 趣味** → 关注连接稳定性、娱乐性、社交功能

## 🏗️ 技术栈

### 前端框架

- **React 19.2.0** - UI 框架
- **TypeScript 5.8.2** - 类型安全
- **Vite 6.2.0** - 构建工具

### UI 组件库

- **Lucide React** - 图标库
- **Tailwind CSS** - 样式框架（通过类名使用）

### 数据可视化

- **Recharts 3.5.0** - 情绪曲线图表

### AI 集成

- **@google/genai 1.30.0** - Google Gemini SDK
- **OpenAI SDK** - ChatGPT API（通过 OpenAI 兼容接口）

### 工具库

- **html2canvas 1.4.1** - 图片导出功能

## 📁 项目结构

```
beautySexMap---ux-journey-generator/
├── App.tsx                 # 主应用组件
├── index.tsx               # 应用入口
├── types.ts                # TypeScript 类型定义
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
├── package.json            # 项目依赖
├── components/
│   ├── JourneyTimeline.tsx # 旅程图时间线组件
│   └── VariablePanel.tsx   # 场景变量面板组件
├── services/
│   └── aiService.ts        # AI 服务封装
└── dist/                   # 构建输出目录
```

## 🔧 配置说明

### 环境变量

| 变量名                    | 说明                   | 必需 |
| ------------------------- | ---------------------- | ---- |
| `VITE_GEMINI_API_KEY`   | Google Gemini API 密钥 | 否   |
| `VITE_OPENAI_API_KEY`   | OpenAI API 密钥        | 否   |
| `VITE_DEEPSEEK_API_KEY` | DeepSeek API 密钥      | 否   |

> 注意：如果未配置环境变量，可以在应用内直接输入 API Key。

### Vite 配置

默认配置：

- 开发服务器端口：`3000`
- 主机地址：`0.0.0.0`（允许外部访问）

可在 `vite.config.ts` 中自定义配置。

## 🎨 设计理念

### 专业性与同理心

- 采用临床或健康导向的术语
- 避免俚语或过于露骨的表达
- 关注完整的整体体验：身体感受、情绪状态、心理安全感

### 数据驱动

- 情绪分数量化（1-10 分）
- 可视化情绪曲线
- 结构化的痛点、机会点、技术支撑点分析

### 可操作性

- 每个机会点都提供具体的设计建议
- 技术支撑点包含专业术语和实现方案
- 支持实时编辑和迭代优化

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 开发说明

### 开发模式

```bash
npm run dev
```

### 类型检查

```bash
npx tsc --noEmit
```

### 代码规范

项目使用 ESLint 进行代码检查，建议在提交前运行：

```bash
npm run lint
```

## ⚠️ 注意事项

1. **API 密钥安全**

   - 不要将 API 密钥提交到版本控制系统
   - 使用环境变量或应用内输入方式管理密钥
2. **AI 生成内容**

   - AI 生成的内容应由人工研究员进行验证
   - 建议结合实际用户研究数据进行交叉验证
3. **隐私保护**

   - 本工具不存储任何用户输入或生成的旅程图数据
   - 所有 API 调用直接发送到对应的 AI 服务提供商
4. **网络连接**

   - 需要稳定的网络连接以调用 AI API
   - 如果网络不稳定，系统会自动切换到离线演示模式

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- 感谢所有为 SexTech 领域用户体验研究做出贡献的设计师和研究员
- 感谢 Google、OpenAI、DeepSeek 提供的 AI 服务支持

## 📮 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 [Issue](https://github.com/taptaq/SEX_UX_JOURNEY/issues)
- 发送邮件至项目维护者

---

<div align="center">

**Built with ❤️ for UX Researchers and Product Designers**

*让设计更有同理心，让产品更懂用户*

</div>
