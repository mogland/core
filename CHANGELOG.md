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
