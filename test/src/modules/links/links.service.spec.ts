import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, expect,describe, it } from 'vitest';
import { LinksService } from '~/modules/links/links.service';

describe('LinksService', () => {
  let service: LinksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LinksService],
    }).compile();

    service = module.get<LinksService>(LinksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
