#!env node
// register global
import { register } from '@shared/global/index.global';

async function main() {
  register();
  const [{ bootstrap }] = await Promise.all([import('./bootstrap')]);
  bootstrap();
}

main();
