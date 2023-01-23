import { FastifyAdapter } from '@nestjs/platform-fastify';

const app: FastifyAdapter = new FastifyAdapter({
  trustProxy: true,
});
export { app as fastifyApp };
