#!env node
// register global
import { register } from '@shared/global/index.global';
import { registerStdLogger } from '~/shared/global/consola.global';

async function main() {
  register();
  registerStdLogger("core")
  const [{ bootstrap }] = await Promise.all([import('./bootstrap')]);
  bootstrap();
}

main();
