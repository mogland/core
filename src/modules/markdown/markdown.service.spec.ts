import { Test, TestingModule } from '@nestjs/testing';
import { MarkdownService } from './markdown.service';

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
