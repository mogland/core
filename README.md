# Nest-server

[![total line](https://tokei.rs/b1/github/wibus-wee/Nest-server)](https://github.com/wibus-wee/Nest-server) ![version](https://img.shields.io/github/package-json/v/wibus-wee/Nest-server) ![language](https://img.shields.io/github/languages/top/wibus-wee/Nest-server) ![core](https://img.shields.io/github/package-json/dependency-version/wibus-wee/Nest-server/@nestjs/core) ![code size](https://img.shields.io/github/languages/code-size/wibus-wee/Nest-server) ![download](https://img.shields.io/github/downloads/wibus-wee/Nest-server/total) ![issues](https://img.shields.io/github/issues/wibus-wee/Nest-server) ![commit](https://img.shields.io/github/commit-activity/m/wibus-wee/Nest-server) ![commit_last](https://img.shields.io/github/last-commit/wibus-wee/Nest-server) ![stars](https://img.shields.io/github/stars/wibus-wee/Nest-server?style=social)

TypeScript. Nextjs. Base.

Created on 2021-09-25

Dev. by Wibus

## What is it?

This is the back end of the TypeScript blogging system G·Space, built using the Nestjs framework and using MySQL as the data carrier.

The project is still in internal testing, and detailed interface documentation is not considered for the time being.

Project supports Swagger, go to '/api-docs' after startup to view all public interfaces, but cannot debug (bugs).

这是使用TypeScript编写的博客系统G·Space的后端，采用Nestjs框架构建，使用MySQL作为数据载体

此项目仍处在内部测试阶段，暂时不考虑编写详细接口文档。

项目支持Swagger，在启动后前往 `/api-docs` 即可查看所有公开接口，但无法调试(bug)

## How to use?

- open `ormconfig.json`
- edit json config

```bash
pnpm install # install
pnpm start:dev # Dev
pnpm build # build
pnpm start # Production
```

## Stack

- Nestjs -- 可扩展的 Node.js 服务器端应用程序的框架
- TypeScript -- 始于JavaScript，归于JavaScript
- Nodejs -- 基于 Chrome V8 引擎的 JavaScript 运行环境
- ~~MongoDB -- 专为可扩展性，高性能和高可用性而设计的数据库~~
- MySQL -- MySQL是一个完全托管的数据库服务
- XSS -- 实用的xss过滤器

## Language Cloc

```
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
YAML                             1            830              0           5572
JavaScript                      62              0             61           2096
TypeScript                     113            195            122           1359
Markdown                         2             47              0             68
JSON                             4              1              0             42
-------------------------------------------------------------------------------
SUM:                           182           1073            183           9137
-------------------------------------------------------------------------------
```

## 缺点 `v1`

使用的是mysql作为数据载体，原本想用的是mongodb，对比mysql与mongodb，个人认为mongodb会让整体数据结构和速度更快更好

## 阅读列表 [Updating]

### Electron

Electron-CN-Tencent: https://cloud.tencent.com/developer/doc/1070

Electron-CN: https://www.electronjs.org/docs

Electron 打包 React 项目： https://segmentfault.com/a/1190000020020324

使用React去打包构建Electron应用： https://juejin.cn/post/6845166890550050829#heading-11

Electron-CN-juejin: https://juejin.cn/post/6844903794111692814


### Nest.js'
Nestjs-CN: https://docs.nestjs.cn/

Nestjs-CN-database: https://docs.nestjs.cn/8/techniques?id=%e6%95%b0%e6%8d%ae%e5%ba%93

Nest-Swagger: https://blog.csdn.net/gwdgwd123/article/details/105412274

Nest-CN-Tencent: https://cloud.tencent.com/developer/doc/1281


### React

React 官方中文文档： https://zh-hans.reactjs.org

Mozilla-MDN: https://developer.mozilla.org/zh-CN/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_getting_started

React-CN-Tencent: https://cloud.tencent.com/developer/doc/1201

### Vue.js

Vuejs.org: https://v3.cn.vuejs.org/guide/introduction.html

MDN-Vue: https://developer.mozilla.org/zh-CN/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Vue_getting_started

Vue.js-Tencent-v2: https://cloud.tencent.com/developer/doc/1247

### axios

Axios-EN: https://axios-http.com/docs/intro

使用 axios 访问 API-Vue: https://cn.vuejs.org/v2/cookbook/using-axios-to-consume-apis.html

Axios-Tencent-CN: https://cloud.tencent.com/developer/article/1098141

Axios-jianshu-CN: https://www.jianshu.com/p/cdec60909094

Axios-juejin-CN: https://juejin.cn/post/6884561821127491597

Axios-CN: http://axios-js.com/zh-cn/docs/index.html

### Others

MongoDB-CN-Manual: https://docs.mongoing.com/

Tailwind CSS (CN): https://www.tailwindcss.cn/docs

Mongoose v6.0.9: Schemas-EN： https://mongoosejs.com/docs/guide.html

Mongoose Express mozilla: https://developer.mozilla.org/zh-CN/docs/learn/Server-side/Express_Nodejs/mongoose

Mongoose-CN-Ads: http://mongoosejs.net/docs/

PostCSS-Tencent: https://cloud.tencent.com/developer/doc/1278-