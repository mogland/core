<div align="center">
<a href="https://github.com/nx-space" target="_blank" rel="noopener noreferrer"><img width="100" src="https://avatars.githubusercontent.com/u/106414194" alt="NEXT logo"></a>
<h1>NextSpace Server v1.x <small><code>WIP</code></small></h1>
  <p>
  the RESTful API service for NEXT Space, powered by @nestjs. 
  </p>
  <a href="https://wakatime.com/badge/github/nx-space/core"><img src="https://wakatime.com/badge/github/nx-space/core.svg" alt="wakatime"></a>
<img src="https://img.shields.io/github/package-json/v/nx-space/core" referrerpolicy="no-referrer" alt="version"> 
</div>


<br />

![Alt](https://repobeats.axiom.co/api/embed/c41f4aa5c6264c1db4ddd6c2120c0fca64dabcea.svg "Repobeats analytics image")

<br />

## The default branch has been renamed!

`refactor/mongo` is now named `main`

If you have a local clone, you can update it by running the following commands.

```bash
git branch -m refactor/mongo main
git fetch origin
git branch -u origin/main main
git remote set-head origin -a
```

## Which Tech Stack In Use

- Framework: NestJS (Based on Fastify)
- Language: TypeScript (Best practices, Not AnyScript)
- Database ODM: **Typegoose** (Write schema once all in TypeScript)
- Bundle Toolchain: @vercel/ncc Bundle (Bundle entry, go node_modules away)
- Testing: **Vitest** (Test case write in TypeScript, fast and out-of-box)
- Package Manager: PNPM (which is fastest)
- DevOps: Docker
- Other: Prettier, ESLint, Husky, Bump Version, etc.

## Get Started

**_nx-server 依赖于 NodeJS, MongoDB 和 Redis 环境_**

[Documentation 文档](https://nx-docs.iucky.cn)｜ [Development Live Demo](htttps://gs-server.vercel.app)


## Project Sponsors

感谢 **Salted Fish**  的静态资源托管

感谢 **小沐** 的对项目大力支持

感谢 **若志** 提供服务器支持

## Reference

This project referred to: 

- [mx-space/core](https://github.com/mx-space/core)
- [innei/nest-http-boilerplate](https://github.com/Innei/nest-http-boilerplate)

## License

此项目 AGPLv3 授权开源，使用此项目进行的二次创作或者衍生项目也必须开源。

## Author

nx-space © Wibus, Released under the AGPL-3.0 License. Created on 2021-09-25. Refactored on 2022-06-07

> [Personal Website](http://iucky.cn/) · [Blog](https://blog.iucky.cn/) · GitHub [@wibus-wee](https://github.com/wibus-wee/) · Telegram [@wibus✪](https://t.me/wibus_wee)>