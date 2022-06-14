import { OAuth2Request } from '@app/auth/dtos'
import { GrantType, IdentityContext } from '@app/auth/enums'
import { IdentityProviderService } from '@app/auth/services'
import { ClientCredentialGrantStrategyService } from '@app/auth/services/strategies'
import { createMock } from '@golevelup/nestjs-testing'
import { Test } from '@nestjs/testing'

describe('ClientCredentialGrantStrategyService', () => {
  let clientCredentialStrategy: ClientCredentialGrantStrategyService
  let identityProvider: IdentityProviderService
  let request: OAuth2Request

  beforeEach(async () => {
    jest.clearAllMocks()
    request = {
      grantType: GrantType.CLIENT_CREDENTIALS,
      clientId: 'client-id',
      clientSecret: 'client-secret',
      identityContext: IdentityContext.AP,
      scopes: ['scope-1', 'scope-2']
    }
    identityProvider = createMock<IdentityProviderService>({
      identifyClient: jest.fn().mockResolvedValue(request)
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
      await clientCredentialStrategy.validate(request)
      expect(providerSpy).toBeCalledTimes(1)
      expect(providerSpy).toBeCalledWith({ clientId: request.clientId, identityContext: request.identityContext })
    })
    it('should throw error when provider throws', async () => {
      jest.spyOn(identityProvider, 'identifyClient').mockRejectedValue(new Error('error'))
      await expect(clientCredentialStrategy.validate(request)).rejects.toThrow()
    })
    it('should throw a error if client not found', async () => {
      jest.spyOn(identityProvider, 'identifyClient').mockResolvedValue(null)
      await expect(clientCredentialStrategy.validate(request)).rejects.toThrow()
    })
  })
})
