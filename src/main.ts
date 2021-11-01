import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(
        AppModule
        //{ // Enable specific log levels
        //  logger: ['error', 'warn', 'debug']
        //}
    );
    app.useGlobalPipes(new ValidationPipe()); // Use this option if you want walidate all the input params in all requests
    await app.listen(3000);
}
bootstrap();
