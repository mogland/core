# Contributing to mogland/core

👍🎉 首先感谢你利用空余时间对 Mog 的贡献！👍🎉

下面是一些为 mogland/core 做出贡献的指南.

## 代码贡献步骤

**0. 提交 issue**

任何新功能或者功能改进建议都先提交 issue 讨论一下再进行开发，bug 修复可以直接提交 PR. 如果涉及到大的改动，建议先提交 RFC 讨论.

**1. Fork 仓库**

点击右上角的 Fork 按钮，将 mogland/core fork 到自己的仓库.

**2. 克隆仓库**

```bash
git clone https://github.com/{USERNAME}/core.git
```

**3. 安装依赖**

```bash
pnpm install
```

**4. 创建分支**

```bash
git checkout -b {BRANCH_NAME}
```

**5. 开发**

**6. 提交代码**

```bash
git add .
git commit -m "<type>(<scope>): <subject>"
git push origin {BRANCH_NAME}
```

> **注意:** 你需要安装了依赖后才可以提交代码，我们使用了 husky 来做 git commit 内容的格式化，对代码的格式化和 lint 检查，所以你需要安装依赖后才可以提交代码.

**7. 提交 PR**

在 GitHub 上提交 PR. 点击 `Compare & pull request` 按钮，填写 PR 信息，然后点击 `Create pull request` 按钮.

PR 的标题需要遵循 [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) 规范. 例如: `feat: add new feature`. 你也可以查看下方的 [Pull Request 规范](#Pull Request 规范) 部分.

然后等待 CI 通过，等待 review. 如果 review 提出了修改意见（Change Request），可以在本地修改后再次提交，然后再次 push 到远程仓库，PR 会自动更新.

**more. 更新主仓库代码到自己的仓库**

```bash
git remote add upstream git@github.com:mogland/core.git
git fetch upstream
git pull upstream main
git push
```

## Mog 的目录结构

```
.
├── .github # github 相关的配置
├── .husky # husky 相关的配置
├── scripts # 脚本
├── apps # 服务端
  ├── core # 核心服务( Gateway )
  ├── user-service # 用户服务
  ├── page-service # 文章、页面、分类服务
  ├── ...
├── libs # 公共库
├── shared # 公共代码
├── nest-cli.json # nest-cli 配置
├── package.json # 项目配置
├── README.md # 项目说明
├── pnpm-lock.yaml # pnpm 锁文件
└── tsconfig.json # ts 配置
```

## 如何命名一个新的分支

你需要知道你想干什么，功能优化？性能提升？代码风格规范？新功能？它们都对应着它们自己的命名规范。我在这里列举几个常用的

- feat：新功能（feature）
- fix：修复 bug，可以是 QA 发现的 BUG，也可以是研发自己发现的 BUG。
- docs：文档（documentation）
- style：格式（不影响代码运行的变动）
- refactor：重构（即不是新增功能，也不是修改 bug 的代码变动）
- perf：优化相关，比如提升性能、体验
- test：增加测试
- chore：构建过程或辅助工具的变动
- revert：回滚到上一个版本
- merge：代码合并
- sync：同步主线或分支的 Bug

比如我想加一个新功能，那么这个分支取名应该为：`feat/a-new-feature`

## Pull Request 规范

当你进行 Pull Request 的时候，你需要提出你的修改带来的影响是什么，我们需要注意代码中什么东西，这些影响会带来什么后果（好的或坏的）

你的标题需要按照你的分支名来描写，格式为 `<type>(<scope>): <subject>`

- type 用于说明修改类别，类别请查看上文
- scope 用于说明 commit 影响的范围，如果你的修改涉及到一个全新的模块，则不需要填写。但是全新的模块我们将会建议您先撰写 RFC 文档，经过讨论后可行才进行 PR，在此之前我们可能并不会合并您的代码。
- subject 是 PR 目的的简短描述，语言随意，中国人用中文描述问题能更清楚一些，但结尾不加句号或其他标点符号

> 如 `feat/posts-options`，则标题为：`feat(posts): more options for posts` 或 `feat(posts): 更多的文章管理选项`。社区管理员会按照您的修改大小来区分是否为 breaking change

如果你的代码还缺乏部分尚未完成，请你点击 Draft Pull Request，而不是 Open Pull Request
