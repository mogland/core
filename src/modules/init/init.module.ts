import { Module } from "@nestjs/common";
import { InitService } from "./init.service";
import { InitController } from "./init.controller";
import { UserModule } from "../user/user.module";
import { ConfigsModule } from "../configs/configs.module";

@Module({
  imports: [UserModule, ConfigsModule],
  providers: [InitService],
  controllers: [InitController],
  exports: [InitService],
})
export class InitModule {}
