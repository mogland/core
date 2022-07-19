import { DbService } from '@app/db';
import { InjectModel } from '@app/db/model.transformer';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { omit } from 'lodash';
import { CategoryModel } from '../category/category.model';
import { PageModel } from '../page/page.model';
import { PostModel } from '../post/post.model';
import { MarkdownYAMLProps } from './markdown.interface';
import { dump } from 'js-yaml';
import JSZip from 'jszip';

@Injectable()
export class MarkdownService {
  constructor(
    @InjectModel(CategoryModel)
    private readonly categoryModel: ReturnModelType<typeof CategoryModel>,
    @InjectModel(PostModel)
    private readonly postModel: ReturnModelType<typeof PostModel>,
    @InjectModel(PageModel)
    private readonly pageModel: ReturnModelType<typeof PageModel>,
    private readonly dbService: DbService,
  ) { }

  // 将 Markdown 数据转换成 YAML 数据 的「转换器」
  convertor = <
    T extends {
      title: string,
      slug: string,
      text: string,
      created?: Date,
      modified?: Date | null,
    }>(
      item: T, // 待转换的数据
      metaData: Record<string, any> = {}, // 其他字段
      yaml,
      showTitle,
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
      text: this.markdownBuilder(
        { meta, text: item.text },
        yaml,
        showTitle,
      )
    }
  }

  async getAllMarkdownData() {
    return {
      posts: await this.postModel.find({}).populate('category'), // 待讨论：加密文章是否允许导出？
      pages: await this.pageModel.find({}).lean(),
    }
  }

  async getSomeMarkdownData(id: string[]) {
    const docs = await Promise.all([
      this.postModel.find({ _id: { $in: id } }).populate('category'),
      this.pageModel.find({ _id: { $in: id } }).lean(),
    ]);
    const [posts, pages] = docs;
    return {
      posts,
      pages,
    };
  }

  markdownBuilder(
    yamlProp: MarkdownYAMLProps,
    yaml?: boolean,
    showTitle?: boolean,
  ) {
    const {
      meta: { created, modified, title },
      text
    } = yamlProp;

    if (!yaml) { // 如果不是 YAML 格式，则直接返回文本
      return `
      ${showTitle ? `# ${title}\n\n` : ''}${text.trim()} 
      `; // 去除文本前后的空格
    }

    const header = { // yaml 的头
      date: created,
      updated: modified,
      title,
      ...omit(yamlProp.meta, ['title', 'created', 'modified'])
    }

    const toYaml = dump(header, { skipInvalid: true }); // 将头转换成 yaml
    return `
---
${toYaml.trim()}
---

${showTitle ? `# ${title}\n\n` : ''}
${text.trim()}
`.trim();

  }

  async generateArchive({
    documents,
    options = {},
  }: {
    documents: MarkdownYAMLProps[];
    options: { slug?: boolean }
  }) {
    const zip = new JSZip()

    for (const document of documents) {
      zip.file(
        (options.slug ? document.meta.slug : document.meta.title)
          .concat('.md')
          .replace(/\//g, '-'),
        document.text,
      )
    }
    return zip
  }

}
