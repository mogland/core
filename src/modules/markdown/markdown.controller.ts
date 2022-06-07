import { Controller, Get, Head, Header, Query, Res } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import JSZip from 'jszip';
import { CategoriesService } from '../../modules/categories/categories.service';
import { CommentsService } from '../../modules/comments/comments.service';
import { PagesService } from '../../modules/pages/pages.service';
import { PostsService } from '../../modules/posts/posts.service';
import path, { join } from 'path';
import { Readable } from 'stream';
import { ExportMarkdownQueryDto } from './markdown.dto';
import { MarkdownYAMLProperty } from './markdown.interface';
import { MarkdownService } from './markdown.service';
import { HTTPDecorators } from '~/common/decorator/http.decorator';
import { fs } from 'zx';

@Controller('markdown')
@ApiTags('Markdown')
export class MarkdownController {
  constructor(
    private pagesService: PagesService,
    private postsService: PostsService,
    private categoriesService: CategoriesService,
    private commentsService: CommentsService,
    private readonly service: MarkdownService,
  ) { }

  @Get('/extractAllArticle')
  async extractAllArticle() {
    return this.service.extractAllArticle();
  }

  @Get('/export')
  // @Auth()
  @HTTPDecorators.Bypass
  @ApiProperty({ description: '导出 Markdown YAML 数据' })
  // @Header('Content-Type', 'application/zip') // 设置响应头
  async exportArticleToMarkdown(@Res() res,@Query() query: ExportMarkdownQueryDto) {
    const { show_title: showTitle, slug, yaml } = query
    const allArticles = await this.service.extractAllArticle()
    const { posts } = allArticles
    const convertor = <
      T extends {
        content: string
        createdAt?: Date
        updatedAt?: Date | null
        title: string
        path?: string
      },
      >(
        item: T,
        extraMetaData: Record<string, any> = {},
    ): MarkdownYAMLProperty => {
      const meta = {
        createdAt: item.createdAt!,
        updatedAt: item.updatedAt,
        title: item.title,
        path: item.path || item.title,
        ...extraMetaData,
      }
      // console.log(item.content)
      return {
        meta,
        // text: item.text,
        content: this.service.markdownBuilder(
          { meta, content: item.content },
          yaml,
          showTitle,
        ),
      }
    }
    const convertPost = posts.map((post) =>
      convertor(post!, {
        categories: post.slug,
        type: 'post',
        permalink: `posts/${post.path}`,
      }),
    )
    
    // zip
    const map = {
      posts: convertPost,
      // pages: convertPage,
      // notes: convertNote,
    }

    const rtzip = new JSZip()

    await Promise.all(
      Object.entries(map).map(async ([key, arr]) => {
        const zip = await this.service.generateArchive({
          documents: arr,
          options: {
            slug,
          },
        })

        zip.forEach(async (relativePath, file) => {
          rtzip.file(join(key, relativePath), file.nodeStream())
        })
      }),
    )

    const buffer = await rtzip.generateAsync({
      type: 'nodebuffer',
    })
    // use res.send() to send the file to the client instead of writing it to disk
    // use readable can't send
    res.setHeader('Content-Disposition', 'attachment; filename=markdown.zip')
    res.setHeader('Content-Type', 'application/zip')
    res.send(buffer)
    
  }
}