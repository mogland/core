# [1.4.0-alpha.2](https://github.com/nx-space/core/compare/v1.4.0-alpha.1...v1.4.0-alpha.2) (2022-07-14)


### Features

* **init:** init post and page in initing ([3810eb8](https://github.com/nx-space/core/commit/3810eb831e81a18e076dac6d135e9cfb128651c3))
* **module:** init configs module ([eb56ec4](https://github.com/nx-space/core/commit/eb56ec4f00dc4dc02e6a0ea8d1aaca58722af3c2))


### Performance Improvements

* **init:** `canInit` instead of `isInit` ([1ebcc68](https://github.com/nx-space/core/commit/1ebcc68007f3353f76198857386417156243288e))
* **init:** cancel custom config init to default ([b0799bb](https://github.com/nx-space/core/commit/b0799bb04c930db53a32f1fc8abc000777f3385f))



# [1.4.0-alpha.1](https://github.com/nx-space/core/compare/v1.4.0-alpha.0...v1.4.0-alpha.1) (2022-07-12)



# [1.4.0-alpha.0](https://github.com/nx-space/core/compare/v1.3.1...v1.4.0-alpha.0) (2022-07-12)


### Bug Fixes

* **ci:** file name is wrong ([#218](https://github.com/nx-space/core/issues/218)) ([674dffb](https://github.com/nx-space/core/commit/674dffbaad1a33e28f21bdd36c62b0842d8fee54))
* **ci:** try fix path ([84168ff](https://github.com/nx-space/core/commit/84168ff88420bff45814798ee466af0a9d25c474))


### Features

* **links/module:** init module and test ([4050cf7](https://github.com/nx-space/core/commit/4050cf76eeb0301cd318a68920c8e80384252487)), closes [#217](https://github.com/nx-space/core/issues/217)
* **links/service:** check all friends link's health ([f85ac4f](https://github.com/nx-space/core/commit/f85ac4fba7d5752d6f729c4a18f7e07cff45ed96))
* **links:** basic links service ([#219](https://github.com/nx-space/core/issues/219)) ([ab3dc77](https://github.com/nx-space/core/commit/ab3dc77fbf92fce5fc22a57e89c9e3de61c81be9)), closes [#217](https://github.com/nx-space/core/issues/217)
* **utils/parser:** atom parser ([6fc2e9f](https://github.com/nx-space/core/commit/6fc2e9fd38219a4647e80d7ca6babaa0044d85c7))
* **utils/parser:** rss parser ([57226fd](https://github.com/nx-space/core/commit/57226fd1a126a02394a532d32ea2c2e9dc55ce81))
* **utils:** rss parser utils ([c6e1207](https://github.com/nx-space/core/commit/c6e1207aeb75bb5395f1ff885fcd52eb980c2c70))


### Performance Improvements

* **links/model:** set up links model ([e29fb0d](https://github.com/nx-space/core/commit/e29fb0d27765daaf7f5fe284ccbe53c5b0efcbd2))
* **links/service:** get all links count ([726cbe9](https://github.com/nx-space/core/commit/726cbe99206688256d8cb9aced423de9e076bc32))
* **links/service:** guest can apply link ([f23806c](https://github.com/nx-space/core/commit/f23806c6dfababeb0a39a812442551244aa6b64d))
* **links/service:** set links status in auth ([7dcbbae](https://github.com/nx-space/core/commit/7dcbbaeb7f1350efe6a02ed3f218229da211f1b1))


### Reverts

* **utils:** remove original rss parser ([5fdc0c0](https://github.com/nx-space/core/commit/5fdc0c0f23bc57b3e835a1e04af372f30ef316b9))



## [1.3.1](https://github.com/nx-space/core/compare/1.3.0...1.3.1) (2022-07-10)



# [1.3.0](https://github.com/nx-space/core/compare/1.2.2...1.3.0) (2022-07-10)


### Features

* **aggregate:** find top & rss builder ([4c6b365](https://github.com/nx-space/core/commit/4c6b36522c7698e43cdce248bd8bee41ff4b1ddc))



## [1.2.2](https://github.com/nx-space/core/compare/v1.2.1...v1.2.2) (2022-07-09)


### Performance Improvements

* **app:** remove useless test api ([df3e4b7](https://github.com/nx-space/core/commit/df3e4b71de76c018173f51c523d217c882bf6dfd))



## [1.2.1](https://github.com/nx-space/core/compare/v1.2.0...v1.2.1) (2022-07-09)


### Bug Fixes

* **deps:** bump passport version to 0.6.0 ([8539464](https://github.com/nx-space/core/commit/8539464bdf3fbde25ab67f2056854471f60a525a))
* **pnpm:** update lock file ([40a4402](https://github.com/nx-space/core/commit/40a4402b3eb733f725d06b5a54e9083fe938c34b))


### Features

* **module:** aggregate module ([92e3841](https://github.com/nx-space/core/commit/92e384135e2fddada57d327a2ebf4aa8e9d5fc68))



## v1.2.0 (2022-07-03)

### Feat

- **modules**: comment module refactor (#214)
- **modules**: refator page module closed #210
- **plugins**: `usePlugins` to use all plugin
- **plugins**: use plugin's fn method
- **plugins**: active plugin
- **module**: new plugin module
- plugins service
- patch configs re #205
- **service**: get and wait for config ready
- **service**: init configs
- **configs**: dtos support re #205
- **module**: initialize configs module re #205
- article module refactor closed #207
- **post**: get post with paginate re #207
- add cz config

### Perf

- **db**: delete old db module
- **plugins**: interface authorized access re #211
- **plugins**: safe eval plugin functions fix #212
- **configs**: patch and validate data with translate to Chinese
- **plugins**: eval plugin method
- **plugins**: set plugin manifest class
- **plugins**: remove getIntro method
- add fields for mainifest
- **app**: friendly to railway
- set engine field
- add redis & mongo fields

### Fix

- **page**: missing db inject
- **plugins**: plugin folder cause undefined
- js doc to type
- path
- bundle build in npm-script
- **ci**: invalid workflow file
- listener ip to wrong way
- cannot find deps

## v1.1.0 (2022-06-21)

### Feat

- **service**: post service functions re #207
- **category**: set operation for api fix #206
- strip the dbmodule as an independent module
- **lib**: db lib module
- **controller**: category  controllers & services fix #206, re #203
- **module**: category module re #203, re #206
- **module**: user module initialized

### Fix

- **category**: validate function cannot pass value re #206
- **db**: trailing comma followed

### Perf

- **app**: change the default dbName
- **post**: annotation causes method died
- **post**: annotation of post scheme type
- **adapt**: php good
