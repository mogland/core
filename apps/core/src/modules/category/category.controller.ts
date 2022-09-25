/*
 * @FilePath: /mog-core/apps/core/src/modules/category/category.controller.ts
 * @author: Wibus
 * @Date: 2022-09-24 15:53:29
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-25 15:35:14
 * Coding With IU
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBody, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { timeout, catchError, throwError } from 'rxjs';
import {
  MultiCategoriesQueryDto,
  MultiQueryTagAndCategoryDto,
  SlugorIdDto,
} from '~/apps/page-service/src/dto/category.dto';
import {
  CategoryModel,
  CategoryType,
  PartialCategoryModel,
} from '~/apps/page-service/src/model/category.model';
import { Auth } from '~/shared/common/decorator/auth.decorator';
import { ApiName } from '~/shared/common/decorator/openapi.decorator';
import { CategoryEvents } from '~/shared/constants/event.constant';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { MongoIdDto } from '~/shared/dto/id.dto';

@Controller('category')
@ApiName
export class CategoryController {
  constructor(
    @Inject(ServicesEnum.category) private readonly category: ClientProxy,
  ) {}

  @Get('/')
  @ApiOperation({ summary: '多分类查询、分类列表' })
  async getCategories(@Query() query: MultiCategoriesQueryDto) {
    return this.category
      .send({ cmd: CategoryEvents.CategoryGetAll }, query)
      .pipe(
        timeout(1000),
        catchError((err) => {
          return throwError(
            () =>
              new HttpException(
                err.message || '未知错误，请联系管理员',
                err.status || 500,
              ),
          );
        }),
      );
  }

  @Get('/:query')
  @ApiOperation({ summary: '根据分类id或者标签名查询分类' })
  @ApiParam({
    name: 'query',
    type: 'string',
    required: true,
    description:
      '如果这个是标签，则query为标签名，如果是分类，则query为分类id或分类名',
  })
  @ApiQuery({
    // 查询参数
    name: 'tag', // 参数名
    type: 'boolean', // 参数类型
    description: '选择分类 或 标签云查询',
    enum: ['true', 'false'], // 可选值
    required: false, // 是否必填
  })
  async getCategoryByCategoryIdOrTag(
    @Param() { query }: SlugorIdDto,
    @Query() { tag }: MultiQueryTagAndCategoryDto, // 如果这个是标签，则tag为true，如果是分类，则tag为分类id
  ) {
    return this.category
      .send({ cmd: CategoryEvents.CategoryGet }, { query, tag })
      .pipe(
        timeout(1000),
        catchError((err) => {
          return throwError(
            () =>
              new HttpException(
                err.message || '未知错误，请联系管理员',
                err.status || 500,
              ),
          );
        }),
      );
  }

  @Post('/')
  @ApiOperation({ summary: '创建分类' })
  @Auth()
  @ApiBody({ type: CategoryModel })
  async createCategory(@Body() query: CategoryModel) {
    return this.category
      .send({ cmd: CategoryEvents.CategoryCreate }, query)
      .pipe(
        timeout(1000),
        catchError((err) => {
          return throwError(
            () =>
              new HttpException(
                err.message || '未知错误，请联系管理员',
                err.status || 500,
              ),
          );
        }),
      );
  }

  @Post('/merge')
  @ApiOperation({ summary: '合并分类或标签 (Beta)' })
  @Auth()
  async merge(@Body() body: { type: CategoryType; from: string; to: string }) {
    return this.category.send({ cmd: CategoryEvents.CategoryMerge }, body).pipe(
      timeout(1000),
      catchError((err) => {
        return throwError(
          () =>
            new HttpException(
              err.message || '未知错误，请联系管理员',
              err.status || 500,
            ),
        );
      }),
    );
  }

  @Put('/:id')
  @ApiOperation({ summary: '更新分类' })
  @Auth()
  @ApiParam({ name: 'id', description: '分类id' })
  @ApiBody({ description: '分类信息', type: CategoryModel })
  async update(
    @Param() { id }: MongoIdDto,
    @Body() { type, slug, name }: CategoryModel,
  ) {
    const send = {
      _id: id,
      _data: { type, slug, name },
    };
    return this.category.send({ cmd: CategoryEvents.CategoryPatch }, send).pipe(
      timeout(1000),
      catchError((err) => {
        return throwError(
          () =>
            new HttpException(
              err.message || '未知错误，请联系管理员',
              err.status || 500,
            ),
        );
      }),
    );
  }

  @Patch('/:id')
  @ApiOperation({ summary: '更新分类' })
  @Auth()
  @HttpCode(204)
  async patch(@Param() params: MongoIdDto, @Body() body: PartialCategoryModel) {
    return this.category
      .send(
        { cmd: CategoryEvents.CategoryPatch },
        { _id: params.id, _data: body },
      )
      .pipe(
        timeout(1000),
        catchError((err) => {
          return throwError(
            () =>
              new HttpException(
                err.message || '未知错误，请联系管理员',
                err.status || 500,
              ),
          );
        }),
      );
  }

  @Delete('/:id')
  @ApiOperation({ summary: '删除分类' })
  @Auth()
  @ApiParam({ name: 'id', description: '分类id' })
  async deleteCategory(@Param() { id }: MongoIdDto) {
    return this.category.send({ cmd: CategoryEvents.CategoryDelete }, id).pipe(
      timeout(1000),
      catchError((err) => {
        return throwError(
          () =>
            new HttpException(
              err.message || '未知错误，请联系管理员',
              err.status || 500,
            ),
        );
      }),
    );
  }
}
