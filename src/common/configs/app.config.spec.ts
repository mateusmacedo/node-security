import { appConfig } from '@app/common/configs'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'

describe('appConfig', () => {
  jest.clearAllMocks()
  let sut: ConfigService
  it('should have appropriate app configs', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: false,
          envFilePath: 'test.env',
          expandVariables: true,
          cache: false,
          isGlobal: true
        }),
        ConfigModule.forFeature(appConfig())
      ],
      controllers: [],
      providers: []
    }).compile()
    sut = moduleRef.get<ConfigService>(ConfigService)
    const configs = sut.get('app')
    expect(configs).toHaveProperty('name')
    expect(configs).toHaveProperty('description')
    expect(configs).toHaveProperty('version')
    expect(configs).toHaveProperty('port')
    expect(configs).toHaveProperty('configModule')
    expect(configs.configModule).toHaveProperty('ignoreEnvFile')
    expect(configs.configModule).toHaveProperty('envFilePath')
    expect(configs.configModule).toHaveProperty('expandVariables')
    expect(configs.configModule).toHaveProperty('cache')
    expect(configs.configModule).toHaveProperty('isGlobal')
  })
  it('should throw a error if appropriate app configs is not present', async () => {
    const compile = Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: false,
          envFilePath: 'test.env',
          expandVariables: true,
          cache: false,
          isGlobal: true
        }),
        ConfigModule.forFeature(appConfig())
      ],
      controllers: [],
      providers: []
    }).compile()
    delete process.env.APP_NAME
    await expect(compile).rejects.toThrow()
  })
})
