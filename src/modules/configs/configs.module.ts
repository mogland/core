import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
// import { ConfigsController } from './configs.controller';
import { ConfigsService } from './configs.service';

@Module({
  imports: [UserModule],
  // controllers: [ConfigsController],
  providers: [ConfigsService],
  exports: [ConfigsService],
})
export class ConfigsModule {}
