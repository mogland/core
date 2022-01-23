import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "modules/users/users.module";
import { UsersService } from "modules/users/users.service";
import { CommentController } from "./comment.controller";
import { Comments } from "../../shared/entities/comment.entity";
import { CommentService } from "./comment.service";

@Module({
  imports: [TypeOrmModule.forFeature([Comments]), UsersModule],
  controllers: [CommentController],
  providers: [CommentService, UsersService],
  exports: [TypeOrmModule],
})
export class CommentModule {}
