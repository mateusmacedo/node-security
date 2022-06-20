import { Oauth2Controller } from '@app/auth/controllers'
import { OAuth2Request, OAuth2Response } from '@app/auth/dtos'
import { GrantType, IdentityContext } from '@app/auth/enums'
import { InvalidGrantTypeException } from '@app/auth/errors'
import { GrantStrategyInterface } from '@app/auth/interfaces'
import { GrantStrategyRegistry } from '@app/auth/services'
import { createMock } from '@golevelup/nestjs-testing'
import { InternalServerErrorException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { plainToClass } from 'class-transformer'

describe('Oauth2Controller', () => {
  let sut: Oauth2Controller
  let strategyRegistry: GrantStrategyRegistry
  let request: OAuth2Request
  let identityContext: IdentityContext
  let userCredentials: { username: string; password: string }
  let response: OAuth2Response
  let strategy: GrantStrategyInterface
  beforeEach(async () => {
    jest.clearAllMocks()
    response = plainToClass(OAuth2Response, {
      access_token: 'access-token',
      token_type: 'bearer',
      refresh_token: 'refresh-token',
      expires_in: 123456789,
      scope: ['scope-1', 'scope-2'].toString(),
      identity_context: IdentityContext.AP
    })
    strategy = createMock<GrantStrategyInterface>()
    strategyRegistry = createMock<GrantStrategyRegistry>({
      validate: jest.fn().mockResolvedValue(true),
      getOauth2Response: jest.fn().mockResolvedValue(response)
    })

    const module: TestingModule = await Test.createTestingModule({
      providers: [GrantStrategyRegistry],
      controllers: [Oauth2Controller]
    })
      .overrideProvider(GrantStrategyRegistry)
      .useValue(strategyRegistry)
      .compile()

    sut = module.get<Oauth2Controller>(Oauth2Controller)
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
    expect(strategyRegistry).toBeDefined()
  })
  describe('token', () => {
    it('should validate request grant type', async () => {
      request = {
        grantType: GrantType.CLIENT_CREDENTIALS,
        clientId: 'client-id',
        clientSecret: 'client-secret',
        scopes: ['scope-1', 'scope-2'].toString()
      }
      identityContext = IdentityContext.AP
      userCredentials = { username: 'username', password: 'password' }
      const requestMerged = Object.assign(request, userCredentials, { identityContext })
      await sut.token(identityContext, request, userCredentials)
      expect(strategyRegistry.validate).toHaveBeenCalledTimes(1)
      expect(strategyRegistry.validate).toHaveBeenCalledWith(requestMerged)
    })
    it('should throw a error when cannot validate grant type', async () => {
      request = {
        grantType: GrantType.CLIENT_CREDENTIALS,
        clientId: 'client-id',
        clientSecret: 'client-secret',
        scopes: ['scope-1', 'scope-2'].toString()
      }
      identityContext = IdentityContext.AP
      userCredentials = { username: 'username', password: 'password' }
      const requestMerged = Object.assign(request, userCredentials, { identityContext })
      strategyRegistry.validate = jest.fn().mockResolvedValue(undefined)
      await expect(sut.token(identityContext, request, userCredentials)).rejects.toThrow(
        new InvalidGrantTypeException(requestMerged.grantType)
      )
    })
    it('should throw a error if strategyRegistry throws', async () => {
      request = {
        grantType: GrantType.CLIENT_CREDENTIALS,
        clientId: 'client-id',
        clientSecret: 'client-secret',
        scopes: ['scope-1', 'scope-2'].toString()
      }
      identityContext = IdentityContext.AP
      userCredentials = { username: 'username', password: 'password' }
      strategyRegistry.validate = jest.fn().mockImplementationOnce(() => {
        throw new Error()
      })
      await expect(sut.token(identityContext, request, userCredentials)).rejects.toThrow(
        new InternalServerErrorException('We have a problem')
      )
    })
    it('should get oauth2 response', async () => {
      request = {
        grantType: GrantType.CLIENT_CREDENTIALS,
        clientId: 'client-id',
        clientSecret: 'client-secret',
        scopes: ['scope-1', 'scope-2'].toString()
      }
      identityContext = IdentityContext.AP
      userCredentials = { username: 'username', password: 'password' }
      strategyRegistry['registry'] = { [GrantType.CLIENT_CREDENTIALS]: strategy }
      const requestMerged = Object.assign(request, userCredentials, { identityContext })
      const strategySpy = jest.spyOn(strategyRegistry, 'getOauth2Response').mockResolvedValue(response)
      const result = await sut.token(identityContext, request, userCredentials)
      expect(strategySpy).toHaveBeenCalledTimes(1)
      expect(strategySpy).toHaveBeenCalledWith(requestMerged)
      expect(result).toBeInstanceOf(OAuth2Response)
    })
  })
})
