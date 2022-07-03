import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, expect,describe, it } from 'vitest';
import { PageService } from '~/modules/page/page.service';


describe('PageService', () => {
  let service: PageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PageService],
    }).compile();

    service = module.get<PageService>(PageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
