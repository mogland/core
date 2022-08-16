/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BadRequestException, Controller, Get, NotFoundException, Param, Query, Req, Res } from '@nestjs/common';
import { join } from 'path';
import { FastifyRequest } from 'fastify';
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
import { ApiOperation } from '@nestjs/swagger';
import { AggregateService } from '../aggregate/aggregate.service';
import { MultipartFile } from '@fastify/multipart';

@Controller(['theme'])
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
    private readonly aggregateService: AggregateService,
  ) { }

  // 基本配置
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
  @ApiOperation({ summary: '获取可用的主题' })
  @Auth()
  async availableThemes() {
    return this.themeService.availableThemes();
  }

  @Get('/admin/up')
  @ApiOperation({ summary: '启动主题' })
  @Auth()
  async turnOnTheme(@Query('name') name: string) {
    return this.themeService.turnOnTheme(name);
  }

  @Get('/admin/current')
  @ApiOperation({ summary: '获取当前主题' })
  @Auth()
  async currentTheme() {
    return this.themeService.currentTheme();
  }

  @Get('/admin/off')
  @ApiOperation({ summary: '关闭主题' })
  @Auth()
  async turnOffTheme(@Query('name') name: string) {
    return this.themeService.turnOffTheme(name);
  }

  // ********************************************************
  // 以下是关于管理主题下载 上传的接口

  private async ValidMultipartFields(
    req: FastifyRequest
  ): Promise<MultipartFile> {
    const data = await req.file();

    if (!data) {
      throw new BadRequestException("仅供上传文件!");
    }
    if (data.fieldname != "file") {
      throw new BadRequestException("字段必须为 file");
    }

    return data;
  }

  @Get('/admin/upload')
  @ApiOperation({ summary: '上传主题' })
  @Auth()
  async uploadTheme(@Req() req: FastifyRequest, @Query("name") name: string) {
    const data = await this.ValidMultipartFields(req);
    const { mimetype } = data;
    // 如果不是 tar.gz 文件，则抛出异常
    if (mimetype != "application/x-gzip") {
      throw new BadRequestException("仅支持 tar.gz 文件");
    }
    return await this.themeService.uploadThemeFile(await data.toBuffer(), name);
  }

  @Get('/admin/download')
  @ApiOperation({ summary: '自定义链接或从 GitHub 下载主题并上传' })
  @Auth()
  async downloadThemeAndUpload(@Query("repo") repo: string, @Query("type") type: "GitHub" | "Custom") {
    return await this.themeService.downloadRepoArchive(repo, type);
  }


  // ********************************************************
  // 以下是针对静态资源访问的接口
  @Get('/public/*')
  @ApiOperation({ summary: '静态资源访问接口' })
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

  @Get('/') // 首页 聚合
  @ApiOperation({ summary: '首页 (最新文章聚合)' })
  async renderIndex(@Res() res) {
    return await res.view(
      `${(await this.themeService.currentTheme())!.name}/index` as string,
      {
        ...(await this.basicProps()),
        path: '/',
        aggregate: (await this.aggregateService.topActivity(5, false))
      } as IndexThemeInterface,
    );
  }

  @Get(["/posts", "/posts/*"]) // 文章列表
  @ApiOperation({ summary: '文章列表 (聚合携带分页器)' })
  async renderPosts(@Res() res, @Param("*") pageProp: any) {
    const page = pageProp && pageProp.split("/")[1] || 1;
    return await res.view(
      `${(await this.themeService.currentTheme())!.name}/posts` as string,
      {
        ...(await this.basicProps()),
        path: '/posts',
        aggregate: await this.postService.aggregatePaginate({
          size: 10,
          page: page ? Number(page) : 1,
        }),
      } as IndexThemeInterface,
    )
  }

  @Get(":path") // 页面
  @ApiOperation({ summary: '页面' })
  async renderPage(@Res() res, @Param("path") path: string) {
    const page = await this.pageService.model.findOne({ path })
    if (!page) {
      const filePath = join(THEME_DIR, (await this.themeService.currentTheme())!.name, `page-${path}`);
      if (!fs.existsSync(filePath)) {
        return res.view(
          `${(await this.themeService.currentTheme())!.name}/page-${path}` as string,
          {
            ...(await this.basicProps()),
            path,
          } as ThemeBasicInterface,
        )
      }
      return res.view(
        `${(await this.themeService.currentTheme())!.name}/404` as string,
        {
          ...(await this.basicProps()),
          path,
        } as ThemeBasicInterface,
      )
    }
    return await res.view(
      `${(await this.themeService.currentTheme())!.name}/page` as string,
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
  @ApiOperation({ summary: '文章' })
  async renderPost(@Res() res, @Param() param: any, @Query("password") password: string | null) {
    const { category, slug } = param;

    const categoryDocument = await this.postService.getCategoryBySlug(category);
    if (password === undefined || !password) password = null;
    if (!categoryDocument) {
      res.view(
        `${(await this.themeService.currentTheme())!.name}/404` as string,
        {
          ...(await this.basicProps()),
          path: `/${category}/${slug}`,
        } as ThemeBasicInterface,
      )
      throw new NotFoundException("该分类不存在w");
    }
    const postDocument = await (
      await this.postService.model
        .findOne({
          category: categoryDocument._id,
          slug,
        })
        // 如果不是master，并且password不为空，则将text,summary修改
        .then(async (postDocument) => {
          if (!postDocument) {
            res.view(
              `${(await this.themeService.currentTheme())!.name}/404` as string,
              {
                ...(await this.basicProps()),
                path: `/${category}/${slug}`,
              } as ThemeBasicInterface,
            )
            throw new CannotFindException()
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
        `${(await this.themeService.currentTheme())!.name}/404` as string,
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
      `${(await this.themeService.currentTheme())!.name}/post` as string,
      data,
    );
  }

  @Get("/archive") // 归档
  @ApiOperation({ summary: '归档' })
  async renderArchive(@Res() res) {
    return await res.view(
      `${(await this.themeService.currentTheme())!.name}/archive` as string,
      {
        ...(await this.basicProps()),
        path: '/archive',
      } as ThemeBasicInterface,
    );
  }

  @Get("/category/:slug") // 分类
  @ApiOperation({ summary: '分类' })
  async renderCategory(@Res() res, @Param("slug") slug: string) {
    const pageDoc = await this.categoryService.model.findOne({ slug }).sort({ created: -1 }).lean()
    if (!pageDoc) {
      return res.view(
        `${(await this.themeService.currentTheme())!.name}/404` as string,
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
      `${(await this.themeService.currentTheme())!.name}/category` as string,
      data,
    );
  }

  @Get("/tag/:slug") // 标签
  @ApiOperation({ summary: '标签' })
  async renderTag(@Res() res, @Param("slug") slug: string) {
    const page = {
      tag: slug,
      data: await this.categoryService.findPostWithTag(slug) || [],
    }
    if (!page.data.length) {
      return res.view(
        `${(await this.themeService.currentTheme())!.name}/404` as string,
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
      `${(await this.themeService.currentTheme())!.name}/tag` as string,
      data,
    );
  }

  @Get("/links") // 友链
  @ApiOperation({ summary: '友链' })
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
      `${(await this.themeService.currentTheme())!.name}/links` as string,
      data,
    );
  }

  // @Get(":path/:props")
  // @ApiOperation({ summary: '自定义页面' })
  // async dynamic(
  //   @Res() res,
  //   @Param("path") path: string,
  //   @Param("props") props: string,
  // ) {
  //   // 检查是否存在该路径对应的文件
  //   const filePath = join(THEME_DIR, (await this.themeService.currentTheme())!.name, `page-${path}`);
  //   if (!fs.existsSync(filePath)) {
  //     return res.view(
  //       `${(await this.themeService.currentTheme())!.name}/404` as string,
  //       {
  //         ...(await this.basicProps()),
  //         path: `/${path}`,
  //         props: props.split("/"),
  //       } as CustomThemeInterface,
  //     )
  //   }
  // }

}
