import { Global, Module, Provider } from '@nestjs/common';
import { UserModel } from '~/apps/user-service/src/user.model';
import { ConfigModel } from '~/libs/config/src/config.model';
import { databaseProvider } from './database.provider';
import { DatabaseService } from './database.service';
import { getProviderByTypegooseClass } from './model.transformer';

const models = [UserModel, ConfigModel].map((model) =>
  getProviderByTypegooseClass(model),
);

const providers: Provider[] = [DatabaseService, databaseProvider, ...models];

@Global()
@Module({
  providers,
  exports: providers,
})
export class DatabaseModule {}
