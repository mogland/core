import { Module } from '@nestjs/common';
import { DatabaseModule } from '~/libs/database/src';
import { ConfigsService } from './configs.service';

@Module({
  imports: [DatabaseModule],
  providers: [ConfigsService],
  exports: [ConfigsService],
})
export class ConfigModule {}
