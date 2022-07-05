import { CorrelationIdMiddleware } from '@app/common/middlewares'
import { MainModule } from '@app/main.module'
import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory, Reflector } from '@nestjs/core'
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino'

async function bootstrap() {
  const app = await NestFactory.create(MainModule, { bufferLogs: true })
  app.use(app.get(CorrelationIdMiddleware).use)
  app.useLogger(app.get(Logger))
  app.useGlobalInterceptors(new LoggerErrorInterceptor())
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
  app.useGlobalPipes(
    new ValidationPipe({
      validationError: { target: true, value: true },
      whitelist: true,
      forbidUnknownValues: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  )
  app.enableVersioning({
    type: VersioningType.URI
  })
  const configService = app.get(ConfigService)
  const config = new DocumentBuilder()
    .setTitle(configService.get<string>('app.name'))
    .setDescription(configService.get<string>('app.description'))
    .setVersion(configService.get<string>('app.version'))
    .build()
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => `${controllerKey}.${methodKey}`
  }
  const document = SwaggerModule.createDocument(app, config, options)
  SwaggerModule.setup('docs', app, document)
  app.use(helmet())
  app.enableCors()
  app.enableShutdownHooks()
  await app.listen(configService.get<number>('app.port') ?? 3000)
}
bootstrap()
  .then(() => true)
  .catch((err) => console.error(err))
