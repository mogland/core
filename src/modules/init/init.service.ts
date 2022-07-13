import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class InitService {
  private logger = new Logger(InitService.name)
  constructor(private readonly userService: UserService) {}

  async isInit() {
    return this.userService.hasMaster();
  }
}
