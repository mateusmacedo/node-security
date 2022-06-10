import { loggerFactory } from '@app/common/factories/logger.factory'
import { createMock } from '@golevelup/nestjs-testing'
import { ConfigService } from '@nestjs/config'
import { Context, context, Span, trace } from '@opentelemetry/api'
import { IncomingMessage } from 'http'

describe('LoggerFactory', () => {
  let configService: ConfigService
  let object: Record<string, string>
  beforeEach(async () => {
    jest.clearAllMocks()
    configService = createMock<ConfigService>({
      get: jest
        .fn()
        .mockReturnValueOnce('app.name')
        .mockReturnValueOnce('app.version')
        .mockReturnValueOnce(false)
        .mockReturnValueOnce('info')
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(128)
    })
    object = {
      dummy: 'dummy'
    }
  })

  it('should be defined', () => {
    expect(loggerFactory).toBeDefined()
  })
  describe('execution', () => {
    it('should log with spanId and traceId', async () => {
      const contextSpy = jest.spyOn(context, 'active').mockReturnValue(createMock<Context>())
      const spanMock = createMock<Span>({
        spanContext: () => ({
          spanId: 'spanId',
          traceId: 'traceId'
        })
      })
      const traceSpy = jest.spyOn(trace, 'getSpan').mockReturnValue(spanMock)
      const result = await loggerFactory(configService)
      const logSpy = jest.spyOn(result.pinoHttp.logger, 'info')
      const incomingMessage = createMock<IncomingMessage>({
        headers: {
          'x-correlation-id': '123'
        }
      })
      const genReqId = result.pinoHttp.genReqId(incomingMessage)
      result.pinoHttp.logger.info(object)
      expect(result).toBeDefined()
      expect(genReqId).toBe('123')
      expect(logSpy).toHaveBeenCalledWith(object)
      expect(contextSpy).toHaveBeenCalledTimes(1)
      expect(traceSpy).toHaveBeenCalledTimes(1)
      expect(spanMock.spanContext).toHaveBeenCalledTimes(1)
    })
    it('should log without spanId and traceId', async () => {
      const traceSpy = jest.spyOn(trace, 'getSpan').mockReturnValue(undefined)
      const result = await loggerFactory(configService)
      const logSpy = jest.spyOn(result.pinoHttp.logger, 'info')
      const incomingMessage = createMock<IncomingMessage>({
        headers: {
          'x-correlation-id': '123'
        }
      })
      const genReqId = result.pinoHttp.genReqId(incomingMessage)
      result.pinoHttp.logger.info(object)
      expect(result).toBeDefined()
      expect(genReqId).toBe('123')
      expect(logSpy).toHaveBeenCalledWith(object)
      expect(traceSpy).toHaveBeenCalledTimes(1)
    })
  })
})
