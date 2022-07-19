import { DbService } from "@app/db";
import { InjectModel } from "@app/db/model.transformer";
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { ReturnModelType } from "@typegoose/typegoose";
import { omit } from "lodash";
import { CategoryModel } from "../category/category.model";
import { PageModel } from "../page/page.model";
import { PostModel } from "../post/post.model";
import { MarkdownYAMLProps } from "./markdown.interface";
import { dump } from "js-yaml";
import JSZip from "jszip";
import { DataDto } from "./markdown.dto";
import { Types } from "mongoose";

@Injectable()
export class MarkdownService {
  constructor(
    @InjectModel(CategoryModel)
    private readonly categoryModel: ReturnModelType<typeof CategoryModel>,
    @InjectModel(PostModel)
    private readonly postModel: ReturnModelType<typeof PostModel>,
    @InjectModel(PageModel)
    private readonly pageModel: ReturnModelType<typeof PageModel>,
    private readonly dbService: DbService
  ) {}

  /**
   * convert Markdown 到 YAML 转换器
   * @param item 文章或页面
   * @param metaData 文章或页面的 meta 数据
   * @param yaml 是否生成 YAML 格式
   * @param showTitle 是否显示标题
   * @returns 文章或页面的 Markdown 格式
   */
  convertor = <
    T extends {
      title: string;
      slug: string;
      text: string;
      created?: Date;
      modified?: Date | null;
    }
  >(
    item: T, // 待转换的数据
    metaData: Record<string, any> = {}, // 其他字段
    yaml,
    showTitle
  ): MarkdownYAMLProps => {
    const meta = {
      ...metaData,
      title: item.title,
      slug: item.slug || item.title,
      created: item.created!,
      modified: item.modified,
    };

    return {
      meta,
      text: this.markdownBuilder({ meta, text: item.text }, yaml, showTitle),
    };
  };

  /**
   * 获取文章或页面的 Markdown 格式
   */
  async getAllMarkdownData() {
    return {
      posts: await this.postModel.find({}).populate("category"), // 待讨论：加密文章是否允许导出？
      pages: await this.pageModel.find({}).lean(),
    };
  }

  /**
   * 获取文章或页面的 Markdown 格式
   * @param id 文章或页面的 id
   */
  async getSomeMarkdownData(id: string[]) {
    const docs = await Promise.all([
      this.postModel.find({ _id: { $in: id } }).populate("category"),
      this.pageModel.find({ _id: { $in: id } }).lean(),
    ]);
    const [posts, pages] = docs;
    return {
      posts,
      pages,
    };
  }

  /**
   * 生成 Markdown 格式
   * @param yamlProp 文章或页面的 Markdown 数据
   * @param yaml 是否生成 YAML 格式
   * @param showTitle 是否显示标题
   * @returns 文章或页面的 Markdown 格式
   */
  markdownBuilder(
    yamlProp: MarkdownYAMLProps,
    yaml?: boolean,
    showTitle?: boolean
  ) {
    const {
      meta: { created, modified, title },
      text,
    } = yamlProp;

    if (!yaml) {
      // 如果不是 YAML 格式，则直接返回文本
      return `
      ${showTitle ? `# ${title}\n\n` : ""}${text.trim()} 
      `; // 去除文本前后的空格
    }

    const header = {
      // yaml 的头
      date: created,
      updated: modified,
      title,
      ...omit(yamlProp.meta, ["title", "created", "modified"]),
    };

    const toYaml = dump(header, { skipInvalid: true }); // 将头转换成 yaml
    return `
---
${toYaml.trim()}
---

${showTitle ? `# ${title}\n\n` : ""}
${text.trim()}
`.trim();
  }

  /**
   * 导出 Zip
   */
  async generateArchive({
    documents,
    options = {},
  }: {
    documents: MarkdownYAMLProps[];
    options: { slug?: boolean };
  }) {
    const zip = new JSZip();

    for (const document of documents) {
      zip.file(
        (options.slug ? document.meta.slug : document.meta.title)
          .concat(".md")
          .replace(/\//g, "-"),
        document.text
      );
    }
    return zip;
  }

  /**
   * genDate 格式化日期
   * @param item Data
   */
  private readonly genDate = (item: DataDto) => {
    const { meta } = item;
    if (!meta) {
      return {
        created: new Date(),
        modified: new Date(),
      };
    }
    const { date, updated } = meta;
    return {
      created: date ? new Date(date) : new Date(),
      modified: updated
        ? new Date(updated)
        : date
        ? new Date(date)
        : new Date(),
    };
  };

  /**
   * 导入文章
   * @param data 数据
   */
  async importPostMarkdownData(data: DataDto[]) {
    const categoryNameAndId = // 获取分类名称和 id
      await (
        await this.categoryModel.find().lean()
      ).map((item) => {
        return {
          name: item.name,
          _id: item._id,
          slug: item.slug,
        };
      });
    const importWithCategoryOrCreate = async (name?: string) => {
      if (!name) return; // 如果没有分类名称，则不创建分类
      const hasCategory = categoryNameAndId.find(
        (item) => item.name === name || item.slug === name
      ); // 判断是否有分类
      if (hasCategory) {
        return hasCategory;
      } else {
        // 如果没有分类，则创建分类
        const category = await this.categoryModel.create({
          name,
          slug: name,
          type: 0, // 类型为 0 -- Category
        });
        categoryNameAndId.push({
          name: category.name,
          _id: category._id,
          slug: category.slug,
        }); // 添加到分类名称和 id 列表
        await category.save(); // 保存分类
        return category;
      }
    };
    let count = 1;
    const models = [] as PostModel[];
    const defaultCategory = await this.categoryModel.findOne();
    if (!defaultCategory) throw new InternalServerErrorException("未找到分类");
    for await (const item of data) {
      if (item.meta) {
        const category = await importWithCategoryOrCreate(
          item.meta.categories?.shift()
        );
        models.push({
          title: item.meta.title,
          slug: item.meta.slug || item.meta.title.replace(/\s/g, "-"),
          text: item.text,
          ...this.genDate(item),
          categoryId: category?._id || defaultCategory._id,
        } as PostModel);
      } else {
        models.push({
          title: `未命名-${count++}`,
          slug: new Date().getTime(),
          text: item.text,
          ...this.genDate(item),
          categoryId: new Types.ObjectId(defaultCategory._id),
        } as any as PostModel);
      }
    }

    return await this.postModel
      .insertMany(models, { ordered: false })
      .catch((err) => {
        Logger.warn(
          `一篇或多篇文章导入失败：${err.message}`,
          MarkdownService.name
        );
      });
  }

  /**
   * 导入页面
   * @param data 数据
   */
  async importPageMarkdownData(data: DataDto[]) {
    let count = 1;
    const models = [] as PageModel[];
    for await (const item of data) {
      if (item.meta) {
        models.push({
          title: item.meta.title,
          slug: item.meta.slug || item.meta.title.replace(/\s/g, "-"),
          text: item.text,
          ...this.genDate(item),
        } as PageModel);
      } else {
        models.push({
          title: `未命名-${count++}`,
          slug: new Date().getTime(),
          text: item.text,
          ...this.genDate(item),
        } as any as PageModel);
      }
    }
    return await this.pageModel
      .insertMany(models, { ordered: false })
      .catch((err) => {
        Logger.warn(
          `一个或多个页面导入失败：${err.message}`,
          MarkdownService.name
        );
      });
  }
}
