import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as responseTime from 'response-time';
import { TabtExceptionsFilter } from './common/filter/tabt-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('TabT Rest')
    .setDescription('This api is a bridge to the TabT SOAP API. It contacts TabT and cache results in order to reduce latency for some requests. More documentation will come.')
    .setVersion('1.0')
    .addTag('Seasons')
    .addTag('Clubs')
    .addTag('Members')
    .addTag('Matches')
    .addTag('Divisions')
    .addTag('Tournaments')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  app.use(compression());
  app.use(helmet());
  app.use(responseTime());

  app.useGlobalFilters(new TabtExceptionsFilter());

  await app.listen(3000);
}

bootstrap();
