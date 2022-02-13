# [0.1.0](https://github.com/wibus-wee/GS-server/compare/v0.0.6...v0.1.0) (2022-01-26)


### Bug Fixes

* **ci:** fix vercel.json error ([cdce40f](https://github.com/wibus-wee/GS-server/commit/cdce40ff238f05574404e0268f7ea83b6db11258))
* **ci:** remove bugs in depoly ([086bf7a](https://github.com/wibus-wee/GS-server/commit/086bf7ae69798da482681a2764bb180db759f831))
* **crypt:** fix the example user create password empty ([96c0f7b](https://github.com/wibus-wee/GS-server/commit/96c0f7bc5d40b7a997c5c3178561242c41d602bb))
* **deps:** pin dependencies ([c45cf49](https://github.com/wibus-wee/GS-server/commit/c45cf49756b6de09c7ea3c70565467f8a55a803d))
* **deps:** update dependency @nestjs/swagger to v5.2.0 ([52bcda3](https://github.com/wibus-wee/GS-server/commit/52bcda340e39529b37fe4c681c4916e07a59b70c))
* **deps:** update dependency axios to v0.25.0 ([feb5130](https://github.com/wibus-wee/GS-server/commit/feb51305acebcb3b209808300132f3f2ab26a37e))
* **deps:** update nest monorepo to v8.2.6 ([8cb40d3](https://github.com/wibus-wee/GS-server/commit/8cb40d35c494814507a31b3de252886185608e1a))
* **main:** fix an error if Origin is empty ([f1d27a9](https://github.com/wibus-wee/GS-server/commit/f1d27a986512e1d828de806e665ccb697cce56b3))
* **pages:** fix Params error when fetching page ([a11b8ff](https://github.com/wibus-wee/GS-server/commit/a11b8ffdd1fb88c47fb700f891c8552fe8ece4b1))
* **swagger:** fix swagger setup error ([4a437b4](https://github.com/wibus-wee/GS-server/commit/4a437b42e572a048e1bb6ce456ff759f7047f5eb)), closes [#41](https://github.com/wibus-wee/GS-server/issues/41)


### Features

* **crypt:** new password encryption, automatic encryption comparison ([f2aed68](https://github.com/wibus-wee/GS-server/commit/f2aed68d4c3cadf4267c8d7aff5378c84f47ae86))
* **mailer:** a new feature of mailer (not finished) ([63d3f53](https://github.com/wibus-wee/GS-server/commit/63d3f533e0380fc1073512a6717135c8488423e1))
* **utils:** add a bcrypt.utils ([60a67c5](https://github.com/wibus-wee/GS-server/commit/60a67c59a9394fbda1bba4bb7ce615ee5184487e))


### Performance Improvements

* **auth:** add expires for login api ([0ba8b5b](https://github.com/wibus-wee/GS-server/commit/0ba8b5ba66aa3a3d2e1c5eb91d2750006481e69f))
* **bootstrap:** change text to English & del the hotLoad checking ([301f1f3](https://github.com/wibus-wee/GS-server/commit/301f1f3f88de18763c082fad99ed281979e7fc99))
* **cors:** improve corsOrigin setting ([82708ea](https://github.com/wibus-wee/GS-server/commit/82708ea107bee38f8daeb227af36fdd6e0b1c911))
* **crypt:** change crypto method to sha256 ([0ecd556](https://github.com/wibus-wee/GS-server/commit/0ecd55650e5b482d6d785f6c3c0f4e1dd373912b)), closes [#36](https://github.com/wibus-wee/GS-server/issues/36)
* **env:** add default value for env ([ee3adec](https://github.com/wibus-wee/GS-server/commit/ee3adec02562dff39b44de1fdca933d3bf9b84d9))
* **env:** move PORT to .env ([182ac85](https://github.com/wibus-wee/GS-server/commit/182ac854ac3eba84c63f33cab472123eff7d1a30))
* **main:** move setup into app.listen() method ([166131c](https://github.com/wibus-wee/GS-server/commit/166131c4f8c4f51b05ddd1686f3bec680f754982))
* **main:** remove corsOrigin * ([058937f](https://github.com/wibus-wee/GS-server/commit/058937f78743e6fbcd07a93ab6f3cbcc299e47b0))
* **post/page:** make article content support long Text ([1924544](https://github.com/wibus-wee/GS-server/commit/1924544448eff9ed63467db604ac6bb515b8d249))


### BREAKING CHANGES

* **crypt:** New password encryption, automatic encryption comparison



## [0.0.6](https://github.com/wibus-wee/GS-server/compare/v0.0.5...v0.0.6) (2022-01-20)


### Bug Fixes

* **deps:** update dependency @nestjs/typeorm to v8.0.3 ([7ec91d9](https://github.com/wibus-wee/GS-server/commit/7ec91d93a08f786473aa7b0c3cc65532089ee3f8))
* **package:** fix the NODE_ENV error ([3716ebd](https://github.com/wibus-wee/GS-server/commit/3716ebdc06ad0a00fd7edfdc86082189309ea9a0))
* **swagger:** swagger support BearerAuth ([48ff972](https://github.com/wibus-wee/GS-server/commit/48ff97267baedf1eb91cecec7d52e4b1bca70877))
* **users:** fix login failure ([a92442a](https://github.com/wibus-wee/GS-server/commit/a92442a0ebbd0cf3425bfb216c3b1e7a93b53735))


### Features

* **app:** add a getStat function ([358d1e8](https://github.com/wibus-wee/GS-server/commit/358d1e8ceb2559b7ca47aaa77a15e1d8f9a38d42))
* **app:** new key detection feature, remove profile JWT limit ([9257f2c](https://github.com/wibus-wee/GS-server/commit/9257f2c59fdf5839a2f2d324bec7d8d03db2c584))
* **swagger:** add delete interface & add Swagger document ([77e8221](https://github.com/wibus-wee/GS-server/commit/77e8221edc5b15dc4361e0b12250817312bf9213))
* **user:** add a POST request to edit userData ([e5a0a0e](https://github.com/wibus-wee/GS-server/commit/e5a0a0e1032e32af4d432dc2703944d2e0dd4004))
* **user:** add a user decorator ([7c57967](https://github.com/wibus-wee/GS-server/commit/7c579672d6307f89067adad9e7742aa8909dd66f))


### Performance Improvements

* **app:** getStat add Unfriends ([791b2e9](https://github.com/wibus-wee/GS-server/commit/791b2e97a38d50e0d0f819e54f4887c2e9c8a8be))
* **users:** optimized user initialization and creation modification policies ([07af457](https://github.com/wibus-wee/GS-server/commit/07af45773f72976c0201d1e90e67a26402bd2a19))
* **users:** users start to use 'uuid' ([dada8c2](https://github.com/wibus-wee/GS-server/commit/dada8c261ae8ae45fcb7113d0cbe4aa0c82cc4b6))
* **user:** user can provide more data, remove the host module ([e9206b2](https://github.com/wibus-wee/GS-server/commit/e9206b2f72bb82f604c35932e2188ab681a62f46))


### BREAKING CHANGES

* **swagger:** Now you can debug with Swagger！
* **app:** Use the new interface to detect the key, easier to process



## [0.0.5](https://github.com/wibus-wee/GS-server/compare/v0.0.4...v0.0.5) (2022-01-16)


### Bug Fixes

* **cors:** fixed header error caused by CORS setting ([6ed1f25](https://github.com/wibus-wee/GS-server/commit/6ed1f252b398ace76da902df8f395f39184357c8))
* **deps:** update dependency axios to v0.24.0 ([54b63ad](https://github.com/wibus-wee/GS-server/commit/54b63adaf60222a0874d65bdb0397d2bad8723be))
* **deps:** update dependency class-transformer to v0.5.1 ([c41aa8d](https://github.com/wibus-wee/GS-server/commit/c41aa8d4e9e4d198b0dfdcf9aacf10e742e8cac6))
* **deps:** update dependency passport to v0.5.2 ([e1dbb05](https://github.com/wibus-wee/GS-server/commit/e1dbb05c12d06c819d5b10d411952dedc7b68be4))
* **deps:** update nest monorepo to v8.2.5 ([adeb7f7](https://github.com/wibus-wee/GS-server/commit/adeb7f758b88d5bf7067bb588162202c571a4cfc))
* **filters:** fix all-exception filter return too many request ([ff0564f](https://github.com/wibus-wee/GS-server/commit/ff0564f10bb46c6822d13c772943c2ea42d55d4e))
* fix 'Origin' is always true ([18b40d9](https://github.com/wibus-wee/GS-server/commit/18b40d90df32447e65b8730aa99921fe0f83103d))
* **services:** fix vulnerability vulnerable to injection ([4ba0239](https://github.com/wibus-wee/GS-server/commit/4ba0239856b502241943c9b1a1d70af005b887c7))


### Features

* **Comments:** edit other Comments ([42fb9e6](https://github.com/wibus-wee/GS-server/commit/42fb9e664cda578c50194b2e8452a5f339ef224c))
* **filters:** add a APP_FILTER & remove http-exception filter ([48f91b2](https://github.com/wibus-wee/GS-server/commit/48f91b24b665ec76c8f149039d6aead1d77c3b39))
* **guards:** add a spiders guards ([c5d9527](https://github.com/wibus-wee/GS-server/commit/c5d952770fa6e657a4d9d7197f3df42c109e99e0))
* **guards:** add RolesGuard for APP_GUARD ([df5ff56](https://github.com/wibus-wee/GS-server/commit/df5ff567a59764a80dde96b6b8db16ee0b7f6501))


### Performance Improvements

* **app:** give app a `/ping` request ([96b2775](https://github.com/wibus-wee/GS-server/commit/96b277544532f5b32474e1aac613c5feee44a2ca))
* **Comments:** check for Comments username violations ([702391b](https://github.com/wibus-wee/GS-server/commit/702391bb330dd7b04d68464651b743f3d2c10809))
* **Comments:** limit contents' Byte ([9058517](https://github.com/wibus-wee/GS-server/commit/905851719808a5b56a621d69b649264b57e11fe3))
* **filter:** add a swich-case for exception filter ([fc2d02e](https://github.com/wibus-wee/GS-server/commit/fc2d02e42a9a3d0a256c80a65b380d15d4500832))
* **friends:** add a check service for links(bugs) ([bde5067](https://github.com/wibus-wee/GS-server/commit/bde5067202ef24ef51164bf1f307c513e9f9ab39))
* **friends:** improve the friendly Exception ([566550d](https://github.com/wibus-wee/GS-server/commit/566550d9663384e48c65d3a0497bb9b5a0328b5f))
* **service:** list provides more options ([89eacf5](https://github.com/wibus-wee/GS-server/commit/89eacf57ca70c3f33f1627003c30168d87f6f331))
* **tsconfig:** add `include` for tsconfig ([23a91f3](https://github.com/wibus-wee/GS-server/commit/23a91f3f52d78b5706d00cd45d3085d67bf39979))



## [0.0.4](https://github.com/wibus-wee/GS-server/compare/v0.0.3...v0.0.4) (2022-01-13)


### Bug Fixes

* generic Password exposed ([bc7b220](https://github.com/wibus-wee/GS-server/commit/bc7b2208664018dbed333824295d6e576fc12c3e))


### Features

* **env:** use `.env` to control privacy variables ([d038685](https://github.com/wibus-wee/GS-server/commit/d03868542a6312dfce09f79865f3323cb63ba314))
* **filters:** add a http-exception filter ([e70e64d](https://github.com/wibus-wee/GS-server/commit/e70e64d15cfcbe2cc6e2c333d809d345d000bd28))


### Performance Improvements

* **app:** change Logger log ([5e4618e](https://github.com/wibus-wee/GS-server/commit/5e4618e58e7f879bdf82a33ac864254e6cfa605b))
* **app:** initialize the user ([199fac1](https://github.com/wibus-wee/GS-server/commit/199fac1284e020187579cc8500b731886251e5cf))
* **app:** move some variables into env ([774857f](https://github.com/wibus-wee/GS-server/commit/774857faec01a7f651c51812a4bfa49ad4ec1e41))
* **Comments:** add a changeComments function for master ([d2fa3e7](https://github.com/wibus-wee/GS-server/commit/d2fa3e7bd71208268af5bf58749d38ded1fc9918))
* **filters:** change the http-exception filter return words ([caa372e](https://github.com/wibus-wee/GS-server/commit/caa372e5bb9cd871c577c4fa9460ef87c3ccdaec)), closes [#7](https://github.com/wibus-wee/GS-server/issues/7)
* **service:** convert manual error messages to built-in HttpExceptions ([d0cb19f](https://github.com/wibus-wee/GS-server/commit/d0cb19f10f961f2219b3584dc33048d2a79f13fa))
* **service:** throw HttpException when catch error ([13562a2](https://github.com/wibus-wee/GS-server/commit/13562a2b35f099d91b602d7a3a1a2cbc46baccf8))


### BREAKING CHANGES

* **app:** Automatically initialize users to prevent usage problems



## [0.0.3](https://github.com/wibus-wee/GS-server/compare/v0.0.2...v0.0.3) (2021-12-18)


### Bug Fixes

* fix all autofixed problems ([ce67e89](https://github.com/wibus-wee/GS-server/commit/ce67e898828780e8978174c9d6d6ae8f7e00a5da))
* fix Comments Exp & jwt ([ab8b184](https://github.com/wibus-wee/GS-server/commit/ab8b18461ccae1c78fa27fbf8225461bbec1c5f9))
* fix friends repo error ([29dedb6](https://github.com/wibus-wee/GS-server/commit/29dedb69ca8e04ee7f8be57f76aa1662c02bbe6d))
* fixed bug where multiple data was saved in host ([93ee8e5](https://github.com/wibus-wee/GS-server/commit/93ee8e5bf1bca89a5195289010b38ec3fe9ef879))
* **friends:** fix 'friends' repo not found ([5ad1ad3](https://github.com/wibus-wee/GS-server/commit/5ad1ad37b381e8cdd3242318477813c5e965811b))


### Features

* add a devcontainer ([333535c](https://github.com/wibus-wee/GS-server/commit/333535c696f0448c57ffaa0ce8b8329e8fb9bf78))
* **Categories:** add Categories module & service & controller ([f3558fb](https://github.com/wibus-wee/GS-server/commit/f3558fb3684916e24e1c9d12c114877d77eea225))
* **filter:** add a global exception filter ([f6eec19](https://github.com/wibus-wee/GS-server/commit/f6eec19127f68446c48924a64d339708eb1d67cd))


### Performance Improvements

* add counting options for all controllers ([66c3313](https://github.com/wibus-wee/GS-server/commit/66c3313d6c06d5a1f210efac0b269c2b6d6177aa))
* **app:** optimization of CORS ([b8e571c](https://github.com/wibus-wee/GS-server/commit/b8e571cae9078e6201faa61105db45a94c7b5121))
* **configs:** set `jwtToken` for auth constants ([a390028](https://github.com/wibus-wee/GS-server/commit/a390028d4ba09e77adad9ba54b99603c3f6c09c8))
* **cors:** start CORS and add its configuration options ([7fa841f](https://github.com/wibus-wee/GS-server/commit/7fa841fa4d1ee8ff5c999c2d0d832238c3c83407))
* post is provided with a Categories controller ([49029f0](https://github.com/wibus-wee/GS-server/commit/49029f0188686df01755654133c97e85c878a51f))


### BREAKING CHANGES

* **Categories:** A new Categories controller and other things



## [0.0.2](https://github.com/wibus-wee/Nest-server/compare/v0.0.1...v0.0.2) (2021-10-04)


### Bug Fixes

* fix admin information bug ([3bf6eb9](https://github.com/wibus-wee/Nest-server/commit/3bf6eb9d59301c47e8c8fddd93a37c27eb5a6306))
* fix send same post bug ([577be4f](https://github.com/wibus-wee/Nest-server/commit/577be4f473353d8d1398b0213b660f3f1235ac85))
* **host:** delete mongoose & codes ([e2aba01](https://github.com/wibus-wee/Nest-server/commit/e2aba0110db44816ad813fc321b4f4473994b3c9)), closes [#3](https://github.com/wibus-wee/Nest-server/issues/3)
* **host:** fix createHostDto bugs ([a465aa4](https://github.com/wibus-wee/Nest-server/commit/a465aa4a115440741617a4246c6bedb93fae4a86))


### Features

* add mysql & typeorm to repo ([bd4c035](https://github.com/wibus-wee/Nest-server/commit/bd4c035f49b2f45d68edf986f20d52f0f9cbe3f9))
* **Comments:** add Comments controller ([cf55b0a](https://github.com/wibus-wee/Nest-server/commit/cf55b0a0c0f4abaacb10ba6e03d881be8f210bd0))
* **host:** add data support to the host controller ([2053727](https://github.com/wibus-wee/Nest-server/commit/20537279132b86445089ab7724a98d7bc705cd6b))
* introducing authorization Guards ([81d5fd6](https://github.com/wibus-wee/Nest-server/commit/81d5fd6216a54ddb3b4a7480f6e4e40a6f7595d2))
* **pages:** database support is provided for Pages ([adb3b4c](https://github.com/wibus-wee/Nest-server/commit/adb3b4ceadd43cc78d09bc02cfddf8bd347fb70a))
* **posts:** add db supports for posts ([4e5d8bf](https://github.com/wibus-wee/Nest-server/commit/4e5d8bfac473fe3b2551b84aaf6860e83ac84c37))


### Performance Improvements

* add comments.entry ([43231f6](https://github.com/wibus-wee/Nest-server/commit/43231f6b4d04fb495fee511ab6ff8765f97d9b34))
* delete Support for posts & pages ([2b2e644](https://github.com/wibus-wee/Nest-server/commit/2b2e644fe40f88b8f9b9f10f1c194512341f6096))
* **posts:** improve posts db ([7c83763](https://github.com/wibus-wee/Nest-server/commit/7c83763e1445290040f3caab34cc24c3eaef7d87))
* **posts:** improve postsService findOne ([c7c9cab](https://github.com/wibus-wee/Nest-server/commit/c7c9cab7049fe031727e8c4e66082d9b1e9cf2f4))
* **swagger:** optimize the swagger of Comments ([ca93a38](https://github.com/wibus-wee/Nest-server/commit/ca93a387be2f4ae315cb2ca3628c9b3b6ccfbae2))


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



