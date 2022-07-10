import { Global, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
// import { ConfigsController } from './configs.controller';
import { ConfigsService } from './configs.service';

@Global()
@Module({
  imports: [UserModule],
  // controllers: [ConfigsController],
  providers: [ConfigsService],
  exports: [ConfigsService],
})
export class ConfigsModule {}
