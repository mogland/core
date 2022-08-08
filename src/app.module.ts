import { Module } from "@nestjs/common";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AllExceptionsFilter } from "./common/filters/any-exception.filter";
import { HttpCacheInterceptor } from "./common/interceptors/cache.interceptor";
import { JSONSerializeInterceptor } from "./common/interceptors/json-serialize.interceptor";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { PostModule } from "./modules/post/post.module";
import { UserModule } from "./modules/user/user.module";
import { CacheModule } from "./processors/cache/cache.module";
import { LoggerModule } from "./processors/logger/logger.module";
import { CategoryModule } from "./modules/category/category.module";
import { DbModule } from "@app/db";
import { ConfigsModule } from "./modules/configs/configs.module";
import { PluginsModule } from "./modules/plugins/plugins.module";
import { PageModule } from "./modules/page/page.module";
import { CommentModule } from "./modules/comments/comments.module";
import { ToolsModule } from "./modules/tools/tools.module";
import { HelperModule } from "./processors/helper/helper.module";
import { AggregateModule } from "./modules/aggregate/aggregate.module";
import { LinksModule } from "./modules/links/links.module";
import { ScheduleModule } from "@nestjs/schedule";
import { InitModule } from "./modules/init/init.module";
import { RolesGuard } from "./common/guard/roles.guard";
import { AuthModule } from "./modules/auth/auth.module";
import { BackupModule } from "./modules/backup/backup.module";
import { MarkdownModule } from "./modules/markdown/markdown.module";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CacheModule,
    DbModule,
    LoggerModule,
    AuthModule,
    PostModule,
    UserModule,
    CategoryModule,
    ConfigsModule,
    PluginsModule,
    PageModule,
    CommentModule,
    ToolsModule,
    HelperModule,
    AggregateModule,
    LinksModule,
    InitModule,
    BackupModule,
    MarkdownModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor, // 3
    },

    {
      provide: APP_INTERCEPTOR,
      useClass: JSONSerializeInterceptor, // 2
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor, // 1
    },

    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
