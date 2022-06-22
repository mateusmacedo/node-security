import { TraceService } from '@metinseylan/nestjs-opentelemetry'
import { ConfigService } from '@nestjs/config'
import { IncomingMessage } from 'http'
import pino from 'pino'

export const loggerFactory = async (configService: ConfigService, traceService: TraceService) => {
  const loggerOptions: pino.LoggerOptions = {
    level: 'info',
    formatters: {
      level(label) {
        return { level: label }
      },
      log(object) {
        const span = traceService.getSpan()
        if (!span) return { ...object }
        const { spanId, traceId } = span.spanContext()
        return { object, spanId, traceId }
      }
    }
  }
  const logger: pino.Logger = pino(loggerOptions).child({
    appName: configService.get('app.name'),
    appVersion: configService.get('app.version')
  })
  return {
    pinoHttp: {
      logger: logger,
      enabled: configService.get<boolean>('logger.enabled'),
      level: configService.get<string>('logger.level'),
      autoLogging: configService.get<boolean>('logger.autoLogging'),
      genReqId: function (req: IncomingMessage) {
        return req.headers['x-correlation-id']
      },
      quietReqLogger: configService.get<boolean>('logger.quietReqLogger'),
      stream: pino.destination({
        minLength: configService.get<number>('logger.minLength'),
        sync: false
      })
    }
  }
}
