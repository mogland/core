# Nest-server

TypeScript. Nextjs. Base.

Created on 2021-09-25

Dev. by Wibus

这是第一次使用TypeScript来写的程序，也是第一个用了nodejs的仓库，反正都是**第一次**。所以在很多地方也许会出现非常不正确的写法，期待以后的学习改进！

## How to use?

- open `ormconfig.json`
- edit json

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