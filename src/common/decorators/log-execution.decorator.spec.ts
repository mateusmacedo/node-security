import { LogExecution } from '@app/common/decorators'
import { createMock } from '@golevelup/nestjs-testing'
import { ConfigModule } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import { LoggerModule, PinoLogger } from 'nestjs-pino'

process.env.NODE_ENV = 'logExecution'
describe('LogExecutionDecorator', () => {
  afterAll(() => {
    process.env.NODE_ENV = 'test'
  })
  class DummyClass {
    @LogExecution()
    async asyncDummyMethod(data: string) {
      return data
    }

    @LogExecution()
    dummyMethod(data: string) {
      return data
    }
  }
  let sut: DummyClass
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
      .compile()
    sut = moduleRef.get<DummyClass>('DummyClass')
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })
  describe('LogExecution', () => {
    it('should process logging flow correctly when async', async () => {
      const spy = jest.spyOn(sut, 'asyncDummyMethod')
      expect(await sut.asyncDummyMethod('dummy')).toBe('dummy')
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('dummy')
      expect(mockLogger.info).toHaveBeenCalledTimes(1)
      expect(mockLogger.info).toBeCalledWith({ data: ['dummy'], result: 'dummy' })
    })
    it('should process logging flow correctly', () => {
      const spy = jest.spyOn(sut, 'dummyMethod')
      expect(sut.dummyMethod('dummy')).toBe('dummy')
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('dummy')
      expect(mockLogger.info).toHaveBeenCalledTimes(1)
      expect(mockLogger.info).toBeCalledWith({ data: ['dummy'], result: 'dummy' })
    })
  })
})
