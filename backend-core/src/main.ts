import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connectMongo } from './database/mongo/mongo-connection';

async function bootstrap() {
  await connectMongo();
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();