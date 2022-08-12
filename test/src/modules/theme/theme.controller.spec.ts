import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, expect, describe, it } from "vitest";
import { ThemeController } from '~/modules/theme/theme.controller';

describe('ThemeController', () => {
  let controller: ThemeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThemeController],
    }).compile();

    controller = module.get<ThemeController>(ThemeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
