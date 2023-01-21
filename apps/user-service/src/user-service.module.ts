import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AuthModule } from '~/libs/auth/src';
import { DatabaseModule } from '~/libs/database/src';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { REDIS_TRANSPORTER } from '~/shared/constants/transporter.constants';
import { UserServiceController } from './user-service.controller';
import { UserService } from './user-service.service';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ClientsModule.register([
      {
        name: ServicesEnum.notification,
        ...REDIS_TRANSPORTER,
      },
    ]),
  ],
  controllers: [UserServiceController],
  providers: [UserService],
})
export class UserServiceModule {}
