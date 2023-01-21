import { Controller, Get } from '@nestjs/common';

@Controller('console')
export class ConsoleController {
  constructor() {}

  @Get('/*')
  console() {}
}
