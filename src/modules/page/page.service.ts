import { InjectModel } from '@app/db/model.transformer';
import { Injectable } from '@nestjs/common';
import { isDefined } from 'class-validator';
import slugify from 'slugify';
import { PluginsService } from '../plugins/plugins.service';
import { PageModel } from './page.model';
import { omit } from 'lodash'
import { CannotFindException } from '~/common/exceptions/cant-find.exception';

@Injectable()
export class PageService {

  constructor(
    @InjectModel(PageModel)
    private readonly pageModel: MongooseModel<PageModel>,
    private readonly pluginService: PluginsService,
  ){}

  public get model() {
    return this.pageModel
  }

  public async create(data: PageModel){
    data.text = await this.pluginService.usePlugins("page", "create", data.text)
    const res = await this.model.create({
      ...data,
      slug: slugify(data.slug),
      created: new Date(),
    })
    return res
  }

  public async updateById(id: string, data: Partial<PageModel>){
    if (['text', 'title', 'subtitle'].some((key) => isDefined(data[key]))) {
      data.modified = new Date()
    }
    if (data.slug) {
      data.slug = slugify(data.slug)
    }
    data.text = await this.pluginService.usePlugins("page", "update", data.text)
    const res = await this.model
      .findOneAndUpdate(
        { _id: id },
        { ...omit(data, PageModel.protectedKeys)},
        { new: true },
      ) 
      .lean( { getters: true } )
    if (!res) {
      throw new CannotFindException()
    }
    return res
  }

}
