import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AllowAllCorsInterceptor } from "./common/interceptors/allow-all-cors.interceptor";
import PKG from "../package.json";
import { PostService } from "./modules/post/post.service";

@Controller()
@ApiTags("Root")
export class AppController {

  constructor(
    private readonly postService: PostService,
  ) { }

  @UseInterceptors(AllowAllCorsInterceptor)
  @Get(["/", "/info"])
  async appInfo() {
    return {
      name: PKG.name,
      author: PKG.author,
      version: isDev ? "dev" : PKG.version,
      homepage: PKG.homepage,
      issues: PKG.issues,
    };
  }
  @Get(["/ping"])
  ping(): "pong" {
    return "pong";
  }

  @Get("/search")
  async search(@Query("text") text: string) {
    const [posts] = await Promise.all([
      this.postService.model.find({
        $text: { $search: text },
      }).lean({ getters: true }),
    ])
    return {
      posts,
    }
  }
}
