import { Global, Module } from '@nestjs/common';
import { HelperModule } from '~/libs/helper/src';
import { AuthService } from './auth.service';

@Global()
@Module({
  imports: [HelperModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
