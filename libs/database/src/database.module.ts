import { Global, Module, Provider } from '@nestjs/common';
import { databaseProvider } from './database.provider';
import { DatabaseService } from './database.service';
import { getProviderByTypegooseClass } from './model.transformer';

const models = [

].map((model) => getProviderByTypegooseClass(model));

const providers: Provider[] = [DatabaseService, databaseProvider, ...models];

@Global()
@Module({
  providers,
  exports: providers,
})
export class DatabaseModule {}