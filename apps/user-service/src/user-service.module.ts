import { Module } from '@nestjs/common';
import { AuthModule } from '~/libs/auth/src';
import { DatabaseModule } from '~/libs/database/src';
import { UserServiceController } from './user-service.controller';
import { UserService } from './user-service.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [UserServiceController],
  providers: [UserService],
})
export class UserServiceModule {}
