import { ApiTags } from '@nestjs/swagger';

export const ApiName: ClassDecorator = (target) => {
  // @ts-ignore
  if (!isDev) {
    return;
  }
  const [name] = target.name.split('Controller');
  ApiTags(`${name} Routes`).call(null, target);
};
