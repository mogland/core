import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { MigrateService } from './migrate.service';
import { MigrateData } from './migrate.interface';
import { ApiName } from '~/shared/common/decorator/openapi.decorator';

@Controller('migrate')
@ApiName
export class MigrateController {
  constructor(private readonly migrateService: MigrateService) {}

  @Post('import')
  // @Auth()
  @ApiOperation({ summary: '使用 JSON 导入数据' })
  async import(@Body() body: MigrateData) {
    return await this.migrateService.import(body);
  }

  @Get('export')
  // @Auth()
  @ApiOperation({ summary: '导出数据为 JSON' })
  async export() {
    return await this.migrateService.export();
  }
}
