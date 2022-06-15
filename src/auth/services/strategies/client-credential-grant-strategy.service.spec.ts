import { OAuth2Request } from '@app/auth/dtos'
import { GrantType, IdentityContext } from '@app/auth/enums'
import { IdentityProviderClient } from '@app/auth/interfaces'
import { IdentityProviderService } from '@app/auth/services'
import { ClientCredentialGrantStrategyService } from '@app/auth/services/strategies'
import { createMock } from '@golevelup/nestjs-testing'
import { Test } from '@nestjs/testing'

describe('ClientCredentialGrantStrategyService', () => {
  let clientCredentialStrategy: ClientCredentialGrantStrategyService
  let identityProvider: IdentityProviderService
  let request: OAuth2Request
  let clientIdentityProvider: IdentityProviderClient

  beforeEach(async () => {
    jest.clearAllMocks()
    request = {
      grantType: GrantType.CLIENT_CREDENTIALS,
      clientId: 'client-id',
      clientSecret: 'client-secret',
      identityContext: IdentityContext.AP,
      scopes: ['scope-1', 'scope-2']
    }
    clientIdentityProvider = {
      allowedAuthFlow: [GrantType.CLIENT_CREDENTIALS],
      clientId: 'client-id',
      clientSecret: 'client-secret',
      clientName: 'client-name',
      clientScopes: ['scope-1', 'scope-2'],
      identityContext: IdentityContext.AP
    }
    identityProvider = createMock<IdentityProviderService>({
      identifyClient: jest.fn().mockResolvedValue(clientIdentityProvider),
      createAccessToken: jest.fn().mockResolvedValue('access-token')
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
    it('should throw a error if client credentials is not valid', async () => {
      let invalidRequest = { ...request, clientSecret: 'invalid-secret' }
      await expect(clientCredentialStrategy.validate(invalidRequest)).rejects.toThrow(
        new Error('Invalid client credentials')
      )
      invalidRequest = { ...request, identityContext: 'invalid-context' as any }
      await expect(clientCredentialStrategy.validate(invalidRequest)).rejects.toThrow(
        new Error('Invalid client credentials')
      )
      invalidRequest = { ...request, grantType: 'invalid-grant-type' as any }
      await expect(clientCredentialStrategy.validate(invalidRequest)).rejects.toThrow(
        new Error('Client not allowed to use this grant type')
      )
      invalidRequest = { ...request, scopes: ['scope-1', 'scope-2', 'scope-3'] }
      await expect(clientCredentialStrategy.validate(invalidRequest)).rejects.toThrow(
        new Error('Invalid client scopes')
      )
    })
  })
  describe('getOauth2Response', () => {
    it('should throw a error when provider throws', async () => {
      const identityProviderSpy = jest
        .spyOn(identityProvider, 'createAccessToken')
        .mockRejectedValueOnce(new Error('error'))
      await expect(clientCredentialStrategy.getOauth2Response(request)).rejects.toThrow()
      expect(identityProviderSpy).toBeCalledTimes(1)
      expect(identityProviderSpy).toBeCalledWith(request)
    })
  })
})
