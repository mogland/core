## [0.0.3](https://github.com/wibus-wee/GS-server/compare/v0.0.2...v0.0.3) (2021-12-18)


### Bug Fixes

* fix all autofixed problems ([ce67e89](https://github.com/wibus-wee/GS-server/commit/ce67e898828780e8978174c9d6d6ae8f7e00a5da))
* fix comment Exp & jwt ([ab8b184](https://github.com/wibus-wee/GS-server/commit/ab8b18461ccae1c78fa27fbf8225461bbec1c5f9))
* fix friends repo error ([29dedb6](https://github.com/wibus-wee/GS-server/commit/29dedb69ca8e04ee7f8be57f76aa1662c02bbe6d))
* fixed bug where multiple data was saved in host ([93ee8e5](https://github.com/wibus-wee/GS-server/commit/93ee8e5bf1bca89a5195289010b38ec3fe9ef879))
* **friends:** fix 'friends' repo not found ([5ad1ad3](https://github.com/wibus-wee/GS-server/commit/5ad1ad37b381e8cdd3242318477813c5e965811b))


### Features

* add a devcontainer ([333535c](https://github.com/wibus-wee/GS-server/commit/333535c696f0448c57ffaa0ce8b8329e8fb9bf78))
* **category:** add category module & service & controller ([f3558fb](https://github.com/wibus-wee/GS-server/commit/f3558fb3684916e24e1c9d12c114877d77eea225))
* **filter:** add a global exception filter ([f6eec19](https://github.com/wibus-wee/GS-server/commit/f6eec19127f68446c48924a64d339708eb1d67cd))


### Performance Improvements

* add counting options for all controllers ([66c3313](https://github.com/wibus-wee/GS-server/commit/66c3313d6c06d5a1f210efac0b269c2b6d6177aa))
* **app:** optimization of CORS ([b8e571c](https://github.com/wibus-wee/GS-server/commit/b8e571cae9078e6201faa61105db45a94c7b5121))
* **configs:** set `jwtToken` for auth constants ([a390028](https://github.com/wibus-wee/GS-server/commit/a390028d4ba09e77adad9ba54b99603c3f6c09c8))
* **cors:** start CORS and add its configuration options ([7fa841f](https://github.com/wibus-wee/GS-server/commit/7fa841fa4d1ee8ff5c999c2d0d832238c3c83407))
* post is provided with a category controller ([49029f0](https://github.com/wibus-wee/GS-server/commit/49029f0188686df01755654133c97e85c878a51f))


### BREAKING CHANGES

* **category:** A new category controller and other things



## [0.0.2](https://github.com/wibus-wee/Nest-server/compare/v0.0.1...v0.0.2) (2021-10-04)


### Bug Fixes

* fix admin information bug ([3bf6eb9](https://github.com/wibus-wee/Nest-server/commit/3bf6eb9d59301c47e8c8fddd93a37c27eb5a6306))
* fix send same post bug ([577be4f](https://github.com/wibus-wee/Nest-server/commit/577be4f473353d8d1398b0213b660f3f1235ac85))
* **host:** delete mongoose & codes ([e2aba01](https://github.com/wibus-wee/Nest-server/commit/e2aba0110db44816ad813fc321b4f4473994b3c9)), closes [#3](https://github.com/wibus-wee/Nest-server/issues/3)
* **host:** fix createHostDto bugs ([a465aa4](https://github.com/wibus-wee/Nest-server/commit/a465aa4a115440741617a4246c6bedb93fae4a86))


### Features

* add mysql & typeorm to repo ([bd4c035](https://github.com/wibus-wee/Nest-server/commit/bd4c035f49b2f45d68edf986f20d52f0f9cbe3f9))
* **comment:** add Comment controller ([cf55b0a](https://github.com/wibus-wee/Nest-server/commit/cf55b0a0c0f4abaacb10ba6e03d881be8f210bd0))
* **host:** add data support to the host controller ([2053727](https://github.com/wibus-wee/Nest-server/commit/20537279132b86445089ab7724a98d7bc705cd6b))
* introducing authorization Guards ([81d5fd6](https://github.com/wibus-wee/Nest-server/commit/81d5fd6216a54ddb3b4a7480f6e4e40a6f7595d2))
* **pages:** database support is provided for Pages ([adb3b4c](https://github.com/wibus-wee/Nest-server/commit/adb3b4ceadd43cc78d09bc02cfddf8bd347fb70a))
* **posts:** add db supports for posts ([4e5d8bf](https://github.com/wibus-wee/Nest-server/commit/4e5d8bfac473fe3b2551b84aaf6860e83ac84c37))


### Performance Improvements

* add comment.entry ([43231f6](https://github.com/wibus-wee/Nest-server/commit/43231f6b4d04fb495fee511ab6ff8765f97d9b34))
* delete Support for posts & pages ([2b2e644](https://github.com/wibus-wee/Nest-server/commit/2b2e644fe40f88b8f9b9f10f1c194512341f6096))
* **posts:** improve posts db ([7c83763](https://github.com/wibus-wee/Nest-server/commit/7c83763e1445290040f3caab34cc24c3eaef7d87))
* **posts:** improve postsService findOne ([c7c9cab](https://github.com/wibus-wee/Nest-server/commit/c7c9cab7049fe031727e8c4e66082d9b1e9cf2f4))
* **swagger:** optimize the swagger of comment ([ca93a38](https://github.com/wibus-wee/Nest-server/commit/ca93a387be2f4ae315cb2ca3628c9b3b6ccfbae2))


### BREAKING CHANGES

* An authorization guard is introduced to protect routes



## 0.0.1 (2021-09-30)


### Bug Fixes

* friends.service fix, but bugs still on ([0e65388](https://github.com/wibus-wee/Nest-server/commit/0e653889aaea725c42366ad21652735f0b17beb4))
* **friends:** fix friends catch didn't return error.message ([9e3c97c](https://github.com/wibus-wee/Nest-server/commit/9e3c97c058e171318f0081fd75023e0ba1c15aec)), closes [#4](https://github.com/wibus-wee/Nest-server/issues/4)
* **service:** fix friends.check ([a624950](https://github.com/wibus-wee/Nest-server/commit/a624950da1402b8fb73a8b9942032d406c2a0ba9))


### Features

* add controller ([843735f](https://github.com/wibus-wee/Nest-server/commit/843735f2f93e0ec63c3792c1af803f1d1a46164f))
* **controller:** improve the Host and Friends controllers ([04b7f9f](https://github.com/wibus-wee/Nest-server/commit/04b7f9f42a573dbe037f390f0f3beb7727dfe695))
* import mongoose and use it ([98aee44](https://github.com/wibus-wee/Nest-server/commit/98aee440c7e66a68ab785c5b59b470426df79740))
* new friend chain detection function (bugs) ([75bc22e](https://github.com/wibus-wee/Nest-server/commit/75bc22ef03e8ffcfcc0fe26fa2dfcc49a406a8fd)), closes [#2](https://github.com/wibus-wee/Nest-server/issues/2)
* project init ([25ba497](https://github.com/wibus-wee/Nest-server/commit/25ba497fb2d3b31cffa68a762fec1433fab47f60))


### Performance Improvements

* **package:** remove some useless command ([1edb1a5](https://github.com/wibus-wee/Nest-server/commit/1edb1a5370a2ac66109651b0008de4afe7e3beca))
* return host/admin ([0043c60](https://github.com/wibus-wee/Nest-server/commit/0043c60e882e496e7569686b781837083fac7ac1))
* **service:** convert the check function to an asynchronous function ([f85ad7d](https://github.com/wibus-wee/Nest-server/commit/f85ad7dfca3913e9ff561f4dcb8845dabc48ae7a)), closes [#2](https://github.com/wibus-wee/Nest-server/issues/2)



