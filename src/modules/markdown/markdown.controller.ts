import { Controller, Get, Header, Query } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { CategoriesService } from 'modules/categories/categories.service';
import { CommentsService } from 'modules/comments/comments.service';
import { PagesService } from 'modules/pages/pages.service';
import { PostsService } from 'modules/posts/posts.service';
import { ExportMarkdownQueryDto } from './markdown.dto';
import { MarkdownYAMLProperty } from './markdown.interface';

@Controller('Markdown')
export class MarkdownController {
  constructor(
    private pagesService: PagesService,
    private postsService: PostsService,
    private categoriesService: CategoriesService,
    private commentsService: CommentsService,
  ){}

  @Get('/export')
  // @Auth()
  @ApiProperty({ description: '导出 Markdown YAML 数据' })
  // @HTTPDecorators.Bypass
  @Header('Content-Type', 'application/zip')
  async exportArticleToMarkdown(@Query() query: ExportMarkdownQueryDto) {
    const convertor = <
      T extends {
        text: string
        created?: Date
        modified?: Date | null
        title: string
        slug?: string
      },
    >(
        item: T,
        extraMetaData: Record<string, any> = {},
      ): MarkdownYAMLProperty => {
      const meta = {
        created: item.created!,
        modified: item.modified,
        title: item.title,
        slug: item.slug || item.title,
        ...extraMetaData,
      }
      return {
        meta,
        text: item.text,
        // text: this.service.markdownBuilder(
        //   { meta, text: item.text },
        //   yaml,
        //   showTitle,
        // ),
      }
    }

  }
}
