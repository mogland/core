import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { DatabaseModule } from '~/libs/database/src';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { REDIS_TRANSPORTER } from '~/shared/constants/transporter.constants';
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
        ...REDIS_TRANSPORTER,
      },
    ]),
  ],
  controllers: [PageServiceController],
  providers: [PostService, CategoryService, PageService],
  exports: [PostService, CategoryService, PageService],
})
export class PageServiceModule {}
