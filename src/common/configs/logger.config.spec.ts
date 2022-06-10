import { loggerConfig } from '@app/common/configs'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'

describe('logConfig', () => {
  jest.clearAllMocks()
  let configService: ConfigService
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
        ConfigModule.forFeature(loggerConfig())
      ],
      controllers: [],
      providers: []
    }).compile()
    configService = moduleRef.get<ConfigService>(ConfigService)
    const config = configService.get('logger')
    expect(config).toHaveProperty('enabled')
    expect(config).toHaveProperty('level')
    expect(config).toHaveProperty('autoLogging')
    expect(config).toHaveProperty('quietReqLogger')
    expect(config).toHaveProperty('minLength')
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
        ConfigModule.forFeature(loggerConfig())
      ],
      controllers: [],
      providers: []
    }).compile()
    delete process.env.LOGGER_PINO_HTTP_LEVEL
    await expect(compile).rejects.toThrow()
  })
})
