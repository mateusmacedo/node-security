import { throttleConfig } from '@app/common/configs'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'

describe('ThrottleConfig', () => {
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
        ConfigModule.forFeature(throttleConfig())
      ],
      controllers: [],
      providers: []
    }).compile()
    configService = moduleRef.get<ConfigService>(ConfigService)
    const config = configService.get('throttle')
    expect(config).toHaveProperty('ttl')
    expect(config).toHaveProperty('limit')
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
        ConfigModule.forFeature(throttleConfig())
      ],
      controllers: [],
      providers: []
    }).compile()
    delete process.env.THROTTLER_TTL
    await expect(compile).rejects.toThrow()
  })
})
