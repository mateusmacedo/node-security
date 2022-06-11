import { Oauth2Controller } from '@app/auth/controllers'
import { OAuth2Request, OAuth2Response } from '@app/auth/dtos'
import { GrantType } from '@app/auth/enums'
import { Oauth2GrantStrategyInterface } from '@app/auth/interfaces'
import { Oauth2GrantStrategyRegistryService } from '@app/auth/strategies'
import { createMock } from '@golevelup/nestjs-testing'
import { BadRequestException, InternalServerErrorException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

describe('OauthController', () => {
  let sut: Oauth2Controller
  let strategyRegistry: Oauth2GrantStrategyRegistryService
  let request: OAuth2Request
  let response: OAuth2Response
  let strategy: Oauth2GrantStrategyInterface
  beforeEach(async () => {
    jest.clearAllMocks()
    response = new OAuth2Response('accessToken', 'refreshToken', 1, 1, 'scope')
    strategy = createMock<Oauth2GrantStrategyInterface>()
    strategyRegistry = createMock<Oauth2GrantStrategyRegistryService>({
      validate: jest.fn().mockResolvedValue(true),
      getOauth2Response: jest.fn().mockResolvedValue(response)
    })

    const module: TestingModule = await Test.createTestingModule({
      providers: [Oauth2GrantStrategyRegistryService],
      controllers: [Oauth2Controller]
    })
      .overrideProvider(Oauth2GrantStrategyRegistryService)
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
      await expect(sut.token(request)).rejects.toThrow(new BadRequestException('Invalid grant type'))
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
