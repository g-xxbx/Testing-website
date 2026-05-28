# 课程自测平台

一个基于 Next.js 的在线自测 Web 应用，支持多门课程的选择题练习。

## 功能

- **多课程切换**：可在"工程伦理及项目管理"与"习近平新时代中国特色社会主义思想概论"之间切换
- **单选/多选**：支持单选题和多选题两种题型
- **即时反馈**：选择答案后立即显示正确/错误标记
- **错题回顾**：集中重做所有答错的题目
- **进度持久化**：答题进度自动保存至浏览器 localStorage，刷新不丢失
- **导出错题**：一键复制错题 JSON 到剪贴板
- **进度重置**：一键清空所有答题记录

## 文件结构

```
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 根布局
│   │   ├── page.tsx            # 主页面（课程选择 + 答题逻辑）
│   │   └── globals.css         # 全局样式（Tailwind CSS）
│   ├── components/
│   │   ├── QuestionCard.tsx    # 题目卡片组件（单选/多选）
│   │   ├── QuizHeader.tsx      # 顶部导航栏（课程切换 + 进度）
│   │   └── QuizFooter.tsx      # 底部操作栏（重置/回顾/导出）
│   ├── data/
│   │   ├── courses.ts          # 课程注册表（加载所有课程数据）
│   │   ├── questions.ts        # 工程伦理 213 道题（硬编码）
│   │   └── 习近平思想_全部章节.json  # 习近平思想 180 道题
│   └── types/
│       └── index.ts            # 类型定义
├── public/                     # 静态资源
├── .gitignore
├── next.config.ts              # Next.js 配置
├── package.json                # 依赖管理
├── postcss.config.mjs           # PostCSS 配置
├── tsconfig.json               # TypeScript 配置
└── eslint.config.mjs           # ESLint 配置
```

## 技术栈

| 技术 | 用途 |
|---|---|
| Next.js 16 (App Router) | React 框架 |
| React 19 | UI 库 |
| TypeScript | 类型安全 |
| Tailwind CSS 4 | 样式 |
| localStorage | 进度持久化 |

## 部署

仅需 `src/`、`public/`、`package.json`、`next.config.ts`、`tsconfig.json`、`postcss.config.mjs`、`eslint.config.mjs` 即可部署。推荐通过 [Vercel](https://vercel.com) 部署：

1. 将代码推送到 GitHub 仓库
2. 在 Vercel 导入该仓库
3. 自动识别 Next.js，无需额外配置

```bash
npm run build    # 本地构建验证
npm run dev      # 本地开发
```

## Skill（OpenCode 技能）

项目根目录下的 `.opencode/skills/chaoxing-quiz-extractor/` 包含一个 OpenCode 技能——**超星学习通选择题摘录器**。该技能用于从学习通（mooc1.chaoxing.com）页面中自动提取作业的选择题（题干、选项、正确答案），输出结构化 JSON 文件。本项目的部分题目数据（习近平思想课程）即通过该技能从学习通摘录而来。
