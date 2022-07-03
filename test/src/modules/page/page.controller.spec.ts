import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, expect,describe, it } from 'vitest';
import { PageController } from '~/modules/page/page.controller';


describe('PageController', () => {
  let controller: PageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PageController],
    }).compile();

    controller = module.get<PageController>(PageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
