import { HealthController } from '@app/common/controllers/health.controller'
import { HealthService } from '@app/common/services'
import { createMock } from '@golevelup/nestjs-testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { HealthCheckResult } from '@nestjs/terminus'
import { Test, TestingModule } from '@nestjs/testing'
import { LoggerModule, PinoLogger } from 'nestjs-pino'

describe('HealthController', () => {
  let sut: HealthController
  const mockHealthCheckResult: HealthCheckResult = {
    status: 'ok',
    details: {
      'health-indicator-1': {
        status: 'up'
      }
    }
  }
  const mockHealthService = createMock<HealthService>({
    performHealthCheck: jest.fn(async () => mockHealthCheckResult)
  })
  const mockConfigService = createMock<ConfigService>({
    get: jest.fn(() => 'test')
  })
  const mockLogger = createMock<PinoLogger>({
    info: jest.fn().mockReturnValue(undefined)
  })
  beforeEach(async () => {
    jest.clearAllMocks()
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot(), ConfigModule.forRoot()],
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: mockHealthService
        }
      ]
    })
      .overrideProvider(PinoLogger)
      .useValue(mockLogger)
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .compile()
    sut = module.get<HealthController>(HealthController)
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })
  describe('getHandle', () => {
    it('should call health service perform health check correctly', async () => {
      const performHealthCheckSpy = jest.spyOn(mockHealthService, 'performHealthCheck')
      await sut.getHandle()
      expect(performHealthCheckSpy).toHaveBeenCalledTimes(1)
      expect(performHealthCheckSpy).toHaveBeenCalledWith()
    })
    it('should return a HealthCheckResult instance', async () => {
      const result = await sut.getHandle()
      expect(result).toEqual(mockHealthCheckResult)
    })
  })
})
