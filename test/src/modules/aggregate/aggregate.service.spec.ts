import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, expect,describe, it } from 'vitest';
import { AggregateService } from '~/modules/aggregate/aggregate.service';


describe('AggregateService', () => {
  let service: AggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AggregateService],
    }).compile();

    service = module.get<AggregateService>(AggregateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
