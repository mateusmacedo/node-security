import { OAuth2Request } from '@app/auth/dtos'
import { GrantType, IdentityContext } from '@app/auth/enums'
import { IdentityProviderService } from '@app/auth/services'
import { ClientCredentialGrantStrategyService } from '@app/auth/services/strategies'
import { createMock } from '@golevelup/nestjs-testing'
import { Test } from '@nestjs/testing'

describe('ClientCredentialGrantStrategyService', () => {
  let clientCredentialStrategy: ClientCredentialGrantStrategyService
  let identityProvider: IdentityProviderService

  beforeEach(async () => {
    jest.clearAllMocks()
    identityProvider = createMock<IdentityProviderService>({
      identifyClient: jest.fn().mockResolvedValue({
        clientId: 'client-id',
        clientSecret: 'client-secret'
      })
    })
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        {
          provide: IdentityProviderService,
          useValue: identityProvider
        },
        ClientCredentialGrantStrategyService
      ]
    }).compile()

    clientCredentialStrategy = moduleRef.get<ClientCredentialGrantStrategyService>(ClientCredentialGrantStrategyService)
    identityProvider = moduleRef.get<IdentityProviderService>(IdentityProviderService)
  })

  it('should be defined', () => {
    expect(clientCredentialStrategy).toBeDefined()
    expect(identityProvider).toBeDefined()
  })

  describe('validate', () => {
    it('should identify client on provider', async () => {
      const providerSpy = jest.spyOn(identityProvider, 'identifyClient')
      const request = createMock<OAuth2Request>({
        grantType: GrantType.CLIENT_CREDENTIALS,
        clientId: 'client-id',
        clientSecret: 'client-secret',
        identityContext: IdentityContext.AP
      })
      await clientCredentialStrategy.validate(request)
      expect(providerSpy).toBeCalledTimes(1)
      expect(providerSpy).toBeCalledWith('client-id')
    })
  })
})
