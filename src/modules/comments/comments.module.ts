import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
import { UsersService } from "../users/users.service";
import { CommentsController } from "./comments.controller";
import { Comments } from "../../shared/entities/comments.entity";
import { CommentsService } from "./comments.service";

@Module({
  imports: [TypeOrmModule.forFeature([Comments]), UsersModule],
  controllers: [CommentsController],
  providers: [CommentsService, UsersService],
  exports: [TypeOrmModule],
})
export class CommentsModule {}
