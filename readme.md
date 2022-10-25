<p align="center">
  <img src="https://avatars.githubusercontent.com/u/106414194?s=200&v=4" height="128">
  <h1 align="center">Mog</h1>
  <p align="center"><b align="center">🏝 /mɑːɡ/ 一款弹性的模块化 CMS 博客系统</b></p>
</p>

<p align="center">
  <a href="https://mog.js.org/about/roadmap.html">
    <img alt="" src="https://img.shields.io/github/issues/mogland/core/need-discuss?color=%237c7fff&style=for-the-badge">
  </a>
  <img src="https://img.shields.io/github/package-json/v/mogland/core?style=for-the-badge" referrerpolicy="no-referrer" alt="version">
  <a href="https://wakatime.com/badge/user/5c293fcd-9bec-4609-946b-c06b5fbf192c/project/a948796d-4bc0-4fd1-8f47-03f1dc168c95">
    <img src="https://wakatime.com/badge/user/5c293fcd-9bec-4609-946b-c06b5fbf192c/project/a948796d-4bc0-4fd1-8f47-03f1dc168c95.svg?style=for-the-badge" alt="wakatime">
  </a>
 </p>

Mog 是一个易于扩展的现代博客系统。它突破地采用了微服务架构，在结构设计是模块化、灵活的。 您可以轻松地将其自定义以满足您的需求。 更可以通过接口来开发自己的前/中后台，也可以通过插件来开发自己的功能。

![GitHub Repo stars](https://img.shields.io/github/stars/mogland/core?style=flat-square)
![GitHub forks](https://img.shields.io/github/forks/mogland/core?style=flat-square)

| :warning: | Mog v2 目前还在开发中，我们还没有提供使用文档。当我们有一个 alpha 版本准备测试时，我们将在这里发布一个文档链接。在此之前，我们欢迎贡献者帮助实现这个项目。 | &nbsp;&nbsp;&nbsp;&nbsp;[CONTRIBUTE](https://github.com/mogland/core/blob/main/CONTRIBUTING.md)&nbsp;&nbsp;&nbsp;&nbsp; |
| - |:-| - |

## Table of Contents

- [Features](#features)
- [Missions](#missions)
- [Ecosystem](#ecosystem)
- [Activity](#activity)
- [References](#references)
- [License](#license)
- [Author](#author)

## Features

- [X] 我们突破性地采用了微服务架构，提高原有 v1 版本服务的可扩展性和服务稳定性。
- [X] 增强了社区规范，提高开发人员和使用者的友好度.
- [X] 感谢社区的贡献，项目核心将始终开源。
- [X] 通过插件系统，在原有的基础上扩展了可移植性功能。
- [X] 使用模板引擎，以此便与快速开发前端, 感谢 Fastify 的 point-of-view

## Missions

受到大佬 [@innei](https://github.com/Innei) 的博客系统 [Mix Space](https://github.com/mx-space/) 影响，我们也很想自己做一个，于是 Mog 就出现了。

还有一个原因其实是看到一些收费的博客系统项目，但是那些项目似乎不太值得被作为收费项目，我们并不希望这么多人为了一个不太好的项目而去付费，很不值得。并且据我们目前所知 有某些收费项目所使用的底层框架是有反序列漏洞的，并不安全。

我们也并非是说哪个好哪个不好，而是认为有某些收费的博客项目是不稳定的，对于用户来说需要慎重选择，一旦就买了个bug blog那就不好了，但选择开源的博客系统的话，首先你可以保证社区的永久驱动，这是收费项目所不敢保证的事情，承诺永久更新是不可能的。第二你可以享受开源的好处，不收费、多维护成员、统一规范等等。

![module+blog=mog](https://user-images.githubusercontent.com/62133302/197693758-c22fb7fb-58bc-4b7e-9884-a1608e5ba8da.png)

在市面上，目前为用户而生的博客系统有很多，但是似乎他们都在走一条基本一致的路线，我们希望突破这个限制。因此我们使用了微服务架构，这是我们团队第一次在博客系统中使用这种设计，他可以带来服务的稳定保证，以及弹性部署等优点特性，这是市面上的系统所不拥有的。

## Ecosystem

| 项目                                                          | 描述             | 状态                                                                                                            |
| ------------------------------------------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------- |
| [mogland/core](https://github.com/mogland/core)               | Mog 博客系统核心 | ![GitHub package.json version](https://img.shields.io/github/package-json/v/mogland/core?style=flat-square)     |
| [mogland/console](https://github.com/mogland/console)         | Mog 管理后台     | ![GitHub package.json version](https://img.shields.io/github/package-json/v/mogland/console?style=flat-square)  |
| [mogland/mog-docs](https://github.com/mogland/mog-docs)       | Mog 文档         | ![GitHub package.json version](https://img.shields.io/github/package-json/v/mogland/mog-docs?style=flat-square) |
| [mogland/awesome-mog](https://github.com/mogland/awesome-mog) | Mog 生态资源     | ![GitHub Top languages](https://img.shields.io/github/languages/top/mogland/awesome-mog?style=flat-square)      |

## Activity

![Alt](https://repobeats.axiom.co/api/embed/78247003f5d123971c1f1830175bec934e80a48c.svg 'Repobeats analytics image')

## References

该项目参考了以下项目：

- [mx-space/core](https://github.com/mx-space/core)

## License

该项目是 AGPLv3 授权的开源项目。任何使用此项目的二次开发或衍生项目也必须是开源的。

## Author

Mog © Wibus, Released under the AGPL-3.0 License. Created on 2021-09-25.

> [Personal Website](http://iucky.cn/) · [Blog](https://blog.iucky.cn/) · GitHub [@wibus-wee](https://github.com/wibus-wee/) · Telegram [@wibus✪](https://t.me/wibus_wee)
