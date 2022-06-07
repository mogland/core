import { Controller, Get, Logger, Param, Query, Render, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoriesService } from '../../modules/categories/categories.service';
import { CommentsService } from '../../modules/comments/comments.service';
import { ConfigsService } from '../../modules/configs/configs.service';
import { FriendsService } from '../../modules/friends/friends.service';
import { PagesService } from '../../modules/pages/pages.service';
import { PostsService } from '../../modules/posts/posts.service';
import { ProjectsService } from '../../modules/projects/projects.service';
import { isDev } from '../../utils/tools.util';
import { argv, fs, path } from 'zx';

const theme = process.env.theme ? process.env.theme : 'default'

@Controller('engine')
@ApiTags("Engine")
export class EngineController {

  constructor(
    private configsService: ConfigsService,
    private postService: PostsService,
    private pageService: PagesService,
    private categoriesService: CategoriesService,
    private friendsService: FriendsService,
    private projectsService: ProjectsService,
    private commentsService: CommentsService,
  ){}

  /**
   * 基本配置 通用
   * @returns Object
   */
  async baseProps() {
    return {
      sites: {
        posts: await this.postService.all(),
        pages: await this.pageService.all(),
        categories: await this.categoriesService.all(),
        friends: await this.friendsService.all(),
        projects: await this.projectsService.all(),
        comments: await this.commentsService.all(),
      },
      configs: await this.configsService.all(),
      theme: theme,
    }
  }
  
  // 根页面 首页
  @Get()
  @Render(`${theme}/index`)
  async index(@Query() query) {
    return {
      ...await this.baseProps(),
      path: '/',
      argv: {
        query: query,
      },
      page: {
        type: 'index',
        layout: 'index',
      },
    }
  }


  // 文章总览页面
  @Get("posts")
  @Render(`${theme}/posts/index`)
  async posts(@Query() query) {
    return {
      ...await this.baseProps(),
      path: '/posts',
      argv: {
        query,
      },
      page: {
        type: 'posts',
        layout: 'index',
      },
    };
  }

  // 文章详情页面
  @Get("posts/:category/:path")
  @Render(`${theme}/posts/[path]`)
  async post(@Param() param, @Query() query) {
    return {
      ...await this.baseProps(),
      path: '/posts/' + param.path,
      argv: {
        param,
        query,
      },
      page: {
        type: 'posts',
        layout: '[path]',
        data: await this.postService.findOne(param.category, param.path),
      },
    };
  }

  // 页面总览页面
  @Get("pages")
  @Render(`${theme}/pages/index`)
  async pages(@Query() query) {
    return {
      ...await this.baseProps(),
      path: '/pages',
      argv: {
        query,
      },
      page: {
        type: 'pages',
        layout: 'index',
      },
    };
  }

  // 分类归档页面
  @Get("categories/:slug")
  @Render(`${theme}/archives/[categories]`)
  async categories(@Query() query, @Param() param) {
    return {
      ...await this.baseProps(),
      path: `/categories/${param.slug}`,
      argv: {
        query,
        param,
      },
      page: {
        type: 'archives',
        layout: '[categories]',
        data: await this.categoriesService.findPosts(param.slug),
      },
    };
  }

  // 总体归档页面
  @Get("archives")
  @Render(`${theme}/archives/index`)
  async archives(@Query() query) {
    return {
      ...await this.baseProps(),
      path: '/archives',
      argv: {
        query,
      },
      page: {
        type: 'archives',
        layout: 'index',
        // data 已存在于 baseProps 中
      },
    };
  }


  // 友链总览页面
  @Get("friends")
  @Render(`${theme}/friends/index`)
  async friends(@Param() param, @Query() query) {
    return {
      ...await this.baseProps(),
      path: `/friends/${param.slug}`,
      argv: {
        query
      },
      page: {
        type: 'friends',
        layout: 'index',
        // data 已存在于 baseProps 中
      },
    };
  }

  // 项目总览页面
  @Get("projects")
  @Render(`${theme}/projects`)
  async projects(@Query() query) {
    return {
      ...await this.baseProps(),
      path: '/projects',
      argv: {
        query,
      },
      page: {
        type: 'projects',
        layout: 'index',
        // data 已存在于 baseProps 中
      },
    };
  }

  // 项目详情页面
  @Get("projects/:pid")
  @Render(`${theme}/[pid]`)
  async project(@Param() param, @Query() query) {
    return {
      ...await this.baseProps(),
      path: `/projects/${param.pid}`,
      argv: {
        query,
        param
      },
      page: {
        type: 'projects',
        layout: '[pid]',
        data: await this.projectsService.getProject(param.pid),
      }
    };
  }

  // 页面详情页
  @Get(":path")
  @Render(`${theme}/pages/[path]`)
  async page(@Param() param, @Query() query) {
    return {
      ...await this.baseProps(),
      path: `/${param.path}`,
      argv: {
        query,
        param
      },
      page: {
        type: 'pages',
        layout: '[path]',
        data: await this.pageService.findOne(param.path),
      },
        
    };
  }
  
  // 动态路由 
  @Get(":path/:props") // 若超出原已约定的全部path，则意味着页面不存在，可以返回 404 页面
  async dynamic (
    @Param() param,
    @Query() query,
    @Res() res,
  ) {
    if (fs.existsSync(path.join(argv.length ? __dirname : __dirname.replace("modules/engine", ""), `views/${theme}`, param.path, param.props ? param.props : 'index' + '.ejs'))) {
      return res.render(`${theme}/${param.path}/${param.props}`, {
        ...await this.baseProps(),
        path: `${param.path}/${param.props}`,
        argv: {
          param,
          query,
        },
        page: {
          type: param.path,
          layout: param.path,
        }
      }, function(err: any) {
        if (err) {
          Logger.error(err, EngineController.name);
        }
      })
    } else {
      return res.render(`${theme}/404`, {
        ...await this.baseProps(),
        path: `${param.path}/${param.props}`,
        argv: {
          param,
          query,
        },
        page: {
          type: '404',
          layout: '404',
        }
      }, function(err: any) {
        if (err) {
          Logger.error(err, EngineController.name);
        }
      })
    }
  }


}
