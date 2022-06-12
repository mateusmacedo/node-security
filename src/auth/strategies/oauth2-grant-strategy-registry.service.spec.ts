import { OAuth2Request, OAuth2Response } from '@app/auth/dtos'
import { Oauth2GrantStrategyInterface } from '@app/auth/interfaces'
import { Oauth2GrantStrategyRegistry, StrategyExplorer } from '@app/auth/strategies'
import { Oauth2GrantStrategy } from '@app/auth/strategies/decorator/oauth2-grant-strategy.decorator'
import { createMock } from '@golevelup/nestjs-testing'
import { Injectable } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

@Injectable()
@Oauth2GrantStrategy('client_credentials')
class Oauth2GrantStrategyStub implements Oauth2GrantStrategyInterface {
  validate(request: OAuth2Request): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
  getOauth2Response(request: OAuth2Request): Promise<OAuth2Response> {
    throw new Error('Method not implemented.')
  }
}

describe('Oauth2GrantStrategyRegistryService', () => {
  let sut: Oauth2GrantStrategyRegistry
  let explorer: StrategyExplorer
  beforeEach(async () => {
    jest.clearAllMocks()
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: StrategyExplorer,
          useValue: createMock<StrategyExplorer>({
            explore: jest.fn().mockReturnValue({
              strategies: [Oauth2GrantStrategyStub]
            })
          })
        },
        Oauth2GrantStrategyStub,
        Oauth2GrantStrategyRegistry
      ]
    }).compile()

    sut = module.get<Oauth2GrantStrategyRegistry>(Oauth2GrantStrategyRegistry)
    explorer = module.get<StrategyExplorer>(StrategyExplorer)
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })
  describe('register', () => {
    it('should register a grant strategy', () => {
      const { strategies } = explorer.explore()
      sut.register(strategies)
      const test = sut['registry']
      expect(test.client_credentials).toBeDefined()
    })
  })
})
