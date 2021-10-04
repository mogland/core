# Nest-server

[![total line](https://tokei.rs/b1/github/wibus-wee/Nest-server)](https://github.com/wibus-wee/Nest-server) ![version](https://img.shields.io/github/package-json/v/wibus-wee/Nest-server) ![language](https://img.shields.io/github/languages/top/wibus-wee/Nest-server) ![core](https://img.shields.io/github/package-json/dependency-version/wibus-wee/Nest-server/@nestjs/core) ![code size](https://img.shields.io/github/languages/code-size/wibus-wee/Nest-server) ![download](https://img.shields.io/github/downloads/wibus-wee/Nest-server/total) ![issues](https://img.shields.io/github/issues/wibus-wee/Nest-server) ![commit](https://img.shields.io/github/commit-activity/m/wibus-wee/Nest-server) ![commit_last](https://img.shields.io/github/last-commit/wibus-wee/Nest-server) ![stars](https://img.shields.io/github/stars/wibus-wee/Nest-server?style=social)

TypeScript. Nextjs. Base.

Created on 2021-09-25

Dev. by Wibus

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

## 接口一览表 `v1`

![api](https://gitee.com/wibus/blog-assets-goo/raw/master/asset-pic/20210925081804.jpg)

## 缺点 `v1`

使用的是mysql作为数据载体，原本想用的是mongodb，对比mysql与mongodb，个人认为mongodb会让整体数据结构和速度更快更好