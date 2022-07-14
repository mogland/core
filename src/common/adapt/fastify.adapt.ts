import { FastifyAdapter } from "@nestjs/platform-fastify";

const app: FastifyAdapter = new FastifyAdapter({
  trustProxy: true,
});
export { app as fastifyApp };

app.getInstance().addHook("onRequest", (request, reply, done) => {
  // set undefined origin
  const origin = request.headers.origin;
  if (!origin) {
    request.headers.origin = request.headers.host;
  }

  // forbidden php

  const url = request.url;

  if (url.endsWith(".php")) {
    reply.raw.statusMessage = "PHP是世界上最好的语言! 但我不配用它!";

    return reply.code(418).send();
  } else if (url.match(/\/(adminer|admin|wp-login)$/g)) {
    reply.raw.statusMessage = "哈哈，看看是谁在搞渗透！";
    return reply.code(200).send();
  }

  // skip favicon request
  if (url.match(/favicon.ico$/) || url.match(/manifest.json$/)) {
    return reply.code(204).send();
  }

  done();
});
