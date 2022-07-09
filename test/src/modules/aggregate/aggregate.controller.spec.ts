import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, expect,describe, it } from 'vitest';
import { AggregateController } from '~/modules/aggregate/aggregate.controller';

describe('AggregateController', () => {
  let controller: AggregateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AggregateController],
    }).compile();

    controller = module.get<AggregateController>(AggregateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
