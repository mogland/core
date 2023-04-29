import { Controller } from '@nestjs/common';
import { AssetsService } from '~/libs/helper/src/helper.assets.service';
import { StoreServiceService } from './store-service.service';

@Controller()
export class StoreServiceController {
  constructor(
    private readonly storeServiceService: StoreServiceService,
    private readonly assetHelper: AssetsService,
  ) {}
}
