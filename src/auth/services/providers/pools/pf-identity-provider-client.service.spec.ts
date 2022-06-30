import { PfIdentityProviderClientService } from '@app/auth/services/providers/pools'
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'

describe('PfIdentityProviderClientService', () => {
  let apIdentityProviderClientService: PfIdentityProviderClientService
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
          provide: 'PF_USER_POOL_ID',
          useFactory: (configService: ConfigService): string => configService.get<string>('AWS_COGNITO_PF_USER_POOL_ID')
        },
        {
          inject: [ConfigService],
          provide: 'PF_PROVIDER_CLIENT',
          useFactory: (configService: ConfigService): CognitoIdentityProviderClient => {
            const config = {
              region: configService.get<string>('AWS_DEFAULT_REGION'),
              credentials: {
                accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
                secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY')
              },
              endpoint: configService.get<string>('AWS_COGNITO_PF_USER_POOL_URL')
            }
            return new CognitoIdentityProviderClient(config)
          }
        },
        PfIdentityProviderClientService
      ]
    }).compile()

    apIdentityProviderClientService = moduleRef.get<PfIdentityProviderClientService>(PfIdentityProviderClientService)
    configService = moduleRef.get<ConfigService>(ConfigService)
  })

  it('should be a derived instance of CognitoIdentityProviderClient', () => {
    expect(apIdentityProviderClientService).toBeDefined()
    expect(apIdentityProviderClientService).toBeInstanceOf(PfIdentityProviderClientService)
    expect(apIdentityProviderClientService.getUserPoolId()).toBe(configService.get('AWS_COGNITO_PF_USER_POOL_ID'))
    expect(apIdentityProviderClientService.getClient()).toBeInstanceOf(CognitoIdentityProviderClient)
  })
})
