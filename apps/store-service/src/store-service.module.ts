import { Module } from '@nestjs/common';
import { HelperModule } from '~/libs/helper/src';
import { StoreServiceController } from './store-service.controller';
import { StoreServiceService } from './store-service.service';

@Module({
  imports: [HelperModule],
  controllers: [StoreServiceController],
  providers: [StoreServiceService],
})
export class StoreServiceModule {}
