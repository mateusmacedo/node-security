import { IDENTITY_PROVIDER_METADATA } from '@app/auth/constants'
import { IdentityContext } from '@app/auth/enums'
import { IdentityProviderService } from '@app/auth/services'
import { CognitoIdentityProviderService } from '@app/auth/services/clients'
import { IdentityProvider } from '@app/auth/services/clients/decorator'
import { StrategyExplorerService } from '@app/common/services'
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'
import { createMock } from '@golevelup/nestjs-testing'
import { Injectable } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

@Injectable()
@IdentityProvider(IdentityContext.AP)
class IdentityProviderClientServiceStub extends CognitoIdentityProviderClient {
  constructor() {
    super({})
  }
}

describe('CognitoIdentityProviderService', () => {
  let cognitoIdentityProviderService: CognitoIdentityProviderService
  let explorer: StrategyExplorerService
  let module: TestingModule
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        {
          provide: IdentityProviderService,
          useClass: CognitoIdentityProviderService
        },
        IdentityProviderClientServiceStub,
        {
          provide: StrategyExplorerService,
          useValue: createMock<StrategyExplorerService>({
            explore: jest.fn().mockReturnValue([IdentityProviderClientServiceStub])
          })
        }
      ]
    }).compile()

    cognitoIdentityProviderService = module.get<IdentityProviderService>(
      IdentityProviderService
    ) as CognitoIdentityProviderService
    explorer = module.get<StrategyExplorerService>(StrategyExplorerService)
  })

  it('should be defined', () => {
    expect(cognitoIdentityProviderService).toBeDefined()
    expect(explorer).toBeDefined()
  })
  describe('register', () => {
    it('should register a client strategy', () => {
      const getSpy = jest.spyOn(cognitoIdentityProviderService['moduleRef'], 'get')
      const reflect = jest.spyOn(Reflect, 'getMetadata')
      cognitoIdentityProviderService.register(explorer.explore(IDENTITY_PROVIDER_METADATA))
      expect(cognitoIdentityProviderService['registry'][IdentityContext.AP]).toBeDefined()
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(getSpy).toHaveBeenCalledWith(IdentityProviderClientServiceStub, { strict: false })
      expect(reflect).toHaveBeenCalledTimes(1)
      expect(reflect).toHaveBeenCalledWith(IDENTITY_PROVIDER_METADATA, IdentityProviderClientServiceStub)
    })
  })
})
