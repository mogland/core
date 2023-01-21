import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { DatabaseModule } from '~/libs/database/src';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { REDIS_TRANSPORTER } from '~/shared/constants/transporter.constants';
import { CommentsController } from './comments-service.controller';
import { CommentsService } from './comments-service.service';

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
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsServiceModule {}
