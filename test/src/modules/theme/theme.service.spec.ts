import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, expect, describe, it } from "vitest";
import { ThemeService } from '~/modules/theme/theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThemeService],
    }).compile();

    service = module.get<ThemeService>(ThemeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
