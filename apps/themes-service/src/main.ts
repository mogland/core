import { NestFactory } from '@nestjs/core';
import { ThemesServiceModule } from './themes-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ThemesServiceModule);
  await app.listen(3000);
}
bootstrap();
