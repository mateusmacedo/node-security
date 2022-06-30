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

  class DummyErrorClass {
    @LogExecution()
    async asyncDummyMethod(data: string) {
      throw new Error(data)
    }

    @LogExecution()
    dummyMethod(data: string) {
      throw new Error(data)
    }
  }
  let sut: DummyClass
  let sutError: DummyErrorClass
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
        },
        {
          provide: 'DummyErrorClass',
          useClass: DummyErrorClass
        }
      ]
    })
      .overrideProvider(PinoLogger)
      .useValue(mockLogger)
      .compile()
    sut = moduleRef.get<DummyClass>('DummyClass')
    sutError = moduleRef.get<DummyErrorClass>('DummyErrorClass')
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
    expect(sutError).toBeDefined()
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
    it('should logging error and trows when async execution throws', async () => {
      const spy = jest.spyOn(sutError, 'asyncDummyMethod')
      await expect(sutError.asyncDummyMethod('dummy')).rejects.toThrow('dummy')
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('dummy')
      expect(mockLogger.error).toHaveBeenCalledTimes(1)
      expect(mockLogger.error).toBeCalledWith({ data: ['dummy'], error: new Error('dummy') })
    })
    it('should process logging flow correctly', () => {
      const spy = jest.spyOn(sut, 'dummyMethod')
      expect(sut.dummyMethod('dummy')).toBe('dummy')
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('dummy')
      expect(mockLogger.info).toHaveBeenCalledTimes(1)
      expect(mockLogger.info).toBeCalledWith({ data: ['dummy'], result: 'dummy' })
    })
    it('should logging error and trows when execution throws', () => {
      const spy = jest.spyOn(sutError, 'dummyMethod')
      try {
        sutError.dummyMethod('dummy')
      } catch (err) {
        expect(err).toBeInstanceOf(Error)
        expect(err.message).toBe('dummy')
        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith('dummy')
        expect(mockLogger.error).toHaveBeenCalledTimes(1)
        expect(mockLogger.error).toBeCalledWith({ data: ['dummy'], error: new Error('dummy') })
      }
    })
  })
})
