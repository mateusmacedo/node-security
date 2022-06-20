import { IDENTITY_PROVIDER_METADATA } from '@app/auth/constants'
import { GrantType, IdentityContext } from '@app/auth/enums'
import { InvalidContextException } from '@app/auth/errors'
import {
  IdentityProviderClientInterface,
  IdentityProviderClientType,
  IdentityProviderInterface,
  OAuth2Payload
} from '@app/auth/interfaces'
import { CognitoIdentityProviderService } from '@app/auth/services/providers'
import { AbstractIdentityProviderService } from '@app/auth/services/providers/abstract'
import { IdentityProviderDecorator } from '@app/auth/services/providers/decorator'
import { StrategyExplorerService } from '@app/common/services'
import {
  CognitoIdentityProviderClient,
  DescribeUserPoolClientCommandOutput,
  InitiateAuthCommandOutput
} from '@aws-sdk/client-cognito-identity-provider'
import { createMock } from '@golevelup/nestjs-testing'
import { Injectable } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'

@Injectable()
@IdentityProviderDecorator(IdentityContext.AP)
class IdentityProviderClientServiceStub implements IdentityProviderClientInterface {
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
  let initiateAuthCommandOutput: InitiateAuthCommandOutput
  let payload: OAuth2Payload
  let client: CognitoIdentityProviderClient
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
    initiateAuthCommandOutput = {
      $metadata: undefined,
      AuthenticationResult: {
        AccessToken: 'accessToken',
        ExpiresIn: 3600,
        IdToken: 'idToken',
        RefreshToken: 'refreshToken',
        TokenType: 'tokenType'
      }
    }
    payload = {
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      grantType: GrantType.CLIENT_CREDENTIALS,
      identityContext: IdentityContext.AP,
      scopes: ['scope'],
      username: 'username',
      password: 'password'
    }
    client = createMock<CognitoIdentityProviderClient>()
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
            const userPoolId = configService.get('AWS_COGNITO_AP_USER_POOL_ID')
            return new IdentityProviderClientServiceStub(userPoolId, client)
          }
        },
        {
          provide: AbstractIdentityProviderService,
          useClass: CognitoIdentityProviderService
        }
      ]
    }).compile()

    cognitoIdentityProviderService = module.get<AbstractIdentityProviderService<IdentityProviderClientType>>(
      AbstractIdentityProviderService
    ) as CognitoIdentityProviderService
    explorer = module.get<StrategyExplorerService>(StrategyExplorerService)
    identityProviderClientServiceStub = module.get<IdentityProviderClientServiceStub>(IdentityProviderClientServiceStub)
    cognitoIdentityProviderService.register(
      explorer.explore<IdentityProviderClientInterface>(IDENTITY_PROVIDER_METADATA)
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
        explorer.explore<IdentityProviderClientInterface>(IDENTITY_PROVIDER_METADATA)
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
      const clientData: Partial<IdentityProviderInterface> = {
        clientId: '3e67tihr5n17r4g1nkoi18s8bq',
        identityContext: IdentityContext.AP
      }
      client.send = jest.fn().mockResolvedValueOnce(identifyCommandOutput)
      const result = await cognitoIdentityProviderService.identifyClient(clientData)
      expect(result).toBeDefined()
      expect(result.clientId).toEqual(identifyCommandOutput.UserPoolClient.ClientId)
      expect(result.clientName).toEqual(identifyCommandOutput.UserPoolClient.ClientName)
      expect(result.clientSecret).toEqual(identifyCommandOutput.UserPoolClient.ClientSecret)
      expect(result.clientScopes).toEqual(identifyCommandOutput.UserPoolClient.AllowedOAuthScopes)
      expect(result.allowedAuthFlow).toEqual(identifyCommandOutput.UserPoolClient.AllowedOAuthFlows)
    })
    it('should throw an error when invalid context is provided', async () => {
      const clientData: Partial<IdentityProviderInterface> = {
        identityContext: IdentityContext.PF
      }
      await expect(cognitoIdentityProviderService.identifyClient(clientData)).rejects.toThrow(
        new InvalidContextException(IdentityContext.PF)
      )
    })
  })
  describe('createAccessToken', () => {
    it('should createAccessToken successfully', async () => {
      client.send = jest
        .fn()
        .mockResolvedValueOnce({ ...initiateAuthCommandOutput, ChallengeName: 'NEW_PASSWORD_REQUIRED' })
        .mockResolvedValueOnce(initiateAuthCommandOutput)
      const result = await cognitoIdentityProviderService.createAccessToken(payload)
      expect(result).toBeDefined()
      expect(result.accessToken).toBeDefined()
      expect(result.tokenType).toBeDefined()
      expect(result.refreshToken).toBeDefined()
      expect(result.accessTokenExp).toBeDefined()
      expect(result.idToken).toBeDefined()
    })
  })
})
