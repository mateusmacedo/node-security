import { LogExecution } from '@app/common/decorators'
import { createMock } from '@golevelup/nestjs-testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import { LoggerModule, PinoLogger } from 'nestjs-pino'

describe('LogExecutionDecorator', () => {
  class DummyClass {
    @LogExecution()
    async dummyMethod(data: string) {
      return data
    }
  }
  let sut: DummyClass
  const mockConfigService = createMock<ConfigService>({
    get: jest.fn(() => 'runMock')
  })
  const mockLogger = createMock<PinoLogger>({
    info: jest.fn().mockReturnValue(undefined)
  })
  beforeEach(async () => {
    jest.clearAllMocks()
    const moduleRef = await Test.createTestingModule({
      imports: [LoggerModule.forRoot(), ConfigModule.forRoot()],
      controllers: [],
      providers: [
        {
          provide: 'DummyClass',
          useClass: DummyClass
        }
      ]
    })
      .overrideProvider(PinoLogger)
      .useValue(mockLogger)
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .compile()
    sut = moduleRef.get<DummyClass>('DummyClass')
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })
  describe('LogExecution', () => {
    it('should process logging flow correctly', async () => {
      const spy = jest.spyOn(sut, 'dummyMethod')
      expect(await sut.dummyMethod('dummy')).toBe('dummy')
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('dummy')
      expect(mockLogger.info).toHaveBeenCalledTimes(1)
      expect(mockLogger.info).toBeCalledWith({ data: ['dummy'], result: 'dummy' })
    })
  })
})
