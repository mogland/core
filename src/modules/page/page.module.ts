import { forwardRef, Module } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { PluginsModule } from '../plugins/plugins.module';

@Module({
  imports: [
    // forwardRef(() => PluginsModule),
  ],
  providers: [PageService],
  controllers: [PageController],
  exports: [PageService],
})
export class PageModule {}
