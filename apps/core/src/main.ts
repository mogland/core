#!env node
// register global
import { mkBasedirs, register } from '@shared/global/index.global';
import { registerStdLogger } from '~/shared/global/consola.global';

async function main() {
  register();
  mkBasedirs();
  registerStdLogger("core")
  const [{ bootstrap }] = await Promise.all([import('./bootstrap')]);
  bootstrap();
}

main();
