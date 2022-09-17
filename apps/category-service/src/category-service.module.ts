import { Module } from '@nestjs/common';
import { AuthModule } from '~/libs/auth/src';
import { DatabaseModule } from '~/libs/database/src';
import { CategoryServiceController } from './category-service.controller';
import { CategoryService } from './category-service.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [CategoryServiceController],
  providers: [CategoryService],
})
export class CategoryServiceModule {}
