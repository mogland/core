/*
 * @FilePath: /mog-core/apps/page-service/src/page-service.service.ts
 * @author: Wibus
 * @Date: 2022-09-24 08:01:39
 * @LastEditors: Wibus
 * @LastEditTime: 2022-11-11 13:38:08
 * Coding With IU
 */

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { isDefined } from 'class-validator';
import { omit } from 'lodash';
import { PaginateModel } from 'mongoose';
import slugify from 'slugify';
import { ExceptionMessage } from '~/shared/constants/echo.constant';
import { NotificationEvents } from '~/shared/constants/event.constant';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { PagerDto } from '~/shared/dto/pager.dto';
import { NotFoundRpcExcption } from '~/shared/Exceptions/not-found-rpc-exception';
import { InjectModel } from '~/shared/transformers/model.transformer';
import { PageModel } from './model/page.model';

@Injectable()
export class PageService {
  constructor(
    @InjectModel(PageModel)
    private readonly pageModel: ModelType<PageModel> &
      PaginateModel<PageModel & Document>,

    @Inject(ServicesEnum.notification)
    private readonly notification: ClientProxy,
  ) { }

  public get model() {
    return this.pageModel;
  }

  async getPaginate({ size, select, page, sortBy, sortOrder }: PagerDto) {
    return this.model.paginate(
      {},
      {
        page,
        limit: size,
        select,
        sort: sortBy
          ? { [sortBy]: sortOrder || -1 }
          : { order: -1, modified: -1 },
      },
    );
  }

  async getPageById(id: string) {
    const res = this.model.findById(id).lean({ getters: true });
    if (!res) {
      throw new NotFoundRpcExcption(ExceptionMessage.PageIsNotExist);
    }
    return res;
  }

  async getPageBySlug(slug: string, password?: any, isMaster?: boolean) {
    const res = await this.model
      .findOne({ slug })
      .lean({ getters: true })
      .then((page) => {
        if (!page) {
          throw new NotFoundRpcExcption(ExceptionMessage.PageIsNotExist);
        }
        if (!isMaster && page.password) {
          if (!password || password !== page.password) {
            page.text = ExceptionMessage.PageIsProtected;
          } else {
            page.password = undefined;
          }
        } else {
          page.password = undefined;
        }
        return page;
      });

    return res;
  }

  public async create(data: PageModel) {
    const res = await this.model.create({
      ...data,
      slug: slugify(data.slug!),
      created: new Date(),
    });
    this.notification.emit(NotificationEvents.SystemPageCreate, res);
    return res;
  }

  public async updateById(id: string, data: Partial<PageModel>) {
    if (['text', 'title', 'subtitle'].some((key) => isDefined(data[key]))) {
      data.modified = new Date();
    }
    if (data.slug) {
      data.slug = slugify(data.slug);
    }
    const res = await this.model
      .findOneAndUpdate(
        { _id: id },
        { ...omit(data, PageModel.protectedKeys) },
        { new: true },
      )
      .lean({ getters: true });
    if (!res) {
      throw new NotFoundRpcExcption(ExceptionMessage.PageIsNotExist);
    }
    this.notification.emit(NotificationEvents.SystemPageUpdate, res);
    return res;
  }
}
