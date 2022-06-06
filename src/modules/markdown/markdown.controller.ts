import { Controller, Get, Header, Query } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import JSZip = require('jszip');
import { CategoriesService } from 'modules/categories/categories.service';
import { CommentsService } from 'modules/comments/comments.service';
import { PagesService } from 'modules/pages/pages.service';
import { PostsService } from 'modules/posts/posts.service';
import { join } from 'path';
import { Readable } from 'stream';
import { ExportMarkdownQueryDto } from './markdown.dto';
import { MarkdownYAMLProperty } from './markdown.interface';
import { MarkdownService } from './markdown.service';

@Controller('Markdown')
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
  @ApiProperty({ description: '导出 Markdown YAML 数据' })
  @Header('Content-Type', 'application/zip')
  async exportArticleToMarkdown(@Query() query: ExportMarkdownQueryDto) {
    const allArticles = await this.service.extractAllArticle()
    const { posts } = allArticles
    const convertor = <
      T extends {
        content: string
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
      // console.log(item.content)
      return {
        meta,
        // text: item.text,
        text: this.service.markdownBuilder(
          { meta, text: item.content },
          true,
          true,
        ),
      }
    }
    const convertPost = posts.map((post) =>
      convertor(post! as any, {
        categories: post.slug,
        type: 'post',
        permalink: `posts/${post.slug}`,
      }),
    )
    const map = {
      posts: convertPost,
    }
    const rtzip = new JSZip()
    await Promise.all(
      Object.entries(map).map(async ([key, arr]) => {
        const zip = await this.service.generateArchive({
          documents: arr,
          options: {
            slug: true,
          },
        })

        zip.forEach(async (relativePath, file) => {
          rtzip.file(join(key, relativePath), file.nodeStream())
        })
      }),
    )

    const readable = new Readable()
    readable.push(await rtzip.generateAsync({ type: 'nodebuffer' }))
    readable.push(null)

    return readable
  }
}