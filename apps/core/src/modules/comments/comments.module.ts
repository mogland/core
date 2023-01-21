import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { REDIS_TRANSPORTER } from '~/shared/constants/transporter.constants';
import { CommentsController } from './comments.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ServicesEnum.comments,
        ...REDIS_TRANSPORTER,
      },
    ]),
  ],
  controllers: [CommentsController],
})
export class CommentsModule {}
