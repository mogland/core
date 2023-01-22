import { Controller, Get } from '@nestjs/common';
import { ThemesServiceService } from './themes-service.service';

@Controller()
export class ThemesServiceController {
  constructor(private readonly themesServiceService: ThemesServiceService) {}

  @Get()
  getHello(): string {
    return this.themesServiceService.getHello();
  }
}
