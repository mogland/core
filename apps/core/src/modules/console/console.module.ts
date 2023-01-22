import { Module } from '@nestjs/common';
import { HelperModule } from '~/libs/helper/src';
import { ConsoleController } from './console.controller';
import { ConsoleService } from './console.service';

@Module({
  imports: [HelperModule],
  controllers: [ConsoleController],
  providers: [ConsoleService],
  exports: [],
})
export class ConsoleModule {}
