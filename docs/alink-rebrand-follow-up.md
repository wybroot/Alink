# Alink 重命名后续清单

更新日期：2026-09-22

## 已完成

- 前台、后台、登录页和默认系统配置已改为 Alink Monitor / Alink 监控。
- 当前 SQLite 活动配置已同步为 Alink。
- 默认 Logo 已改为 A 形 SVG，并完成开发与生产页面验证。
- 告警默认标题、服务端和 Agent 的用户可见品牌文案已更新。

## 低风险清理

- 替换或删除 `web/public/logo.png`，其中仍是旧 PW Logo。
- 重新生成 README 引用的 `screenshots/*.png`，旧截图仍包含 PIKAW MONITOR 和旧界面。
- 更新或删除 `scripts/generate_logo.py`，其中仍包含旧 Logo 逻辑和本机绝对路径。
- 将 Vite 插件名 `pikaw-dev-system-config` 改为 Alink 命名。
- 更新 `internal/assets/ui_test.go` 中的测试字符串 `console.log("pikaw")`。
- 评估将 JWT issuer 从 `pikaw` 改为 `alink`；当前验证逻辑不校验 issuer。

## 外部资源准备后修改

- GitHub 仓库仍为 `github.com/wybroot/pikaw`。仓库重命名后，再更新 README、页脚、脚本链接及 Go module。
- Docker 镜像仍为 `wangyanbiao/pikaw`。先发布 Alink 镜像并保留旧标签，再更新 Compose、Dockerfile 和 CI。

## 必须迁移，禁止直接替换

- `pikaw_*` VictoriaMetrics 指标：需要双写、双查和历史数据迁移，否则历史图表会为空。
- `pikaw-agent` 服务名、二进制名、`~/.pikaw` 配置目录、Socket 和 PAM Hook：需要兼容读取、服务别名和升级迁移。
- `data/pikaw.db`、PostgreSQL 数据库名、Compose 服务和网络名：需要数据文件、Volume 和部署迁移。
- `PIKAW_*` 环境变量：先增加 `ALINK_*` 别名，至少保留一个兼容周期。
- `__PIKAW_CUSTOM_*__` 模板标记：如需重命名，必须同步模板渲染器、测试和 CI。

## 检查基线

- 受版本控制文件中共有 405 行、114 个文件包含 `pikaw`，主要是 Go import、指标名和部署兼容标识。
- 当前活动系统配置、通知、告警、DNS 和 Agent 安装配置中没有 `pikaw`。
- SQLite 文件空闲页中仍可检出旧名称；备份后执行 `VACUUM` 可物理清除，不影响当前运行。
