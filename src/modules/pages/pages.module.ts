import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PagesController } from "./pages.controller";
import { Pages } from "../../shared/entities/pages.entity";
import { PagesService } from "./pages.service";
import { CommentsModule } from "modules/comments/comments.module";
import { UsersModule } from "modules/users/users.module";
import { CommentsService } from "modules/comments/comments.service";

@Module({
  imports: [TypeOrmModule.forFeature([Pages]),CommentsModule, UsersModule],
  providers: [PagesService, CommentsService],
  controllers: [PagesController],
  exports: [TypeOrmModule],
})
export class PagesModule {}
