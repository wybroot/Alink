# Alink Project Context

后续处理本仓库时先使用本文件的上下文，只扫描与当前任务直接相关的目录；除非本文件已过时或任务需要，不要重新做全仓库盘点。

## 项目概览

- Alink 是基于 Pika 二次开发的服务器监控平台。
- 后端：Go 1.26、Echo、GORM、Google Wire。
- 前端：React 19、TypeScript、Vite 7、Ant Design 6、Tailwind CSS 4、TanStack Query、Recharts。
- 两个二进制入口：`cmd/serv/main.go`（服务端）和 `cmd/agent/main.go`（探针）。
- Agent 通过 `/ws/agent` WebSocket 注册并上报指标、安全审计、防篡改及 SSH 登录事件。
- SQLite/PostgreSQL 保存业务数据；VictoriaMetrics 保存时序指标。
- `internal/app.go` 负责初始化、后台任务、静态前端和 API 路由。
- 前端分公开监控门户与 `/admin` 管理后台，主要路由在 `web/src/router/index.tsx`。
- Docker Compose 提供 SQLite 和 PostgreSQL 两种部署方案，默认端口为 8080。

## 最近验证（2026-09-23）

- `go test ./...` 通过。Windows 沙箱环境需要把 `GOCACHE` 指向可写的临时目录。
- `cd web && npm run build` 通过。
- 两份 Compose 文件通过 YAML 语法解析；当前环境未安装 Docker，尚未执行 `docker compose config`。
- `cd web && npm run lint` 失败：ESLint 9 缺少 `eslint.config.js`。
- 前端构建有约 593 kB 的大 chunk 警告。
- 当时 Git 工作区干净。

## 已知工程问题

- 约 4 万行源码只有三个 Go 测试文件，前端没有自动化测试。
- 仓库同时包含 `yarn.lock` 和 `package-lock.json`，而 Makefile 使用 Yarn，应统一包管理器。
- 示例配置包含 `admin/admin123`，生产部署必须修改。
- JWT Secret 为空时服务端每次启动生成随机值，重启会使已有登录失效。
- API Key 当前以明文存库，并支持查询原文，需要生产安全评估。
- 优先建议：恢复 lint、补核心认证/API/指标链路测试、强化默认配置、再做前端拆包。

## 常用入口

- `README.md`：项目及部署说明
- `internal/app.go`：应用初始化、API 和后台任务
- `internal/service/`：业务逻辑
- `internal/handler/`：HTTP/WebSocket 处理
- `internal/repo/`：数据访问
- `pkg/agent/`：Agent 核心能力
- `web/src/api/`：前端 API 客户端
- `web/src/admin/`、`web/src/portal/`：管理端与公开端
