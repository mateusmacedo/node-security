import { Oauth2Controller } from '@app/auth/controllers'
import { OAuth2Request } from '@app/auth/dto'
import { Oauth2GrantStrategyRegistryService } from '@app/auth/strategies'
import { createMock } from '@golevelup/nestjs-testing'
import { Test, TestingModule } from '@nestjs/testing'

describe('OauthController', () => {
  let sut: Oauth2Controller
  let strategyRegistry: Oauth2GrantStrategyRegistryService
  let request: OAuth2Request

  beforeEach(async () => {
    jest.clearAllMocks()
    const strategyRegistryMock = createMock<Oauth2GrantStrategyRegistryService>({
      validate: jest.fn().mockResolvedValue(undefined)
    })

    const module: TestingModule = await Test.createTestingModule({
      providers: [Oauth2GrantStrategyRegistryService],
      controllers: [Oauth2Controller]
    })
      .overrideProvider(Oauth2GrantStrategyRegistryService)
      .useValue(strategyRegistryMock)
      .compile()

    sut = module.get<Oauth2Controller>(Oauth2Controller)
    strategyRegistry = module.get<Oauth2GrantStrategyRegistryService>(Oauth2GrantStrategyRegistryService)
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
  })
})
