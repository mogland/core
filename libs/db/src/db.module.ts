import { Global, Module, Provider } from '@nestjs/common';
import { CategoryModel } from '~/modules/category/category.model';
import { ConfigsModel } from '~/modules/configs/configs.model';
import { PageModel } from '~/modules/page/page.model';
import { PostModel } from '~/modules/post/post.model';
import { UserModel } from '~/modules/user/user.model';
import { databaseProvider } from './db.provider';
import { DbService } from './db.service';
import { getProviderByTypegooseClass } from './model.transformer';


const models = [
  UserModel,
  PostModel,
  CategoryModel,
  ConfigsModel,
  PageModel
].map((model) =>
  getProviderByTypegooseClass(model),
)

const providers: Provider[] = [DbService, databaseProvider, ...models]

@Global()
@Module({
  providers,
  exports: providers,
})
export class DbModule {}
