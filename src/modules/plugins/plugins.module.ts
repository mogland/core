import { Module } from "@nestjs/common";
import { PluginsService } from "./plugins.service";
import { PluginsController } from "./plugins.controller";
import { ConfigsModule } from "../configs/configs.module";

@Module({
  imports: [ConfigsModule],
  providers: [PluginsService],
  controllers: [PluginsController],
  exports: [PluginsService],
})
export class PluginsModule {}
