import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  ServicePorts,
  ServicesEnum,
} from '~/shared/constants/services.constant';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ServicesEnum.category,
        transport: Transport.TCP,
        options: {
          port: ServicePorts.category,
        },
      },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
