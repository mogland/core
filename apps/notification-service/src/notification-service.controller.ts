import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { CommentsModel } from '~/apps/comments-service/src/comments.model';
import {
  FriendsModel,
  FriendStatus,
} from '~/apps/friends-service/src/friends.model';
import { PageModel } from '~/apps/page-service/src/model/page.model';
import { PostModel } from '~/apps/page-service/src/model/post.model';
import { LoginDto } from '~/apps/user-service/src/user.dto';
import { IpRecord } from '~/shared/common/decorator/ip.decorator';
import {
  NotificationEvents,
  UserEvents,
} from '~/shared/constants/event.constant';
import { NotificationService } from './notification-service.service';

@Controller()
export class NotificationServiceController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern({ cmd: NotificationEvents.Ping })
  ping() {
    return 'pong';
  }

  @EventPattern(NotificationEvents.SystemUserLogin)
  async userLogin(input: { dto: LoginDto; ipLocation: IpRecord }) {
    console.log('用户尝试登陆', input.dto.username);
    this.notificationService.sendEvent(UserEvents.UserLogin, input);
  }

  @EventPattern(NotificationEvents.SystemCatchError)
  async systemCatchError(input: {
    exception: unknown;
    url: string;
    message: any;
  }) {
    console.log('系统捕获到错误', input.message);
    this.notificationService.sendEvent(
      NotificationEvents.SystemCatchError,
      input,
    );
  }

  @EventPattern(NotificationEvents.SystemCommentCreate)
  async systemCommentCreate(input: { data: CommentsModel; isMaster: boolean }) {
    console.log('评论创建 isMaster: ', input.isMaster);
  }

  @EventPattern(NotificationEvents.SystemCommentReply)
  async systemCommentReply(input: {
    origin: CommentsModel;
    data: CommentsModel;
    isMaster: boolean;
  }) {
    console.log('评论回复 isMaster: ', input.isMaster);
  }

  @EventPattern(NotificationEvents.SystemFriendCreate)
  async systemFriendCreate(input: {
    data: FriendsModel;
    isMaster: boolean;
    autoCheck: boolean;
  }) {
    console.log(
      '好友创建 name: ',
      input.data.name,
      '自动审核: ',
      input.autoCheck,
    );
  }

  @EventPattern(NotificationEvents.SystemFriendUpdateByToken)
  async systemFriendUpdateByToken(input: {
    data: FriendsModel;
    autoCheck: boolean;
  }) {
    console.log(
      '好友使用 token 更新了',
      input.data.name,
      '自动审核: ',
      input.autoCheck,
    );
  }

  @EventPattern(NotificationEvents.SystemFriendPatchStatus)
  async systemFriendPatchStatus(input: {
    data: FriendsModel;
    status: FriendStatus;
  }) {
    console.log('好友更新状态', input.data.name, '状态: ', input.status);
  }

  @EventPattern(NotificationEvents.SystemFriendDeleteByMasterOrToken)
  async systemFriendDeleteByMasterOrToken(input: {
    id: string;
    isMaster: boolean;
    token?: string;
  }) {
    if (input.isMaster) {
      console.log('好友被主人删除', input.id);
    }
    if (input.token) {
      console.log('好友使用 token 删除了本站友链', input.id);
    }
  }

  @EventPattern(NotificationEvents.SystemPostCreate)
  async systemPostCreate(data: PostModel) {
    console.log('创建了一篇文章：', data.title);
  }

  @EventPattern(NotificationEvents.SystemPostUpdate)
  async systemPostUpdate(data: PostModel) {
    console.log('更新了一篇文章：', data.title);
  }

  @EventPattern(NotificationEvents.SystemPageCreate)
  async systemPageCreate(data: PageModel) {
    console.log('创建了一个页面：', data.title);
  }

  @EventPattern(NotificationEvents.SystemPageUpdate)
  async systemPageUpdate(data: PageModel) {
    console.log('更新了一个页面：', data.title);
  }
}
