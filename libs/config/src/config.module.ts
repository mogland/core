import { Module } from '@nestjs/common';
import { UserModule } from '~/apps/core/src/modules/user/user.module';
import { DatabaseModule } from '~/libs/database/src';
import { ConfigService } from './config.service';

@Module({
  imports: [DatabaseModule, UserModule],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
