# Alink 命名迁移记录

更新日期：2026-09-23

## 已完成

- GitHub 仓库、Go module、源码 import、README 链接和页脚已统一为 `github.com/wybroot/alink`。
- 服务端和 Agent 二进制、服务名、配置目录、日志、Socket 与 PAM Hook 已统一为 Alink 命名。
- VictoriaMetrics 指标前缀、SQLite 文件、PostgreSQL 数据库、Compose 服务与网络已统一为 Alink 命名。
- 环境变量和前端模板标记已统一为 `ALINK_*` 与 `__ALINK_CUSTOM_*__`。
- Dockerfile、Compose 和发布流水线已切换到 `wangyanbiao/alink` 与 `ghcr.io/wybroot/alink`。
- 默认 Logo、产品截图、系统文案、告警标题和 JWT issuer 已统一为 Alink。
- 项目尚未发布且没有用户数据，因此本次直接切换，不保留运行时兼容层。
- Git 历史完整保留，更名前名称仅存在于历史提交中。

## 验收结果

- 当前工作树旧名称及旧名称文件名扫描结果为零。
- `go test ./...` 通过。
- `web` 生产构建通过。
- SQLite 和 PostgreSQL Compose 文件已通过 YAML 语法解析；当前环境未安装 Docker，仍需在 Docker 环境补跑 `docker compose config`。
