import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ThemesEvents } from '~/shared/constants/event.constant';
import { ThemesServiceService } from './themes-service.service';

@Controller()
export class ThemesServiceController {
  constructor(private readonly themesServiceService: ThemesServiceService) {}

  // ===Microservice===
  @MessagePattern({ cmd: ThemesEvents.ThemesGetAll })
  getAllThemes() {
    return this.themesServiceService.getAllThemes();
  }

  @MessagePattern({ cmd: ThemesEvents.ThemeGetInfo })
  async getThemeInfo(data: { id: string }) {
    return await this.themesServiceService.getTheme(data.id);
  }

  @MessagePattern({ cmd: ThemesEvents.ThemeGetConfig })
  async getThemeConfig(data: { id: string }) {
    return await this.themesServiceService.getThemeConfig(data.id);
  }

  @MessagePattern({ cmd: ThemesEvents.ThemeActive })
  async activeTheme(data: { id: string }) {
    return await this.themesServiceService.activeTheme(data.id);
  }
}
