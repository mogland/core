import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ServicesEnum } from '~/shared/constants/services.constant';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(ServicesEnum.category) private readonly category: ClientProxy,
  ) {}
}
