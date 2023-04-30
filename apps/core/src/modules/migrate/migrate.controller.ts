import { Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Auth } from '~/shared/common/decorator/auth.decorator';
import { MigrateService } from './migrate.service';

@Controller('migrate')
export class MigrateController {
  constructor(
    private readonly migrateService: MigrateService,
  ){}

  @Post("import")
  @Auth()
  @ApiOperation({ summary: "使用 JSON 导入数据"})
  async import() {}
}
