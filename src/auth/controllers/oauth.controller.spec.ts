import { Oauth2Controller } from '@app/auth/controllers'
import { Oauth2GrantStrategyRegistryService } from '@app/auth/strategies'
import { createMock } from '@golevelup/nestjs-testing'
import { Test, TestingModule } from '@nestjs/testing'

describe('OauthController', () => {
  let sut: Oauth2Controller
  let strategyRegistry: Oauth2GrantStrategyRegistryService

  beforeEach(async () => {
    jest.clearAllMocks()
    const strategyRegistryMock = createMock<Oauth2GrantStrategyRegistryService>()

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
})
