# NextSpace Server v1.x

<pre align="center">
🧪 Working in Progress
</pre>

<!-- ```
  ____ ____                                     
 / ___/ ___|       ___  ___ _ ____   _____ _ __ 
| |  _\___ \ _____/ __|/ _ \ '__\ \ / / _ \ '__|
| |_| |___) |_____\__ \  __/ |   \ V /  __/ |   
 \____|____/      |___/\___|_|    \_/ \___|_|   
``` -->

<!-- ![total line](https://tokei.rs/b1/github/wibus-wee/GS-server)  -->
<!-- ![language](https://img.shields.io/github/languages/top/wibus-wee/GS-server)  -->
<!-- ![core](https://img.shields.io/github/package-json/dependency-version/wibus-wee/GS-server/@nestjs/core)  -->
<!-- ![code size](https://img.shields.io/github/languages/code-size/wibus-wee/GS-server)  -->
<!-- ![issues](https://img.shields.io/github/issues/wibus-wee/GS-server)  -->
<!-- ![commit](https://img.shields.io/github/commit-activity/m/wibus-wee/GS-server)  -->
<!-- ![commit_last](https://img.shields.io/github/last-commit/wibus-wee/GS-server)  -->
<!-- [![Node.js Build CI](https://github.com/wibus-wee/GS-server/actions/workflows/build.yml/badge.svg)](https://github.com/wibus-wee/GS-server/actions/workflows/build.yml)  -->
<!-- [![GitHub stars](https://img.shields.io/github/stars/wibus-wee/GS-server.svg?style=flat)](https://github.com/wibus-wee/GS-server/stargazers) -->

the RESTful API service for N Space, powered by @nestjs.
## Activity

![version](https://img.shields.io/github/package-json/v/wibus-wee/GS-server) 
[![DeepScan grade](https://deepscan.io/api/teams/14175/projects/18839/branches/473312/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=14175&pid=18839&bid=473312) 
[![Deploy Server](https://github.com/wibus-wee/GS-server/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/wibus-wee/GS-server/actions/workflows/deploy.yml) 

![Alt](https://repobeats.axiom.co/api/embed/c901877ec290fab2cf7184b8ce2510da577401a1.svg "Repobeats analytics image")

## Get Started

目前 NS-server 只支援 Node.js 環境，請使用 Node.js 環境執行。

NS-server 有两种启动方式：运行 bundle (recommended) / 编译运行 (for development)。

但是 bundle 目前为 Beta 状态，仅在 GitHub Action 中输出，暂时不上传至 Release Assets。

## EJS Templates Engine (Beta)

> 🧪 实验性功能，可能会有 bug，请谨慎使用。

由于 Express 支持配置视图引擎 EJS，因此 NextSpace 可以使用 EJS 作为模板引擎。视图文件夹为 `views`，模板文件夹为 `views/{templatesName}` 默认配置为 `views/default`

模板的选择有两种方式：`process.env` 和 数据库的Configs表，以 `env` 为优先级，若都无配置，则默认使用 `default`

推荐你使用 bundle 运行服务端，接着在运行目录下新建 `views` 文件夹，将 default 主题复制过去

### Engine TODO

- [X] 动态路由
- [X] 404 错误页面
- [ ] 其他模板引擎
- [ ] 支持模板的缓存
- [ ] ...

## Project Sponsors

感谢 **Salted Fish**  的静态资源托管

感谢 **小沐** 的对项目大力支持

## Reference

This project referred to: 

- [mx-space/mx-server](https://github.com/mx-space/mx-server)

## License

此项目 AGPLv3 授权开源，使用此项目进行的二次创作或者衍生项目也必须开源。

## Author

ns-server © Wibus, Released under the AGPL-3.0 License. Created on 2021-09-25

> [Personal Website](http://iucky.cn/) · [Blog](https://blog.iucky.cn/) · GitHub [@wibus-wee](https://github.com/wibus-wee/) · Telegram [@wibus✪](https://t.me/wibus_wee)