import { Module } from '@nestjs/common';
import { UserServiceController } from './user-service.controller';
import { UserServiceService } from './user-service.service';

@Module({
  imports: [],
  controllers: [UserServiceController],
  providers: [UserServiceService],
})
export class UserServiceModule {}
