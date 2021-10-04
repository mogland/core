import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagesController } from './pages.controller';
import { Pages } from './pages.entity';
import { PagesService } from './pages.service';
import { CommentModule } from './comment/comment.module';


@Module({
    imports: [TypeOrmModule.forFeature([Pages]), CommentModule],
    providers: [PagesService],
    controllers: [PagesController],
    exports: [TypeOrmModule],
})
export class PagesModule {}
