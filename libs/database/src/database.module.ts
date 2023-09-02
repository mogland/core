import { Global, Module, Provider } from '@nestjs/common';
import { CommentsModel } from '~/apps/comments-service/src/comments.model';
import { FriendsModel } from '~/apps/friends-service/src/friends.model';
import { CategoryModel } from '~/apps/page-service/src/model/category.model';
import { PageModel } from '~/apps/page-service/src/model/page.model';
import { PostModel } from '~/apps/page-service/src/model/post.model';
import { UserModel } from '~/apps/user-service/src/user.model';
import { ConfigModel } from '~/apps/config-service/src/config.model';
import { databaseProvider } from './database.provider';
import { DatabaseService } from './database.service';
import { getProviderByTypegooseClass } from './model.transformer';

const models = [
  UserModel,
  ConfigModel,
  PostModel,
  PageModel,
  CategoryModel,
  CommentsModel,
  FriendsModel,
].map((model) => getProviderByTypegooseClass(model));

const providers: Provider[] = [DatabaseService, databaseProvider, ...models];

@Global()
@Module({
  providers,
  exports: providers,
})
export class DatabaseModule {}
