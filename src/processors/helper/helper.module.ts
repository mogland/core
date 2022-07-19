/*
 * @FilePath: /nx-core/src/processors/helper/helper.module.ts
 * @author: Wibus
 * @Date: 2022-07-03 21:26:11
 * @LastEditors: Wibus
 * @LastEditTime: 2022-07-19 14:27:28
 * Coding With IU
 */

import { forwardRef, Global, Module, Provider } from "@nestjs/common";
import { PageModule } from "~/modules/page/page.module";
import { PostModule } from "~/modules/post/post.module";
import { HttpService } from "./helper.http.service";
import { ImageService } from "./helper.image.service";
import { ThumbsService } from "./helper.thumbs.service";
import { UrlService } from "./helper.url.service";

const providers: Provider<any>[] = [HttpService, UrlService, ThumbsService, ImageService];

@Module({
  imports: [forwardRef(() => PostModule), forwardRef(() => PageModule)],
  providers,
  exports: providers,
})
@Global()
export class HelperModule {}
