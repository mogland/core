<div align="center">
<a href="https://github.com/nx-space" target="_blank" rel="noopener noreferrer"><img width="100" src="https://avatars.githubusercontent.com/u/106414194" alt="NEXT logo"></a>
<h1>NextSpace Server v1.x <small><code>WIP</code></small></h1>
  <p>
  the RESTful API service for NEXT Space, powered by @nestjs. 
  </p>
  <p>
    NEXT 博客空间的核心API服务，基于 @nestjs <em><strong>无限进步！</strong></em>
  </p>
  <a href="https://wakatime.com/badge/github/nx-space/core"><img src="https://wakatime.com/badge/github/nx-space/core.svg" alt="wakatime"></a>
<img src="https://img.shields.io/github/package-json/v/nx-space/core" referrerpolicy="no-referrer" alt="version">
<a href="https://github.com/nx-space/core/actions/workflows/build.yml"><img src="https://github.com/nx-space/core/actions/workflows/build.yml/badge.svg"></a>
</div>



<br />

![Alt](https://repobeats.axiom.co/api/embed/c41f4aa5c6264c1db4ddd6c2120c0fca64dabcea.svg "Repobeats analytics image")

<br />


## 开始使用

**_nx-server 依赖于 NodeJS, MongoDB 和 Redis 环境_**

Work in process 正在开发当中

~~[Documentation 文档](https://nx-docs.iucky.cn)｜ [Development Live Demo](htttps://gs-server.vercel.app)~~


## NEXT Space 的优点

- **开箱即用**

  支持 Bundle, Docker 两种启动方式

- **速度飞起**

  可以快速启动项目，多集群处理速度更快

- **指标强大**

  服务端渲染 (SSR) 支持，为 SEO 和高性能提供支持

- **主题插件市场（WIP）**

  主题多种开发方式，提供更多功能

- **未来有望**

  同时支持多种模板引擎和前后端分离，支持组件化开发

- **插件系统**

  支持创建属于你的插件，扩展 NEXT 原生服务的基本功能！

- **更多功能**

  NEXT 的未来等待你的发现和提交!

## 关于此项目 (core)

This program (Core) is used to provide the personal space server *API service*. You can view the existing API interface provided by `Swagger`. 

You can use the interface to develop your own personal space **the front end**. Looking forward to your results!

此程序（core）是用来提供个人空间服务端API服务的，你可以通过 Swagger 来查看已提供的现有 API 接口。

你可以使用接口来开发属于你的个人空间**前端** 期待你的成果！

***无限进步！***

## 注意：项目最近具有分支变动

`refactor/mongo` 现在已命名为 `main`

如果你在 *v0.4.0* 发布前有本地克隆仓库，你需要更新你的本地分支，命令参考如下：

```bash
git branch -m refactor/mongo main
git fetch origin
git branch -u origin/main main
git remote set-head origin -a
```


## 项目 Sponsors

感谢 **Salted Fish**  的静态资源托管

感谢 **小沐** 的对项目大力支持

感谢 **若志** 提供服务器支持

## 项目重构后所使用的技术栈

> **粗体** 指的是与旧分支有技术栈不同的地方

- 框架: NestJS (Based on Fastify)
- 语言: TypeScript (Best practices, Not AnyScript)
- 数据库 ODM: **Typegoose** (Write schema once all in TypeScript)
- 包工具链: @vercel/ncc Bundle (Bundle entry, go node_modules away)
- 测试: **Vitest** (Test case write in TypeScript, fast and out-of-box)
- 包管理器: PNPM (which is fastest)
- DevOps: Docker
- 其他: Prettier, ESLint, Husky, Bump Version, etc.

## Reference

This project referred to: 

- [mx-space/core](https://github.com/mx-space/core)
- [innei/nest-http-boilerplate](https://github.com/Innei/nest-http-boilerplate)

## License

此项目 AGPLv3 授权开源，使用此项目进行的二次创作或者衍生项目也必须开源。

## Author

nx-space © Wibus, Released under the AGPL-3.0 License. Created on 2021-09-25. Refactored on 2022-06-07

> [Personal Website](http://iucky.cn/) · [Blog](https://blog.iucky.cn/) · GitHub [@wibus-wee](https://github.com/wibus-wee/) · Telegram [@wibus✪](https://t.me/wibus_wee)>