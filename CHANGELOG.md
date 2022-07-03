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
