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

## 接口一览表 `v1`

![api](https://gitee.com/wibus/blog-assets-goo/raw/master/asset-pic/20210925081804.jpg)

## 缺点 `v1`

使用的是mysql作为数据载体，原本想用的是mongodb，对比mysql与mongodb，个人认为mongodb会让整体数据结构和速度更快更好