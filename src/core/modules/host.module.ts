import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HostController } from 'src/host/host.controller';
import { HostService } from 'src/core/services/host.service';
import { hostProviders } from 'src/core/providers/host.providers';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [HostController],
  providers: [...hostProviders, HostService],
})
export class HostModule {}