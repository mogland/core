import { Injectable } from "@nestjs/common";
import { ReturnModelType } from "@typegoose/typegoose";
import { PageModel } from "~/modules/page/page.model";
import { PostModel } from "~/modules/post/post.model";
import { InjectModel } from "./model.transformer";

@Injectable()
export class DbService {
  constructor(
    @InjectModel(PostModel)
    private readonly postModel: ReturnModelType<typeof PostModel>,
    @InjectModel(PageModel)
    private readonly pageModel: ReturnModelType<typeof PageModel>
  ) {}

  public getModelByRefType(type: "Post"): ReturnModelType<typeof PostModel>;
  public getModelByRefType(type: "post"): ReturnModelType<typeof PostModel>;
  public getModelByRefType(type: "Page"): ReturnModelType<typeof PageModel>;
  public getModelByRefType(type: "page"): ReturnModelType<typeof PageModel>;
  public getModelByRefType(type: any) {
    type = type.toLowerCase() as any;
    const map = new Map<any, any>([
      ["post", this.postModel],
      ["page", this.pageModel],
    ] as any);
    return map.get(type) as any as ReturnModelType<
      typeof PostModel | typeof PageModel
    >;
  }

  /**
   * findGlobalById 查找全局对象
   * @param id
   */
  public async findGlobalById(id: string) {
    const doc = await Promise.all([
      this.postModel.findById(id).populate("category").lean(),
      this.pageModel.findById(id).lean(),
    ]);
    const index = doc.findIndex(Boolean);
    if (index == -1) {
      return {
        document: null,
        type: null,
      };
    }
    const document = doc[index];
    return {
      document,
      type: (["Post", "Note", "Page"] as const)[index],
    };
  }
}
