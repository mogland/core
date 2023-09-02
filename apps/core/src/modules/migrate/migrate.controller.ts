import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { MigrateService } from './migrate.service';
import { MigrateData } from './migrate.interface';
import { ApiName } from '~/shared/common/decorator/openapi.decorator';
import { Auth } from '~/shared/common/decorator/auth.decorator';
import { CategoryModel } from '~/apps/page-service/src/model/category.model';

@Controller('migrate')
@ApiName
export class MigrateController {
  constructor(private readonly migrateService: MigrateService) {}

  @Post('import')
  @Auth()
  @ApiOperation({ summary: '使用 JSON 导入数据' })
  async import(@Body() body: MigrateData): Promise<{
    user: any;
    friends: any;
    pages: any;
    categories: never[] | CategoryModel[];
    posts: any;
    comments:
      | never[]
      | {
          postError: string[];
          parentError: string[];
        };
  }> {
    return await this.migrateService.import(body);
  }

  @Get('export')
  @Auth()
  @ApiOperation({ summary: '导出数据为 JSON' })
  async export(): Promise<any> {
    return await this.migrateService.export();
  }
}
