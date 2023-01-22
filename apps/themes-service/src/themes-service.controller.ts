import { Controller } from '@nestjs/common';
import { ThemesServiceService } from './themes-service.service';

@Controller()
export class ThemesServiceController {
  constructor(private readonly themesServiceService: ThemesServiceService) {}
}
