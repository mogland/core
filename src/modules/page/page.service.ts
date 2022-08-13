import { InjectModel } from "@app/db/model.transformer";
import { Injectable } from "@nestjs/common";
import { isDefined } from "class-validator";
import slugify from "slugify";
// import { PluginsService } from '../plugins/plugins.service';
import { PageModel } from "./page.model";
import { omit } from "lodash";
import { CannotFindException } from "~/common/exceptions/cant-find.exception";
import { ImageService } from "~/processors/helper/helper.image.service";
import { PagerDto } from "~/shared/dto/pager.dto";

@Injectable()
export class PageService {
  constructor(
    @InjectModel(PageModel)
    private readonly pageModel: MongooseModel<PageModel>,

    private readonly imageService: ImageService
  ) {}

  public get model() {
    return this.pageModel;
  }

  async getPaginate(query: PagerDto) {
    const { size, select, page, sortBy, sortOrder } = query;
    return this.model.paginate(
      {},
      {
        page,
        limit: size,
        select,
        sort: sortBy
          ? { [sortBy]: sortOrder || -1 }
          : { order: -1, modified: -1 },
      }
    );
  }

  public async create(data: PageModel) {
    // data.text = await this.pluginService.usePlugins("page", "create", data.text)
    const res = await this.model.create({
      ...data,
      slug: slugify(data.slug),
      created: new Date(),
    });
    process.nextTick(async () => {
      // 异步更新缓存
      await Promise.all([
        this.imageService.recordImageMeta(this.pageModel, res._id),
      ]);
    });
    return res;
  }

  public async updateById(id: string, data: Partial<PageModel>) {
    if (["text", "title", "subtitle"].some((key) => isDefined(data[key]))) {
      data.modified = new Date();
    }
    if (data.slug) {
      data.slug = slugify(data.slug);
    }
    // data.text = await this.pluginService.usePlugins("page", "update", data.text)
    const res = await this.model
      .findOneAndUpdate(
        { _id: id },
        { ...omit(data, PageModel.protectedKeys) },
        { new: true }
      )
      .lean({ getters: true });
    if (!res) {
      throw new CannotFindException();
    }
    process.nextTick(async () => {
      // 异步更新缓存
      await Promise.all([
        this.imageService.recordImageMeta(this.pageModel, id),
      ]);
    });
    return res;
  }
}
