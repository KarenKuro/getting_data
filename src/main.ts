import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { IValidationErrors } from '@common/models';
import { ResponseManager } from '@common/helpers';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const PORT = process.env.PORT;
console.log(PORT);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.disable('x-powered-by');

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      stopAtFirstError: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const errorResponse: IValidationErrors[] = [];
        errors.forEach((e) => {
          if (e.constraints) {
            errorResponse.push(...ResponseManager.validationHandler([e]));
          }
          if (e.children) {
            errorResponse.push(
              ...ResponseManager.validationHandler(
                e.children,
                e.property?.toLowerCase(),
              ),
            );
          }
        });
        throw ResponseManager.buildError(
          { errors: errorResponse, message: 'ValidationError' },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      },
    }),
  );

  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Getting data APIs')
      .setDescription('The Getting data API description')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(PORT, () => {
    console.log(`API: ${PORT}`);
  });
}

bootstrap();
