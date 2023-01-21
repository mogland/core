import { RedisOptions, Transport } from '@nestjs/microservices';
import { REDIS } from '~/apps/core/src/app.config';

export const REDIS_TRANSPORTER: RedisOptions = {
  transport: Transport.REDIS,
  options: {
    port: REDIS.port,
    host: REDIS.host,
    password: REDIS.password,
    username: REDIS.user,
  },
};
