# How to new Module

In this section, let's build a simple bussiness module.

Use nest-cli to quickly generate a module.

```bash
nest g modules/good
```

:::info
If don not install nest-cli before, please install it globally.

```bash
npm i -g @nestjs/cli
```

Or, export node_modules/.bin in `$PATH`.

```bash
export PATH="./node_modules/.bin:$PATH"
```

:::

:::tip
Add export `./node_modules/.bin` into env $PATH automatically, add this line into `$HOME/.zshrc` or other shell profile you like.

```bash
export PATH="./node_modules/.bin:$PATH"
```

:::

执行上述命令，nest-cli将在modules中生成一个名为good的文件夹，并创建一个名为good.module的文件。ts, GoodModule将被导入到app.module中。ts的进口范围。

```ts
// app.module.ts
@Module({
  imports: [
    DbModule,
    HelperModule,
    LoggerModule,

    // 业务模块
    GoodModule, // <-- new module
  ],
  controllers: [AppController],
  providers: [
    // ...
  ],
})
export class AppModule {}
```

在NestJS中，模块包装了控制器、提供程序。应该创建一个名为good.controller的新文件。并在此文件中写入API。另外，使用nestjs-cli快速创建这个文件。

```bash
nest g co modules/good --no-spec
```

并且为这个控制器创建一个服务，服务的职责是操作数据库，聚合操作数据的方法。

```bash
nest g s modules/good --no-spec
```

在执行以上所有命令之后，Good.module.ts将变成这样。

```ts
@Module({
  controllers: [GoodController],
  providers: [GoodService],
})
export class GoodModule {}
```

我们还需要数据库模型，所以创建名为' good.model的文件。来定义这个模型。在这个项目中，我们使用[Typegoose](https://typegoose.github.io/typegoose/docs/guides/quick-start-guide)来定义模型，它是一个“包装器”，可以轻松地用TypeScript编写Mongoose模型。

```ts
export class GoodModel extends BaseModel {
  @prop()
  name: string
}
```

模型定义总是从BaseModel扩展而来。完成模型的定义，不要忘记在DatabaseModule中注册这个模型。添加这个。

```ts
// src/processors/database/database.module.ts
// ...

const models = TypegooseModule.forFeature([
  ApplicationModel,
  BusinessModel,
  ComponentModel,
  FlagModel,
  RuleModel,
  SceneModel,
  TemplateModel,
  GoodModel, // <----------- add this

  ErrorRecordModel,
  ErrorStatusModel,
])
/// ...
```

Ok, you can use this model in service now, open `good.service.ts` and inject this model.

:::note
在NestJS应用中，包括控制器和提供程序在内的所有模块默认都是单例的，并由嵌套框架管理。所以如果想要使用提供程序，必须先注入提供程序。
:::

```ts
// good.service.ts
import { InjectModel } from 'nestjs-typegoose'

@Injectable()
export class GoodService {
  constructor(
    @InjectModel(GoodModel)
    private readonly goodModel: MongooseModel<GoodModel>,
  ) {}
}
```

After, use this service in controller.

```ts
// good.controller.ts
@Controller(['goods', 'database/goods'])
export class RuleController {
  constructor(private readonly service: GoodService) {}

  @Get('/')
  async gets() {
    return 'ok'
  }
}
```

Ok, a business module was successfully created.

# 如何进行数据验证

出于安全原因，中间件通常被添加到请求中来验证数据的合规性，而NestJS提供了一个ValidatePipe来进行数据验证。接下来，编写一个简单的GoodDto来验证数据。

Create file named `good.dto.ts`

```ts
import { IsString } from 'class-validator'

export class GoodDto implements Partial<GoodModel> {
  @IsString()
  name: string
}
```

And use this dto in controller.

```ts
// good.controller.ts
import { Body, Post, Controller } from '@nestjs/common'
import { GoodDto } from './good.dto.ts'

@Controller(['goods', 'database/goods'])
export class RuleController {
  constructor(private readonly service: GoodService) {}

  @Post('/')
  async create(@Body() body: GoodDto) {
    return 'ok'
  }
}
```

你会注意到，只要在正文前面添加一个装饰器@Body和一个类型定义' GoodDto '，就可以定义正文的类型，然后nestjs会自动获得类型，然后验证请求的结构是否有效。如果无效，则抛出422异常。

## How to name a file

aka. NestJS is inspired by Angular architecture, so recommend name a file like ng standard.

\[module\].\[type\].\[extension\]. For example,

**Module**

- good.controller.ts
- good.model.ts
- good.service.ts
- good.dto.ts

**common**

- response.interceptor.ts
- catch.filter.ts

**utils**

- ip.util.ts
