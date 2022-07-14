/*
 * @FilePath: /nx-core/src/processors/helper/helper.url.service.ts
 * @author: Wibus
 * @Date: 2022-07-10 16:05:46
 * @LastEditors: Wibus
 * @LastEditTime: 2022-07-10 16:08:40
 * Coding With IU
 */
import { isDefined } from "class-validator";
import { URL } from "url";

import { Injectable } from "@nestjs/common";

import { CategoryModel } from "~/modules/category/category.model";
import { ConfigsService } from "~/modules/configs/configs.service";
import { PageModel } from "~/modules/page/page.model";
import { PostModel } from "~/modules/post/post.model";

@Injectable()
export class UrlService {
  constructor(private readonly configsService: ConfigsService) {}
  isPostModel(model: any): model is PostModel {
    return (
      isDefined(model.title) && isDefined(model.slug) && !isDefined(model.order)
    );
  }

  isPageModel(model: any): model is PageModel {
    return (
      isDefined(model.title) && isDefined(model.slug) && isDefined(model.order)
    );
  }
  build(model: PostModel | PageModel) {
    if (this.isPostModel(model)) {
      return `/posts/${
        (model.category as CategoryModel).slug
      }/${encodeURIComponent(model.slug)}`;
    } else if (this.isPageModel(model)) {
      return `/${model.slug}`;
    }

    return "/";
  }

  async buildWithBaseUrl(model: PostModel | PageModel) {
    const {
      urls: { webUrl: baseURL },
    } = await this.configsService.waitForConfigReady();

    return new URL(this.build(model), baseURL).href;
  }
}
