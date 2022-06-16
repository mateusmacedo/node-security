import { ApIdentityProviderClientService } from '@app/auth/services/clients'
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'

describe('ApIdentityProviderClientService', () => {
  let apIdentityProviderClientService: ApIdentityProviderClientService

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
          provide: 'AP_USER_POOL_ID',
          useFactory: (configService: ConfigService) => configService.get('AWS_COGNITO_AP_USER_POOL_ID')
        },
        {
          inject: [ConfigService],
          provide: 'AP_PROVIDER_CLIENT',
          useFactory: (configService: ConfigService) => {
            const config = {
              region: configService.get('AWS_DEFAULT_REGION'),
              credentials: {
                accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
                secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY')
              },
              endpoint: configService.get('AWS_COGNITO_AP_USER_POOL_URL')
            }
            return new CognitoIdentityProviderClient(config)
          }
        },
        ApIdentityProviderClientService
      ]
    }).compile()

    apIdentityProviderClientService = moduleRef.get<ApIdentityProviderClientService>(ApIdentityProviderClientService)
  })

  it('should be a derived instance of CognitoIdentityProviderClient', () => {
    expect(apIdentityProviderClientService).toBeDefined()
    expect(apIdentityProviderClientService).toBeInstanceOf(ApIdentityProviderClientService)
    expect(apIdentityProviderClientService.getClient()).toBeInstanceOf(CognitoIdentityProviderClient)
  })
})
