import { DatabaseModule } from '@libs/database';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '~/libs/cache/src';
import { ConfigModule } from '~/libs/config/src';
import { AllExceptionsFilter } from '~/shared/common/filters/any-exception.filter';
import { RolesGuard } from '~/shared/common/guard/roles.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './modules/category/category.module';
import { PageModule } from './modules/page/page.module';
import { PostModule } from './modules/post/post.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CacheModule,
    DatabaseModule,
    ConfigModule,
    UserModule,
    PostModule,
    PageModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
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
