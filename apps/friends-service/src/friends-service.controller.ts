import { Controller } from '@nestjs/common';
import { FriendsService } from './friends-service.service';

@Controller()
export class FriendsServiceController {
  constructor(private readonly friendsService: FriendsService) {}
}
