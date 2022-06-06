import { Controller, Get, Header, Query } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import JSZip from 'jszip';
import { CategoriesService } from '../../modules/categories/categories.service';
import { CommentsService } from '../../modules/comments/comments.service';
import { PagesService } from '../../modules/pages/pages.service';
import { PostsService } from '../../modules/posts/posts.service';
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
    const map = {
      posts: convertPost,
    }
    // console.log(convertPost)
    const rtzip = new JSZip()
    await Promise.all(
      Object.entries(map).map(async ([key, arr]) => {
        console.log(arr)
        const zip = await this.service.generateArchive({
          documents: arr,
          options: {
            slug
          },
        })
        zip.forEach(async (relativePath, file) => {
          // file.nodeStream() // 获取文件的流，可以用来读取文件
          // join(key, relativePath) // 获取文件的绝对路径
          rtzip.file(join(key, relativePath), file.nodeStream())  // 将文件加入到压缩包中
          // 获取目前的文件的流
          const readable = file.nodeStream()
          // console.log(readable)
        })
      }),
    )

    const readable = new Readable() // 创建一个可读流
    readable.push(await rtzip.generateAsync({
      type: "nodebuffer", // 压缩类型
      compression: "DEFLATE", // 压缩算法
      compressionOptions: { // 压缩级别
        level: 9
      }
    })) // 将压缩包的内容写入到可读流中
    readable.push(null) // 写入null，表示文件写入结束
    return readable // 返回可读流
  }
}