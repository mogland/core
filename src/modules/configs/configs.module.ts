import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configs } from '../../shared/entities/configs.entity';
import { ConfigsController } from './configs.controller';
import { ConfigsService } from './configs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Configs])
  ],
  providers: [ConfigsService],
  controllers: [ConfigsController],
  exports: [TypeOrmModule],
})
export class ConfigsModule {}
