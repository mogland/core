import { Module } from '@nestjs/common';
import { AggregateService } from './aggregate.service';
import { AggregateController } from './aggregate.controller';

@Module({
  providers: [AggregateService],
  controllers: [AggregateController]
})
export class AggregateModule {}
