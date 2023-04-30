import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Auth } from '~/shared/common/decorator/auth.decorator';
import { MigrateService } from './migrate.service';
import { MigrateData } from './migrate.interface';

@Controller('migrate')
export class MigrateController {
  constructor(
    private readonly migrateService: MigrateService,
  ){}

  @Post("import")
  @Auth()
  @ApiOperation({ summary: "使用 JSON 导入数据"})
  async import(@Body() body: MigrateData) {
    return await this.migrateService.import(body);
  }

  @Get("export")
  @Auth()
  @ApiOperation({ summary: "导出数据为 JSON"})
  async export() {
    return await this.migrateService.export();
  }
}
