/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BadRequestException, Body, Controller, Get, Header, Post, Query, Res } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Auth } from '~/common/decorator/auth.decorator';
import { HTTPDecorators } from '~/common/decorator/http.decorator';
import { ApiName } from '~/common/decorator/openapi.decorator';
import { CategoryModel } from '../category/category.model';
import { ExportMarkdownDto, ImportMarkdownDto } from './markdown.dto';
import { MarkdownService } from './markdown.service';
import JSZip from 'jszip';
import { join } from 'path';
import { ArticleTypeEnum } from './markdown.interface';
@Controller('markdown')
@ApiName
export class MarkdownController {

  constructor(
    private readonly markdownService: MarkdownService,
  ) { }

  @Post('/export')
  @Auth()
  @ApiProperty({ description: '导出部分 Markdown 文件' })
  @HTTPDecorators.Bypass
  async exportSomeMarkdowns(@Query() { showTitle, slug, yaml }: ExportMarkdownDto, @Body() { id }: any, @Res() res) {
    const { posts, pages } = await this.markdownService.getSomeMarkdownData(id); // 获取部分数据
    // 如果 posts 和 pages 合起来只有一条数据，则直接导出
    if (id.length === 1) {
      const [post, page] = [posts[0], pages[0]];
      const document = post || page;
      if (!document) throw new BadRequestException('没有找到相关数据');
      const type = post ? 'post' : 'page';
      const permalink = post ? `/posts/${post.slug}` : page.slug;
      const categories = post ? (post.category as CategoryModel).name : undefined;
      const subtitle = page ? page.subtitle : undefined;
      const result = this.markdownService.convertor(document!, {
        categories,
        subtitle,
        type,
        permalink,
      }, yaml, showTitle);

      res.header('Content-Type', 'text/plain;charset=utf-8');
      res.header('Content-Disposition', `attachment; filename=${slug ? result.meta.slug : result.meta.title}.md`);
      res.send(result.text);
      
      // res.header('Content-Type', 'application/octet-stream');
      // res.header('Content-Disposition', `attachment; filename=${id[0]}.md`);
      // res.send(result);
    } else {
      const convertPost = posts.map(item =>
        this.markdownService.convertor(item!, {
          categories: (item.category as CategoryModel).name,
          type: "post",
          permalink: `/posts/${item.slug}`,
        }, yaml, showTitle)
      );
      const convertPage = pages.map((item) =>
        this.markdownService.convertor(item!, {
          subtitle: item.subtitle,
          type: 'page',
          permalink: item.slug,
        }, yaml, showTitle),
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

      const buffer = await rtzip.generateAsync({ type: 'nodebuffer' })
      res.header('Content-Type', 'application/zip');
      res.header('Content-Disposition', `attachment; filename=markdown.zip`);
      res.send(buffer);
    }

  }

  @Get('/export/all')
  @Auth()
  @ApiProperty({ description: '导出 Markdown YAML 数据' })
  @HTTPDecorators.Bypass
  @Header('Content-Type', 'application/zip')
  @Header('Content-Disposition', 'attachment; filename=markdown.zip')
  async exportAllMarkdowns(@Query() { showTitle, slug, yaml }: ExportMarkdownDto) {
    const { posts, pages } = await this.markdownService.getAllMarkdownData();

    // 转换 posts 和 pages
    const convertPost = posts.map(item =>
      this.markdownService.convertor(item!, {
        categories: (item.category as CategoryModel).name,
        type: "post",
        permalink: `/posts/${item.slug}`,
      }, yaml, showTitle)
    );
    const convertPage = pages.map((item) =>
      this.markdownService.convertor(item!, {
        subtitle: item.subtitle,
        type: 'page',
        permalink: item.slug,
      }, yaml, showTitle),
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

    const buffer = await rtzip.generateAsync({ type: 'nodebuffer' })
    return buffer

    // const readable = new Readable()
    // readable.push()
    // readable.push(null)

    // return readable

  }

  @Post('/import')
  @Auth()
  @ApiProperty({ description: '导入 Markdown YAML 数据' })
  async importMarkdownData(@Body() body: ImportMarkdownDto) {
    const type = body.type

    switch (type) {
      case ArticleTypeEnum.Post: {
        return await this.markdownService.importPostMarkdownData(body.data)
      }
      case ArticleTypeEnum.Page: {
        return await this.markdownService.importPageMarkdownData(body.data)
      }
    }
  }
}
