import { appConfig } from '@app/common/configs'
import { AppConfigService } from '@app/common/services'
import { createMock } from '@golevelup/nestjs-testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'

describe('AppConfigService', () => {
  let service: AppConfigService
  let configService: ConfigService
  beforeEach(async () => {
    jest.clearAllMocks()
    configService = createMock<ConfigService>()
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: false,
          envFilePath: 'test.env',
          expandVariables: true,
          cache: false,
          isGlobal: true
        }),
        ConfigModule.forFeature(appConfig)
      ],
      providers: [AppConfigService]
    })
      .overrideProvider(ConfigService)
      .useValue(configService)
      .compile()

    service = module.get<AppConfigService>(AppConfigService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
  describe('getName', () => {
    it("should call configService.get('app.name')", () => {
      const getSpy = jest.spyOn(configService, 'get')
      getSpy.mockReturnValue('dummy-app')
      expect(service.getName()).toEqual('dummy-app')
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(getSpy).toHaveBeenCalledWith('app.name')
    })
  })
  describe('getDescription', () => {
    it("should call configService.get('app.description')", () => {
      const getSpy = jest.spyOn(configService, 'get')
      getSpy.mockReturnValue('dummy-description')
      expect(service.getDescription()).toEqual('dummy-description')
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(getSpy).toHaveBeenCalledWith('app.description')
    })
  })
  describe('getVersion', () => {
    it("should call configService.get('app.version')", () => {
      const getSpy = jest.spyOn(configService, 'get')
      getSpy.mockReturnValue('1.0.0')
      expect(service.getVersion()).toEqual('1.0.0')

      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(getSpy).toHaveBeenCalledWith('app.version')
    })
  })
  describe('getPort', () => {
    it("should call configService.get('app.port')", () => {
      const getSpy = jest.spyOn(configService, 'get')
      getSpy.mockReturnValue(3000)
      expect(service.getPort()).toEqual(3000)
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(getSpy).toHaveBeenCalledWith('app.port')
    })
  })
})
