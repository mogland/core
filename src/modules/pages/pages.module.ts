import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PagesController } from "./pages.controller";
import { Pages } from "../../shared/entities/pages.entity";
import { PagesService } from "./pages.service";

@Module({
  imports: [TypeOrmModule.forFeature([Pages])],
  providers: [PagesService],
  controllers: [PagesController],
  exports: [TypeOrmModule],
})
export class PagesModule {}
