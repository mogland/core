import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts.controller';
import { Posts } from './posts.entity';
import { PostsService } from './posts.service';

@Module({
    imports: [TypeOrmModule.forFeature([Posts])],
    providers: [PostsService],
    controllers: [PostsController],
    exports: [TypeOrmModule],
})
export class PostsModule {}
