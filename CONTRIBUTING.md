# Contributing to nx-space/core

👍🎉 首先感谢你利用空余时间对 nx-space 的贡献！👍🎉

下面是一些为 nx-space/core 做出贡献的指南.

## 如何命名一个新的分支

你需要知道你想干什么，功能优化？性能提升？代码风格规范？新功能？它们都对应着它们自己的命名规范。我在这里列举几个常用的

你需要知道你想干什么，功能优化？性能提升？代码风格规范？新功能？它们都对应着它们自己的命名规范。我在这里列举几个常用的

- feat：新功能（feature）
- fix：修复bug，可以是QA发现的BUG，也可以是研发自己发现的BUG。
- docs：文档（documentation）
- style：格式（不影响代码运行的变动）
- refactor：重构（即不是新增功能，也不是修改bug的代码变动）
- perf：优化相关，比如提升性能、体验
- test：增加测试
- chore：构建过程或辅助工具的变动
- revert：回滚到上一个版本
- merge：代码合并
- sync：同步主线或分支的Bug

比如我想加一个新功能，那么这个分支取名应该为：`feat/a-new-feature`

## Pull Request 规范

当你进行 Pull Request 的时候，你需要提出你的修改带来的影响是什么，我们需要注意代码中什么东西，这些影响会带来什么后果（好的或坏的）

你的标题需要按照你的分支名来描写，格式为 `<type>(<scope>): <subject>`

- type 用于说明修改类别，类别请查看上文
- scope 用于说明 commit 影响的范围，如果你的修改涉及到一个全新的模块，则不需要填写。但是全新的模块我们将会建议您先撰写 RFC 文档，经过讨论后可行才进行 PR，在此之前我们可能并不会合并您的代码。
- subject 是 PR 目的的简短描述，语言随意，中国人用中文描述问题能更清楚一些，但结尾不加句号或其他标点符号

> 如 `feat/posts-options`，则标题为：`feat(posts): more options for posts` 或 `feat(posts): 更多的文章管理选项`。社区管理员会按照您的修改大小来区分是否为 breaking change

如果你的代码还缺乏部分尚未完成，请你点击 Draft Pull Request，而不是 Open Pull Request
