/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Controller, Get, Header, Query } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Auth } from '~/common/decorator/auth.decorator';
import { HTTPDecorators } from '~/common/decorator/http.decorator';
import { ApiName } from '~/common/decorator/openapi.decorator';
import { CategoryModel } from '../category/category.model';
import { ExportMarkdownDto } from './markdown.dto';
import { MarkdownYAMLProps } from './markdown.interface';
import { MarkdownService } from './markdown.service';
import JSZip from 'jszip';
import { join } from 'path';
import { Readable } from 'stream';
@Controller('markdown')
@ApiName
export class MarkdownController {

  constructor(
    private readonly markdownService: MarkdownService,
  ) { }

  @Get('/export')
  @Auth()
  @ApiProperty({ description: '导出 Markdown YAML 数据' })
  @HTTPDecorators.Bypass
  @Header('Content-Type', 'application/zip')
  async exportMarkdown(@Query() { showTitle, slug, yaml }: ExportMarkdownDto) {
    const { posts, pages } = await this.markdownService.getAllMarkdownData();

    // 将 Markdown 数据转换成 YAML 数据 的「转换器」
    const convertor = <
      T extends {
        title: string,
        slug: string,
        text: string,
        created?: Date,
        modified?: Date | null,
      }>(
        item: T, // 待转换的数据
        metaData: Record<string, any> = {} // 其他字段
      ): MarkdownYAMLProps => {

      const meta = {
        ...metaData,
        title: item.title,
        slug: item.slug || item.title,
        created: item.created!,
        modified: item.modified,
      }

      return {
        meta,
        text: this.markdownService.markdownBuilder(
          { meta, text: item.text },
          yaml,
          showTitle,
        )
      }
    }

    // 转换 posts 和 pages
    const convertPost = posts.map(item =>
      convertor(item!, {
        categories: (item.category as CategoryModel).name,
        type: "post",
        permalink: `/posts/${item.slug}`,
      })
    );
    const convertPage = pages.map((item) =>
      convertor(item!, {
        subtitle: item.subtitle,
        type: 'page',
        permalink: item.slug,
      }),
    )

    const pkg = {
      posts: convertPost,
      pages: convertPage,
    }

    const rtzip = new JSZip();

    // 将转换后的数据写入 zip 压缩包
    await Promise.all(
      Object.entries(pkg).map(async ([key, documents]) => {
        const zip = await this.markdownService.generateArchive({
          documents,
          options: { slug },
        })

        zip.forEach(async (relativePath, file) => {
          rtzip.file(join(key, relativePath), file.nodeStream())
        })
      })
    )

    const readable = new Readable()
    readable.push(await rtzip.generateAsync({ type: 'nodebuffer' }))
    readable.push(null)

    return readable

  }
}
