import { Module } from '@nestjs/common';
import { ConfigModule } from '~/libs/config/src';
import { ConfigsController } from './configs.controller';

@Module({
  imports: [ConfigModule],
  controllers: [ConfigsController],
})
export class ConfigPublicModule {}
