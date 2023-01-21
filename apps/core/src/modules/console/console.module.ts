import { Module } from '@nestjs/common';
import { HelperModule } from '~/libs/helper/src';

@Module({
  imports: [HelperModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class ConsoleModule {}
