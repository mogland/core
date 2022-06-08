import { Controller } from '@nestjs/common';
import { ApiName } from '~/common/decorator/openapi.decorator';

@Controller('Category')
@ApiName
export class CategoryController {}
