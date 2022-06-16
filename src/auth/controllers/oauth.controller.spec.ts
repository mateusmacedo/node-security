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
      request = createMock<OAuth2Request>()
      await sut.token(request)
      expect(strategyRegistry.validate).toHaveBeenCalledTimes(1)
      expect(strategyRegistry.validate).toHaveBeenCalledWith(request)
    })
    it('should throw a error when cannot validate grant type', async () => {
      strategyRegistry.validate = jest.fn().mockResolvedValue(undefined)
      await expect(sut.token(request)).rejects.toThrow(new InvalidGrantTypeException())
    })
    it('should throw a error if strategyRegistry throws', async () => {
      strategyRegistry.validate = jest.fn().mockImplementationOnce(() => {
        throw new Error()
      })
      await expect(sut.token(request)).rejects.toThrow(new InternalServerErrorException('We have a problem'))
    })
    it('should get oauth2 response', async () => {
      request = createMock<OAuth2Request>({
        grantType: GrantType.PASSWORD
      })
      strategyRegistry['registry'] = { [GrantType.PASSWORD]: strategy }
      const strategySpy = jest.spyOn(strategyRegistry, 'getOauth2Response').mockResolvedValue(response)
      const result = await sut.token(request)
      expect(strategySpy).toHaveBeenCalledTimes(1)
      expect(strategySpy).toHaveBeenCalledWith(request)
      expect(result).toBeInstanceOf(OAuth2Response)
    })
  })
})
