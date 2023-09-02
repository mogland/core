/*
 * @FilePath: /nx-core/apps/core/src/modules/auth/auth.controller.ts
 * @author: Wibus
 * @Date: 2022-09-04 14:35:45
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-04 14:38:56
 * Coding With IU
 */
import { isMongoId } from 'class-validator';

import {
  Body,
  Delete,
  Get,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthService } from '~/libs/auth/src';
import { Auth } from '~/shared/common/decorator/auth.decorator';
import { ApiName } from '~/shared/common/decorator/openapi.decorator';
import { TokenDto } from './auth.dto';
import { ApiController } from '~/shared/common/decorator/api-controller.decorator';

@ApiController({
  path: 'auth',
})
@ApiName
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get('token')
  @Auth()
  async getOrVerifyToken(
    @Query('token') token?: string,
    @Query('id') id?: string,
  ) {
    if (typeof token === 'string') {
      return await this.authService
        .verifyCustomToken(token)
        .then(([isValid]) => isValid);
    }
    if (id && typeof id === 'string' && isMongoId(id)) {
      return await this.authService.getTokenSecret(id);
    }
    return await this.authService.getAllAccessToken();
  }

  @Post('token')
  @Auth()
  async generateToken(@Body() body: TokenDto): Promise<{
    expired: Date | undefined;
    token: string;
    name: string;
  }> {
    const { expired, name } = body;
    const token = await this.authService.generateAccessToken();
    const model = {
      expired,
      token,
      name,
    };
    await this.authService.saveToken(model);
    return model;
  }
  @Delete('token')
  @Auth()
  async deleteToken(@Query('id') id: string) {
    const token = await this.authService
      .getAllAccessToken()
      .then((models) =>
        models.find((model) => {
          return (model as any).id === id;
        }),
      )
      .then((model) => {
        return model?.token;
      });

    if (!token) {
      throw new NotFoundException(`token ${id} is not found`);
    }
    await this.authService.deleteToken(id);
    return 'OK';
  }
}
