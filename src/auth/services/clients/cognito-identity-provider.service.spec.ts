import { IDENTITY_PROVIDER_METADATA } from '@app/auth/constants'
import { IdentityContext } from '@app/auth/enums'
import { CognitoIdentityProviderClientWithPoolId, IdentityProviderClient } from '@app/auth/interfaces'
import { IdentityProviderService } from '@app/auth/services'
import { CognitoIdentityProviderService } from '@app/auth/services/clients'
import { IdentityProvider } from '@app/auth/services/clients/decorator'
import { StrategyExplorerService } from '@app/common/services'
import {
  CognitoIdentityProviderClient,
  DescribeUserPoolClientCommandOutput
} from '@aws-sdk/client-cognito-identity-provider'
import { createMock } from '@golevelup/nestjs-testing'
import { Injectable } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'

@Injectable()
@IdentityProvider(IdentityContext.AP)
class IdentityProviderClientServiceStub implements CognitoIdentityProviderClientWithPoolId {
  constructor(private readonly userPoolId: string, private readonly client: CognitoIdentityProviderClient) {}
  getUserPoolId(): string {
    return this.userPoolId
  }
  getClient(): CognitoIdentityProviderClient {
    return this.client
  }
}

describe('CognitoIdentityProviderService', () => {
  let cognitoIdentityProviderService: CognitoIdentityProviderService
  let identityProviderClientServiceStub: IdentityProviderClientServiceStub
  let explorer: StrategyExplorerService
  let module: TestingModule
  let identifyCommandOutput: DescribeUserPoolClientCommandOutput
  beforeEach(async () => {
    jest.clearAllMocks()
    identifyCommandOutput = {
      $metadata: undefined,
      UserPoolClient: {
        AllowedOAuthFlows: [],
        AllowedOAuthScopes: [],
        ClientId: 'clientId',
        ClientName: 'clientName',
        ClientSecret: 'clientSecret',
        ExplicitAuthFlows: [],
        UserPoolId: 'userPoolId'
      }
    }
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: 'test.env',
          expandVariables: true
        })
      ],
      controllers: [],
      providers: [
        StrategyExplorerService,
        {
          inject: [ConfigService],
          provide: IdentityProviderClientServiceStub,
          useFactory: (configService: ConfigService) => {
            const client = createMock<CognitoIdentityProviderClient>({
              send: jest.fn().mockResolvedValue(identifyCommandOutput)
            })
            const userPoolId = configService.get('AWS_COGNITO_AP_USER_POOL_ID')
            return new IdentityProviderClientServiceStub(userPoolId, client)
          }
        },
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
    identityProviderClientServiceStub = module.get<IdentityProviderClientServiceStub>(IdentityProviderClientServiceStub)
    cognitoIdentityProviderService.register(
      explorer.explore<CognitoIdentityProviderClientWithPoolId>(IDENTITY_PROVIDER_METADATA)
    )
  })

  it('should be defined', () => {
    expect(cognitoIdentityProviderService).toBeDefined()
    expect(identityProviderClientServiceStub).toBeDefined()
    expect(explorer).toBeDefined()
  })
  describe('register', () => {
    it('should register a grant client strategy', () => {
      const getSpy = jest.spyOn(cognitoIdentityProviderService['moduleRef'], 'get')
      const reflect = jest.spyOn(Reflect, 'getMetadata')
      cognitoIdentityProviderService['registry'] = {}
      cognitoIdentityProviderService.register(
        explorer.explore<CognitoIdentityProviderClientWithPoolId>(IDENTITY_PROVIDER_METADATA)
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
  describe('identifyClient', () => {
    it('should identifyClient successfully', async () => {
      const clientData: Partial<IdentityProviderClient> = {
        clientId: '3e67tihr5n17r4g1nkoi18s8bq',
        identityContext: IdentityContext.AP
      }
      const result = await cognitoIdentityProviderService.identifyClient(clientData)
      expect(result).toBeDefined()
      expect(result.clientId).toEqual(identifyCommandOutput.UserPoolClient.ClientId)
      expect(result.clientName).toEqual(identifyCommandOutput.UserPoolClient.ClientName)
      expect(result.clientSecret).toEqual(identifyCommandOutput.UserPoolClient.ClientSecret)
      expect(result.clientScopes).toEqual(identifyCommandOutput.UserPoolClient.AllowedOAuthScopes)
      expect(result.allowedAuthFlow).toEqual(identifyCommandOutput.UserPoolClient.AllowedOAuthFlows)
    })
  })
})
