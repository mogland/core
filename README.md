# NextSpace Server v1.x

<pre align="center">
🧪 Working in Progress
</pre>

<!-- 
```
____ ____
 / ___/ ___|       ___  ___ _ ____   _____ _ __ 
| |  _\___ \ _____/ __|/ _ \ '__\ \ / / _ \ '__|
| |_| |___) |_____\__ \  __/ |   \ V /  __/ |   
 \____|____/      |___/\___|_|    \_/ \___|_|   

```
-->

the RESTful API service for N Space, powered by @nestjs.


## Activity

[![wakatime](https://wakatime.com/badge/github/wibus-wee/nx-server.svg)](https://wakatime.com/badge/github/wibus-wee/nx-server)
![version](https://img.shields.io/github/package-json/v/wibus-wee/GS-server) 
[![DeepScan grade](https://deepscan.io/api/teams/14175/projects/18839/branches/473312/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=14175&pid=18839&bid=473312) 
[![Deploy Server](https://github.com/wibus-wee/GS-server/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/wibus-wee/GS-server/actions/workflows/deploy.yml) 

![Alt](https://repobeats.axiom.co/api/embed/c901877ec290fab2cf7184b8ce2510da577401a1.svg "Repobeats analytics image")

## Get Started

**_目前 NS-server 依赖于 nodejs 和 MySQL 环境_**

NS-server 有两种启动方式：运行 bundle **(recommended)** / 编译运行 (for development) / docker镜像 **(recommended)**

### Docker 启动 (Beta)

> Beta 功能，稳定性不确定，但大体是可以正常使用了

Docker Hub：https://hub.docker.com/r/wibuswee/nx-server

目前是每一次发 Release 就会上传一次 Docker，或者我手动上传（有的时候还没到发release的时期）

首先你需要 复制 `.env.example` 为 `.env` 修改里面的配置，配置如「Bundle 启动」大体一致，有些是不应用的（DB_HOST,DB_PORT暂时不应用）

```bash
docker compose pull # 拉取最新镜像
docker compose up -d # 启动/restart容器
```

关于反向代理：默认的 docker-compose 已设置为映射到 .env 中的 PORT 所设置的端口上，根据 PORT 进行反待即可

### Bundle 启动 (Beta)

> Beta 功能，稳定性不确定，但大体是可以正常使用了

若您不是开发者，则我推荐你使用 Bundle 启动此项目，bundle目前已在 Artifacts 和 Release 中发布。

在 Release 页面下载稳定版 **NS-server.zip**，或在 Action 产物中下载开发版 **NS-server.zip** 解压缩，进入文件夹运行如以下命令：

```bash
node index.js --PORT=3001 --DB_DATABASE=nest-server --DB_HOST=127.0.0.1 --DB_PORT=3306 --DB_USERNAME=root --DB_PASSWORD=moonwibus
```

请注意，使用bundle启动时 你需要后置参数：

- PORT：监听端口，默认 `3000`
- DB_DATABASE：数据库名，默认 `nest-server`
- DB_HOST：数据库主机，默认 `127.0.0.1`
- DB_PORT：数据库端口，默认 `3306`
- DB_USERNAME：数据库用户名，默认 `root`
- DB_PASSWORD：数据库密码，默认值 `moonwibus`
- CORS_SERVER：允许跨域来源，默认值请看代码
- JWT_KEY：jwt密钥，不建议使用默认值
- theme：视图引擎模板设置，详情请见 **「EJS Templates Engine」** 章节
<!-- - MAIL_SERVER：邮箱服务器（有可能后期会移入后台进行设置）
- MAIL_PORT：邮箱端口号（有可能后期会移入后台进行设置）
- MAIL_ADD：邮箱地址（有可能后期会移入后台进行设置）
- MAIL_PASS：邮箱密码（有可能后期会移入后台进行设置） -->

> bundle.zip 是只有一个 index.js，不包含默认主题与视图文件夹，一般来说我不推荐你使用此压缩包 ❌
>
> NS-server.zip 是一个完整的项目，包含默认主题与视图文件夹，一般来说我推荐你使用此压缩包 ✅

## EJS Templates Engine (Beta)

> 🧪 实验性功能，可能会有 bug，请谨慎使用。

由于 Express 支持配置视图引擎 EJS，因此 NextSpace 可以使用 EJS 作为模板引擎。视图文件夹为 `views`，模板文件夹为 `views/{templatesName}` 默认配置为 `views/default`

模板的选择有两种方式：`process.env` 和 数据库的 `Configs` 表，以 `env` 为最高优先级，若都无配置，则默认使用 `default`

推荐你使用 bundle 运行服务端，详情请见 **「Get Started」** 章节

### Engine TODO

- [X] 动态路由
- [X] 404 错误页面
- [x] 其他模板引擎（EJS, HBS）
- [ ] npm 插件

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