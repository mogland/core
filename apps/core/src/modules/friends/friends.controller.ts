import { Controller } from '@nestjs/common';
import { ApiName } from '~/shared/common/decorator/openapi.decorator';

@Controller('friends')
@ApiName
export class FriendsController {}
