import slugify from 'slugify';
import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { ApiOperation } from '@nestjs/swagger';
import { PageEvents, PostEvents } from '~/shared/constants/event.constant';
import { PagerDto } from '~/shared/dto/pager.dto';

import { CategoryService } from './category.service';
import { PostModel } from './model/post.model';
import { PostService } from './post-service.service';
import { PageService } from './page-service.service';
import { PageModel, PartialPageModel } from './model/page.model';
import { MongoIdDto } from '~/shared/dto/id.dto';

@Controller()
export class PageServiceController {
  constructor(
    private readonly pageService: PageService,
    private readonly postService: PostService,
    private readonly categoryService: CategoryService,
  ) {}

  // ==================== Category ====================

  // ====================== Page ======================

  @MessagePattern(PageEvents.PageGetAll)
  @ApiOperation({ summary: '获取页面列表' })
  async getPagesSummary(query: PagerDto) {
    return this.pageService.getPaginate(query);
  }

  @MessagePattern(PageEvents.PageGetByIdWithMaster)
  @ApiOperation({ summary: '通过 id 获取页面' })
  async getPage(params: { id: string }) {
    return this.pageService.getPageById(params.id);
  }

  @MessagePattern(PageEvents.PageGet)
  @ApiOperation({ summary: '通过 slug 获取页面' })
  async getPageBySlug(params: {
    slug: string;
    password?: string;
    isMaster?: boolean;
  }) {
    return this.pageService.getPageBySlug(
      params.slug,
      params.password,
      params.isMaster,
    );
  }

  @MessagePattern(PageEvents.PageCreate)
  @ApiOperation({ summary: '创建页面' })
  async createPage(page: PageModel) {
    const slug = page.slug ? slugify(page.slug) : slugify(page.title);
    Object.assign(page, { slug });
    return this.pageService.create(page);
  }

  @MessagePattern(PageEvents.PagePatch)
  @ApiOperation({ summary: '更新页面' })
  async patch(input: { body: PartialPageModel; params: MongoIdDto }) {
    return await this.pageService.updateById(input.params.id, input.body);
  }

  // ==================== Post ====================

  @MessagePattern({ cmd: PostEvents.PostsListGet })
  @ApiOperation({ summary: '获取文章列表(附带分页器)' })
  async getPaginate(input: { query: PagerDto; isMaster: boolean }) {
    return this.postService.aggregatePaginate(input.query, input.isMaster);
  }

  @MessagePattern({ cmd: PostEvents.PostGetByMaster })
  @ApiOperation({ summary: '通过id获取文章详情(带权限)' })
  async getPost(params: { slug: string }) {
    return this.postService.getPostBySlug(params.slug);
  }

  @MessagePattern({ cmd: PostEvents.PostGet })
  @ApiOperation({ summary: '根据分类名与自定义别名获取文章详情' })
  async getPostByCategoryAndSlug(params: {
    category: string;
    slug: string;
    password?: string;
    isMaster?: boolean;
  }) {
    return this.postService.getPostByCategoryAndSlug(
      params.category,
      params.slug,
      params.password,
      params.isMaster,
    );
  }

  @MessagePattern({ cmd: PostEvents.PostCreate })
  @ApiOperation({ summary: '创建文章' })
  async createPost(post: PostModel) {
    const slug = post.slug ? slugify(post.slug) : slugify(post.title);
    Object.assign(post, { slug });
    return this.postService.createPost(post);
  }

  @MessagePattern({ cmd: PostEvents.PostPatch })
  @ApiOperation({ summary: '更新文章' })
  async patchPost(input: { id: string; post: PostModel }) {
    const slug = input.post.slug
      ? slugify(input.post.slug)
      : slugify(input.post.title);
    Object.assign(input.post, { slug });
    return this.postService.updatePostById(input.id, input.post);
  }

  @MessagePattern({ cmd: PostEvents.PostDelete })
  @ApiOperation({ summary: '删除文章' })
  async deletePost(id: string) {
    return this.postService.deletePostById(id);
  }

  @MessagePattern({ cmd: PostEvents.PostThumbUp })
  @ApiOperation({ summary: '点赞文章' })
  async thumbUpPost(_id: string) {
    throw new RpcException({
      code: HttpStatus.NOT_IMPLEMENTED,
      message: 'Not Implemented',
    });
  }
}
