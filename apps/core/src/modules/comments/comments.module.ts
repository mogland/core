import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  ServicePorts,
  ServicesEnum,
} from '~/shared/constants/services.constant';
import { CommentsBasicService } from './comments.basic.service';
import { CommentsController } from './comments.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ServicesEnum.comments,
        transport: Transport.TCP,
        options: {
          port: ServicePorts.comments,
        },
      },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsBasicService],
  exports: [CommentsBasicService],
})
export class CommentsModule {}
