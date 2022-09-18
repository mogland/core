import { Controller } from '@nestjs/common';
import { PageService } from './page-service.service';

@Controller()
export class PageServiceController {
  constructor(private readonly PageService: PageService) {}
}
