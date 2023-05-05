import { Module } from '@nestjs/common';
import { MigrateController } from './migrate.controller';
import { MigrateService } from './migrate.service';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { REDIS_TRANSPORTER } from '~/shared/constants/transporter.constants';
import { ClientsModule } from '@nestjs/microservices';

const services = {
  [ServicesEnum.page]: ServicesEnum.page,
  [ServicesEnum.user]: ServicesEnum.user,
  [ServicesEnum.friends]: ServicesEnum.friends,
  [ServicesEnum.comments]: ServicesEnum.comments,
};

const registers = Object.values(services).map((name) => ({
  name,
  ...REDIS_TRANSPORTER,
}));

@Module({
  imports: [ClientsModule.register(registers)],
  controllers: [MigrateController],
  providers: [MigrateService],
})
export class MigrateModule {}
