import { Oauth2Controller } from '@app/auth/controllers'
import { OAuth2Request } from '@app/auth/dto'
import { Oauth2GrantStrategyRegistryService } from '@app/auth/strategies'
import { createMock } from '@golevelup/nestjs-testing'
import { InternalServerErrorException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

describe('OauthController', () => {
  let sut: Oauth2Controller
  let strategyRegistry: Oauth2GrantStrategyRegistryService
  let request: OAuth2Request

  beforeEach(async () => {
    jest.clearAllMocks()
    strategyRegistry = createMock<Oauth2GrantStrategyRegistryService>({
      validate: jest.fn().mockResolvedValue(true)
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
      await expect(sut.token(request)).rejects.toThrow()
    })
    it('should throw a error if strategyRegistry throws', async () => {
      strategyRegistry.validate = jest.fn().mockImplementationOnce(() => {
        throw new Error('error')
      })
      await expect(sut.token(request)).rejects.toThrow()
    })
    it('should throw a internal error if error to occur', async () => {
      strategyRegistry.validate = jest.fn().mockImplementationOnce(() => {
        throw new Error('error')
      })
      await expect(sut.token(request)).rejects.toThrow(InternalServerErrorException)
    })
  })
})
