import { Test, TestingModule } from '@nestjs/testing';
import { InitController } from '~/modules/init/init.controller';
import { beforeEach, describe, expect, it } from 'vitest'

describe('InitController', () => {
  let controller: InitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InitController],
    }).compile();

    controller = module.get<InitController>(InitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
