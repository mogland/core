import { Controller, Get, Inject, Req, Res } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ConsoleService } from './console.service';

@Controller('console')
export class ConsoleController {
  constructor(
    @Inject(ConsoleService)
    private readonly consoleService: ConsoleService,
  ) {}

  @Get('/refresh')
  async refresh() {
    this.consoleService.refreshConsoleVersionCache();
    return true;
  }

  @Get(['/*', '/'])
  async console(@Res() res: FastifyReply, @Req() req: FastifyRequest) {
    const path = req.url
      .replace('/console', '')
      .split('/')
      .pop()
      ?.split('?')[0]
      .replace(/\/$/, '');
    const file = await this.consoleService.transformPathToFile(
      path,
      req.headers.origin as string,
    );
    const contentType =
      file?.type === 'js'
        ? 'application/javascript'
        : file?.type === 'css'
        ? 'text/css'
        : file?.type === 'html'
        ? 'text/html'
        : 'text/plain';
    if (file) {
      res.header('Content-Type', contentType);
      res.send(file.data);
    }
    res.send('console');
  }
}
