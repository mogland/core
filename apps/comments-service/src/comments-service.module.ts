import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { REDIS } from '~/apps/core/src/app.config';
import { DatabaseModule } from '~/libs/database/src';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { CommentsController } from './comments-service.controller';
import { CommentsService } from './comments-service.service';

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
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsServiceModule {}
