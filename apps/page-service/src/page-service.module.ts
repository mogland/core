import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { REDIS } from '~/apps/core/src/app.config';
import { DatabaseModule } from '~/libs/database/src';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { CategoryService } from './category.service';
import { PageServiceController } from './page-service.controller';
import { PageService } from './page-service.service';
import { PostService } from './post-service.service';

@Module({
  imports: [
    DatabaseModule,
    ClientsModule.register([
      {
        name: ServicesEnum.notification,
        transport: Transport.REDIS,
        options: {
          port: REDIS.port,
          host: REDIS.host,
          password: REDIS.password,
          username: REDIS.user,
        },
      },
    ]),
  ],
  controllers: [PageServiceController],
  providers: [PostService, CategoryService, PageService],
  exports: [PostService, CategoryService, PageService],
})
export class PageServiceModule {}
