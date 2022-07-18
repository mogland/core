import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from "vitest";
import { MarkdownService } from '~/modules/markdown/markdown.service';

describe('MarkdownService', () => {
  let service: MarkdownService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarkdownService],
    }).compile();

    service = module.get<MarkdownService>(MarkdownService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
