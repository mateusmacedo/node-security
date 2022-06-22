import { loggerFactory } from '@app/common/factories/logger.factory'
import { createMock } from '@golevelup/nestjs-testing'
import { TraceService } from '@metinseylan/nestjs-opentelemetry'
import { ConfigService } from '@nestjs/config'
import { Span } from '@opentelemetry/sdk-trace-base'
import { IncomingMessage } from 'http'

process.env.NODE_ENV = 'logExecution'
describe('LoggerFactory', () => {
  let configService: ConfigService
  let traceService: TraceService
  let object: Record<string, string>
  afterAll(() => {
    process.env.NODE_ENV = 'test'
  })
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
    traceService = createMock<TraceService>({
      getSpan: jest.fn().mockReturnValue(
        createMock<Span>({
          spanContext: jest.fn().mockReturnValue({
            spanId: 'spanId',
            traceId: 'traceId'
          })
        })
      )
    })
    object = {
      dummy: 'dummy'
    }
  })

  it('should be defined', async () => {
    expect(await loggerFactory(configService, traceService)).toBeDefined()
  })
  describe('execution', () => {
    it('should log with spanId and traceId', async () => {
      const result = await loggerFactory(configService, traceService)
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
    })
    it('should log without spanId and traceId', async () => {
      traceService.getSpan = jest.fn().mockReturnValue(undefined)
      const result = await loggerFactory(configService, traceService)
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
    })
  })
})
