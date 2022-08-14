/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Controller, Get, NotFoundException, Param, Query, Res } from '@nestjs/common';
import { join } from 'path';
import { Auth } from '~/common/decorator/auth.decorator';
import { ApiName } from '~/common/decorator/openapi.decorator';
import { THEME_DIR } from '~/constants/path.constant';
import { ThemeService } from './theme.service';
import mime from 'mime';
import { CategoryService } from '../category/category.service';
import { CommentService } from '../comments/comments.service';
import { LinksService } from '../links/links.service';
import { PageService } from '../page/page.service';
import { PostService } from '../post/post.service';
import { UserService } from '../user/user.service';
import { CategoryThemeInterface, IndexThemeInterface, PageThemeInterface, PostThemeInterface, TagThemeInterface, ThemeBasicInterface } from './theme.interface';
import { CategoryType } from '../category/category.model';
import { ConfigsService } from '../configs/configs.service';
import { CannotFindException } from '~/common/exceptions/cant-find.exception';
import { md5 } from '~/utils/tools.util';
import { ThemeDto } from '../configs/configs.dto';
import { CommentStatus, CommentType } from '../comments/comments.model';
import { PagerDto } from '~/shared/dto/pager.dto';

@Controller('theme')
@ApiName
export class ThemeController {
  constructor(
    private readonly themeService: ThemeService,
    private readonly configService: ConfigsService,
    private readonly postService: PostService,
    private readonly pageService: PageService,
    private readonly categoryService: CategoryService,
    private readonly commentService: CommentService,
    private readonly linksService: LinksService,
    private readonly userService: UserService,
  ) { }

  private async basicProps() {
    return {
      site: {
        posts: await this.postService.model.find(),
        pages: await this.pageService.model.find(),
        categories: await this.categoryService.model.find({
          type: CategoryType.Category
        }),
        tags: await this.categoryService.model.find({
          type: CategoryType.Tag
        }),
      },
      configs: {
        urls: await this.configService.get("urls"),
        site: await this.configService.get("site"),
        theme: await this.configService.get("theme") as ThemeDto,
      },
    }
  }

  // ********************************************************
  // 以下是管理命令

  @Get('/admin/available')
  @Auth()
  async availableThemes() {
    return this.themeService.availableThemes();
  }

  @Get('/admin/up')
  @Auth()
  async turnOnTheme(@Query('name') name: string) {
    return this.themeService.turnOnTheme(name);
  }

  @Get('/admin/current')
  @Auth()
  async currentTheme() {
    return this.themeService.currentTheme();
  }

  @Get('/admin/off')
  @Auth()
  async turnOffTheme(@Query('name') name: string) {
    return this.themeService.turnOffTheme(name);
  }

  // ********************************************************
  // 以下是针对静态资源访问的接口
  @Get('/public/*')
  async public(@Res() res, @Param() param: string) {
    const filePath = join(THEME_DIR, (await this.themeService.currentTheme())!.name, "public", param['*']);
    const file = await fs.readFile(filePath);
    if (!file) {
      return res.status(404).send();
    } else {
      res.type(mime.getType(filePath));
      res.send(file);
    }
  }


  // ********************************************************
  // 以下是主题渲染相关的方法

  @Get('/') // 首页
  async renderIndex(@Res() res, @Query() pager: PagerDto) {
    return await res.view(
      `${(await this.themeService.currentTheme())!.name}/index.ejs` as string,
      {
        ...(await this.basicProps()),
        path: '/',
        aggregate: await this.postService.aggregatePaginate(pager),
      } as IndexThemeInterface,
    );
  }

  @Get("/:path") // 页面
  async renderPage(@Res() res, @Param("path") path: string) {
    const page = await this.pageService.model.findOne({ path })
    if (!page) {
      return res.view(
        `${(await this.themeService.currentTheme())!.name}/404.ejs` as string,
        {
          ...(await this.basicProps()),
          path,
        } as ThemeBasicInterface,
      )
    }
    return await res.view(
      `${(await this.themeService.currentTheme())!.name}/page.ejs` as string,
      {
        ...(await this.basicProps()),
        path,
        page,
        comments: await this.commentService.model.find({
          ref: page._id,
          refType: CommentType.Page,
          status: CommentStatus.Read,
        })
      } as PageThemeInterface,
    );
  }

