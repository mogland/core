import { Module } from '@nestjs/common';
import { UserServiceController } from './user-service.controller';
import { UserService } from './user-service.service';

@Module({
  imports: [],
  controllers: [UserServiceController],
  providers: [UserService],
})
export class UserServiceModule {}
