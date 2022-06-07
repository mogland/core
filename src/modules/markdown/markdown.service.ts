import { Injectable } from '@nestjs/common';
import { dump } from 'js-yaml'
import JSZip from 'jszip'
import { render, renderFile } from 'ejs'
import { omit } from 'lodash'
import { CategoriesService } from '../../modules/categories/categories.service';
import { CommentsService } from '../../modules/comments/comments.service';
import { PagesService } from '../../modules/pages/pages.service';
import { PostsService } from '../../modules/posts/posts.service';
import { MarkdownYAMLProperty } from './markdown.interface';
import { path, argv } from 'zx';
import { EngineController } from '../engine/engine.controller';
const theme = process.env.theme ? process.env.theme : 'default'
@Injectable()
export class MarkdownService {

  constructor(
    private pagesService: PagesService,
    private postsService: PostsService,
    private categoriesService: CategoriesService,
    private commentsService: CommentsService,
    private engineController: EngineController,
  ){}

  async extractAllArticle() {
    return {
      posts: await this.postsService.all(),
      pages: await this.pagesService.all(),
    }
  }

  async generateArchive({
    documents,
    options = {},
  }: {
    documents: MarkdownYAMLProperty[]
    options: { slug?: boolean }
  }) {
    const zip = new JSZip()

    for (const document of documents) {
      zip.file(
        (options.slug ? document.meta.slug : document.meta.title)
          .concat('.md')
          .replace(/\//g, '-'),
        document.content,
      )
    }
    return zip
  }
  markdownBuilder(
    property: MarkdownYAMLProperty,
    includeYAMLHeader?: boolean,
    showHeader?: boolean,
  ) {
    const {
      meta: { createdAt, updatedAt, title },
      content,
    } = property
    if (!includeYAMLHeader) {
      return `${showHeader ? `# ${title}\n\n` : ''}${content.trim()}`
    }
    const header = {
      date: createdAt,
      updated: updatedAt,
      title,
      ...omit(property.meta, ['createdAt', 'updatedAt', 'title']),
    }
    const toYaml = dump(header, { skipInvalid: true })
    const res = `
---
${toYaml.trim()}
---

${showHeader ? `# ${title}\n\n` : ''}
${content.trim()}
`.trim()

    return res
  }
  async htmlBuilder(
    data: any,
    type: any,
    extra: any,
  ) {
    // console.log(`${__dirname}/../../views/${theme}/index.ejs`)
    return await renderFile( // 渲染模板
      path.join(argv.length ? __dirname : __dirname.replace("modules/markdown", ""), `views/${theme}${type}`, '[path].ejs'), // 模板路径
      { // 渲染数据
        ...await this.engineController.baseProps(),
        ...data,
      }
    ) as string
  }
}
