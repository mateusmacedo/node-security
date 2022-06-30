import { PjIdentityProviderClientService } from '@app/auth/services/providers/pools'
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'

describe('PjIdentityProviderClientService', () => {
  let pjIdentityProviderClientService: PjIdentityProviderClientService
  let configService: ConfigService
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: 'test.env',
          expandVariables: true
        })
      ],
      controllers: [],
      providers: [
        {
          inject: [ConfigService],
          provide: 'PJ_USER_POOL_ID',
          useFactory: (configService: ConfigService) => configService.get('AWS_COGNITO_PJ_USER_POOL_ID')
        },
        {
          inject: [ConfigService],
          provide: 'PJ_PROVIDER_CLIENT',
          useFactory: (configService: ConfigService) => {
            const config = {
              region: configService.get('AWS_DEFAULT_REGION'),
              credentials: {
                accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
                secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY')
              },
              endpoint: configService.get('AWS_COGNITO_PJ_USER_POOL_URL')
            }
            return new CognitoIdentityProviderClient(config)
          }
        },
        PjIdentityProviderClientService
      ]
    }).compile()

    pjIdentityProviderClientService = moduleRef.get<PjIdentityProviderClientService>(PjIdentityProviderClientService)
    configService = moduleRef.get<ConfigService>(ConfigService)
  })

  it('should be a derived instance of CognitoIdentityProviderClient', () => {
    expect(pjIdentityProviderClientService).toBeDefined()
    expect(pjIdentityProviderClientService).toBeInstanceOf(PjIdentityProviderClientService)
    expect(pjIdentityProviderClientService.getUserPoolId()).toBe(configService.get('AWS_COGNITO_PJ_USER_POOL_ID'))
    expect(pjIdentityProviderClientService.getClient()).toBeInstanceOf(CognitoIdentityProviderClient)
  })
})
