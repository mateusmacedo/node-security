import { IDENTITY_PROVIDER_METADATA } from '@app/auth/constants'
import { IdentityContext } from '@app/auth/enums'
import { IdentityProviderService } from '@app/auth/services'
import { CognitoIdentityProviderService } from '@app/auth/services/clients'
import { IdentityProvider } from '@app/auth/services/clients/decorator'
import { StrategyExplorerService } from '@app/common/services'
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'
import { Injectable } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'

@Injectable()
@IdentityProvider(IdentityContext.AP)
class IdentityProviderClientServiceStub extends CognitoIdentityProviderClient {
  constructor(private readonly configService: ConfigService) {
    super({
      region: configService.get('AWS_DEFAULT_REGION'),
      credentials: {
        accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY')
      },
      endpoint:
        configService.get('AWS_COGNITO_IDENTITY_PROVIDER_ENDPOINT') + configService.get('AWS_COGNITO_AP_USER_POOL_ID')
    })
  }
}

describe('CognitoIdentityProviderService', () => {
  let cognitoIdentityProviderService: CognitoIdentityProviderService
  let explorer: StrategyExplorerService
  let module: TestingModule
  beforeEach(async () => {
    jest.clearAllMocks()
    module = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [],
      providers: [
        StrategyExplorerService,
        IdentityProviderClientServiceStub,
        {
          provide: IdentityProviderService,
          useClass: CognitoIdentityProviderService
        }
      ]
    }).compile()

    cognitoIdentityProviderService = module.get<IdentityProviderService>(
      IdentityProviderService
    ) as CognitoIdentityProviderService
    explorer = module.get<StrategyExplorerService>(StrategyExplorerService)
    cognitoIdentityProviderService.register(explorer.explore<CognitoIdentityProviderClient>(IDENTITY_PROVIDER_METADATA))
  })

  it('should be defined', () => {
    expect(cognitoIdentityProviderService).toBeDefined()
    expect(explorer).toBeDefined()
  })
  describe('register', () => {
    it('should register a grant client strategy', () => {
      const getSpy = jest.spyOn(cognitoIdentityProviderService['moduleRef'], 'get')
      const reflect = jest.spyOn(Reflect, 'getMetadata')
      cognitoIdentityProviderService['registry'] = {}
      cognitoIdentityProviderService.register(
        explorer.explore<CognitoIdentityProviderClient>(IDENTITY_PROVIDER_METADATA)
      )
      expect(cognitoIdentityProviderService['registry'][IdentityContext.AP]).toBeDefined()
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(getSpy).toHaveBeenCalledWith(IdentityProviderClientServiceStub, { strict: false })
      expect(reflect).toHaveBeenCalledWith(IDENTITY_PROVIDER_METADATA, IdentityProviderClientServiceStub)
    })
    it('should no have client strategies registered', () => {
      cognitoIdentityProviderService['registry'] = {}
      const getSpy = jest.spyOn(cognitoIdentityProviderService['moduleRef'], 'get').mockReturnValue(undefined)
      cognitoIdentityProviderService.register([IdentityProviderClientServiceStub])
      expect(cognitoIdentityProviderService['registry']).toEqual({})
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(getSpy).toHaveBeenCalledWith(IdentityProviderClientServiceStub, { strict: false })
    })
  })
})
