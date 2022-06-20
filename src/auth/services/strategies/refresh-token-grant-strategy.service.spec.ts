import { OAuth2Response } from '@app/auth/dtos'
import { GrantType, IdentityContext } from '@app/auth/enums'
import { InvalidClientCredentialsException, InvalidClientScopesException } from '@app/auth/errors'
import { IdentityProviderClientType, IdentityProviderInterface, OAuth2Payload } from '@app/auth/interfaces'
import { AbstractIdentityProviderService } from '@app/auth/services/providers/abstract'
import { RefreshTokenGrantStrategyService } from '@app/auth/services/strategies'
import { createMock } from '@golevelup/nestjs-testing'
import { Test } from '@nestjs/testing'
import { plainToClass } from 'class-transformer'

describe('RefreshTokenGrantStrategyService', () => {
  let refreshTokenStrategy: RefreshTokenGrantStrategyService
  let identityProviderService: AbstractIdentityProviderService<IdentityProviderClientType>
  let request: OAuth2Payload
  let identityProvider: IdentityProviderInterface

  beforeEach(async () => {
    jest.clearAllMocks()
    request = {
      grantType: GrantType.REFRESH_TOKEN,
      clientId: 'client-id',
      clientSecret: 'client-secret',
      identityContext: IdentityContext.AP,
      scopes: ['scope-1', 'scope-2'],
      refreshToken: 'refresh-token'
    }
    identityProvider = {
      allowedAuthFlow: [GrantType.REFRESH_TOKEN],
      clientId: 'client-id',
      clientSecret: 'client-secret',
      clientName: 'client-name',
      clientScopes: ['scope-1', 'scope-2'],
      identityContext: IdentityContext.AP
    }
    identityProviderService = createMock<AbstractIdentityProviderService<IdentityProviderClientType>>({
      identifyClient: jest.fn().mockResolvedValue(identityProvider),
      createAccessToken: jest.fn().mockResolvedValue('access-token')
    })
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        {
          provide: AbstractIdentityProviderService,
          useValue: identityProviderService
        },
        RefreshTokenGrantStrategyService
      ]
    }).compile()

    refreshTokenStrategy = moduleRef.get<RefreshTokenGrantStrategyService>(RefreshTokenGrantStrategyService)
    identityProviderService = moduleRef.get<AbstractIdentityProviderService<IdentityProviderClientType>>(
      AbstractIdentityProviderService
    )
  })

  it('should be defined', () => {
    expect(refreshTokenStrategy).toBeDefined()
    expect(identityProviderService).toBeDefined()
  })

  describe('validate', () => {
    it('should identify client on provider', async () => {
      const providerSpy = jest.spyOn(identityProviderService, 'identifyClient')
      await refreshTokenStrategy.validate(request)
      expect(providerSpy).toBeCalledTimes(1)
      expect(providerSpy).toBeCalledWith({ clientId: request.clientId, identityContext: request.identityContext })
    })
    it('should throw error when provider throws', async () => {
      jest.spyOn(identityProviderService, 'identifyClient').mockRejectedValue(new Error('error'))
      await expect(refreshTokenStrategy.validate(request)).rejects.toThrow()
    })
    it('should throw a error if client not found', async () => {
      jest.spyOn(identityProviderService, 'identifyClient').mockResolvedValue(null)
      await expect(refreshTokenStrategy.validate(request)).rejects.toThrow()
    })
    it('should throw a error if client credentials is not valid', async () => {
      let invalidRequest = { ...request, clientSecret: 'invalid-secret' }
      await expect(refreshTokenStrategy.validate(invalidRequest)).rejects.toThrow(
        new InvalidClientCredentialsException()
      )
      invalidRequest = { ...request, scopes: ['scope-1', 'scope-2', 'scope-3'] }
      await expect(refreshTokenStrategy.validate(invalidRequest)).rejects.toThrow(new InvalidClientScopesException())
      invalidRequest = { ...request, scopes: 'scope-4' }
      await expect(refreshTokenStrategy.validate(invalidRequest)).rejects.toThrow(new InvalidClientScopesException())
    })
  })
  describe('getOauth2Response', () => {
    it('should throw a error when provider throws', async () => {
      const identityProviderSpy = jest
        .spyOn(identityProviderService, 'createAccessToken')
        .mockRejectedValueOnce(new Error('error'))
      await expect(refreshTokenStrategy.getOauth2Response(request)).rejects.toThrow()
      expect(identityProviderSpy).toBeCalledTimes(1)
      expect(identityProviderSpy).toBeCalledWith(request)
    })
    it('should return access token', async () => {
      const identityProviderSpy = jest.spyOn(identityProviderService, 'createAccessToken').mockResolvedValueOnce(
        plainToClass(OAuth2Response, {
          access_token: 'access-token',
          token_type: 'bearer',
          refresh_token: 'refresh-token',
          expires_in: 123456789,
          scope: ['scope-1', 'scope-2'].toString(),
          identity_context: IdentityContext.AP
        })
      )
      const response = await refreshTokenStrategy.getOauth2Response(request)
      expect(identityProviderSpy).toBeCalledTimes(1)
      expect(identityProviderSpy).toBeCalledWith(request)
      expect(response).toBeInstanceOf(OAuth2Response)
    })
  })
})
