/*
 * @FilePath: /nx-core/src/processors/helper/helper.image.service.ts
 * @author: Wibus
 * @Date: 2022-07-19 13:24:56
 * @LastEditors: Wibus
 * @LastEditTime: 2022-07-19 15:05:21
 * Coding With IU
 */

import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { ReturnModelType } from "@typegoose/typegoose";
import imageSize from "image-size";
import { marked } from "marked";
// import { ConfigsService } from "~/modules/configs/configs.service";
import { WriteBaseModel } from "~/shared/model/base.model";
import { ImageModel } from "~/shared/model/image.model";
import { getImageColor } from "~/utils/pic.util";
import { HttpService } from "./helper.http.service";

@Injectable()
export class ImageService {
  private logger: Logger;
  constructor(
    private readonly httpService: HttpService // private readonly configsService: ConfigsService,
  ) {
    this.logger = new Logger(ImageService.name);
  }

  getImagesFromMarkdown(text: string) {
    const ast = marked.lexer(text); // 解析 markdown 文本为 AST
    const images = [] as string[];
    ast.forEach((node: any) => {
      // 遍历 AST
      if (node.type === "image") {
        // 如果是图片
        images.push(node.href); // 将图片 URL 添加到数组
        return; // 结束遍历
      }
      if (node.tokens && Array.isArray(node.tokens)) {
        // 如果是子节点
        node.tokens.forEach((token) => {
          // 遍历子节点
          if (token.type === "image") {
            images.push(token.href); // 将图片 URL 添加到数组
            return; // 结束遍历
          }
        });
      }
    });
    return images;
  }

  async getOnlineImageMeta(src: string) {
    // FIXME: configsService 无法导入，即使在 src/processors/helper/helper.module.ts 中引入了 ConfigsModule

    // const {
    //   urls: { webUrl },
    // } = await this.configsService.waitForConfigReady()
    const { data, headers } = await this.httpService.axiosRef.get<any>(src, {
      responseType: "arraybuffer",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
        // referer: webUrl,
      },
    });
    const type = headers["content-type"];
    const buffer = Buffer.from(data);
    const size = imageSize(buffer);
    const color = await getImageColor(buffer, type);
    return { size, color };
  }

  async recordImageMeta<T extends WriteBaseModel>(
    _model: MongooseModel<T>,
    id: string
  ) {
    const model = _model as any as ReturnModelType<typeof WriteBaseModel>; // 将 MongooseModel 转换为 ReturnModelType
    const doc = await model.findById(id).lean();
    if (!doc) throw new InternalServerErrorException("文档不存在");
    const { text } = doc; // 获取文档内容
    const result = [] as ImageModel[];
    const oldImages = doc.images || [];
    const oldImagesMap = new Map(oldImages.map((i) => [i.src, i])); // 将 oldImages 转换为 Map
    const task = [] as Promise<ImageModel>[];
    const images = this.getImagesFromMarkdown(text); // 获取文档中的图片
    for (const src of images) {
      const origin = oldImagesMap.get(src); // 获取 oldImages 中的图片
      const keys = new Set(Object.keys(origin || {})); // 获取 origin 中的 key

      // 如果 origin 与 doc 中的 src 一致，则跳过
      if (
        origin &&
        origin.src === src &&
        ["height", "width", "type", "accent"].every(
          (key) => keys.has(key) && origin[key]
        )
      ) {
        // shit code
        result.push(origin);
        continue;
      }

      const promise = new Promise<ImageModel>((resolve) => {
        this.logger.log(`获取图片 ${src} 的元信息`);

        this.getOnlineImageMeta(src)
          .then(({ size, color }) => {
            const fileName = src.split("/").pop(); // 获取图片名称
            this.logger.debug(
              `[${fileName}]: height: ${size.height}, width: ${size.width}, color: ${color}`
            );
            resolve({ ...size, color, src });
          })
          .catch((e) => {
            this.logger.error(`获取图片 ${src} 的元信息失败 | ${e.message}`);

            const oldRecord = oldImagesMap.get(src); // 获取 oldImages 中的图片
            if (oldRecord) {
              resolve(oldRecord); // 如果 oldImages 中存在该图片，则使用 oldImages 中的元信息
            } else
              resolve({
                // 否则不保存元信息
                width: undefined,
                height: undefined,
                type: undefined,
                color: undefined,
                src: undefined,
              });
          });
      });
      task.push(promise); // 将 promise 添加到 task 中
    }
    const newImages = await Promise.all(task); // 将 task 中的所有 promise 同步执行
    result.push(...newImages); // 将新获取的元信息添加到 result 中
    await model.findByIdAndUpdate(
      // 更新文档中的 images
      id,
      {
        images: result.filter(({ src }) => images.includes(src!)), // 过滤多余的元信息
      }
    );
  }
}