  @Get("/:category/:slug") // 文章
  async renderPost(@Res() res, @Param() param: any, @Query("password") password: string | null) {
    const { category, slug } = param;
    const categoryDocument = await this.postService.getCategoryBySlug(category);
    if (password === undefined || !password) password = null;
    if (!categoryDocument) {
      throw new NotFoundException("该分类不存在w");
    }
    const postDocument = await (
      await this.postService.model
        .findOne({
          category: categoryDocument._id,
          slug,
        })
        // 如果不是master，并且password不为空，则将text,summary修改
        .then((postDocument) => {
          if (!postDocument) {
            throw new CannotFindException();
          }
          if (postDocument.password) {
            if (!password || md5(password) !== postDocument.password) {
              // 将传入的 password 转换为 md5 字符串，与数据库中的 password 比较
              // 将text, summary改为"内容已被隐藏"
              postDocument.text = "内容已被隐藏，请输入密码";
              postDocument.summary = "内容已被隐藏，请输入密码";
            } else {
              postDocument.password = null;
            }
          } else {
            postDocument.password = null;
          }
          return postDocument;
        })
    )

    if (!postDocument || postDocument.hide) {
      return res.view(
        `${(await this.themeService.currentTheme())!.name}/404.ejs` as string,
        {
          ...(await this.basicProps()),
          path: `/${category}/${slug}`,
        } as ThemeBasicInterface,
      )
    }
    const data: PostThemeInterface = {
      ...(await this.basicProps()),
      path: `/${category}/${slug}`,
      page: postDocument,
      comments: await this.commentService.model.find({
        ref: postDocument._id,
        refType: CommentType.Post,
        status: CommentStatus.Read,
      }),
    };
    return res.view(
      `${(await this.themeService.currentTheme())!.name}/post.ejs` as string,
      data,
    );
  }

  @Get("/archive") // 归档
  async renderArchive(@Res() res) {
    return await res.view(
      `${(await this.themeService.currentTheme())!.name}/archive.ejs` as string,
      {
        ...(await this.basicProps()),
        path: '/archive',
      } as ThemeBasicInterface,
    );
  }

  @Get("/category/:slug") // 分类
  async renderCategory(@Res() res, @Param("slug") slug: string) {
    const pageDoc = await this.categoryService.model.findOne({ slug }).sort({ created: -1 }).lean()
    if (!pageDoc) {
      return res.view(
        `${(await this.themeService.currentTheme())!.name}/404.ejs` as string,
        {
          ...(await this.basicProps()),
          path: `/category/${slug}`,
        } as ThemeBasicInterface,
      )
    }
    const pageChildren = await this.categoryService.findPostsInCategory(pageDoc._id) || [];
    const page = {
      data: {
        ...pageDoc,
        children: pageChildren,
      }
    }
    const data: CategoryThemeInterface = {
      ...(await this.basicProps()),
      path: `/category/${slug}`,
      page,
    }
    return res.view(
      `${(await this.themeService.currentTheme())!.name}/category.ejs` as string,
      data,
    );
  }

  @Get("/tag/:slug") // 标签
  async renderTag(@Res() res, @Param("slug") slug: string) {
    const page = {
      tag: slug,
      data: await this.categoryService.findPostWithTag(slug) || [],
    }
    if (!page.data.length) {
      return res.view(
        `${(await this.themeService.currentTheme())!.name}/404.ejs` as string,
        {
          ...(await this.basicProps()),
          path: `/tag/${slug}`,
        } as ThemeBasicInterface,
      )
    }
    const data: TagThemeInterface = {
      ...(await this.basicProps()),
      path: `/tag/${slug}`,
      page,
    }
    return res.view(
      `${(await this.themeService.currentTheme())!.name}/tag.ejs` as string,
      data,
    );
  }

  @Get("/links") // 友链
  async renderLinks(@Res() res, @Query() pager: PagerDto) {
    const { size, page, status } = pager;
    const linksData = await this.linksService.model.paginate(
      status !== undefined ? { status } : {},
      {
        limit: size,
        page,
        sort: { created: -1 },
        select: "-email",
      }
    );
    const data = {
      ...(await this.basicProps()),
      path: "/links",
      links: linksData,
    }
    return res.view(
      `${(await this.themeService.currentTheme())!.name}/links.ejs` as string,
      data,
    );
  }


}
