import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './helper/global-exception.filter';
import { ResponseInterceptor } from './helper/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Setup Global Validation Pipe & Formatting
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Hapus payload properti yang tidak ada di DTO
    forbidNonWhitelisted: true, // Error jika ada payload asing
    transform: true, // Otomatis cast payload berdasarkan tipe DTO
  }));

  app.enableCors(); // Aktifkan CORS (opsional namun esensial untuk frontend integrasi)
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
