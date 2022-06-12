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
  let service: Oauth2GrantStrategyRegistry
  let explorer: StrategyExplorer
  let module: TestingModule
  beforeEach(async () => {
    jest.clearAllMocks()
    module = await Test.createTestingModule({
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

    service = module.get<Oauth2GrantStrategyRegistry>(Oauth2GrantStrategyRegistry)
    explorer = module.get<StrategyExplorer>(StrategyExplorer)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
  describe('register', () => {
    it('should register a grant strategy', () => {
      const registerStrategySpy = jest.spyOn(Oauth2GrantStrategyRegistry.prototype as any, 'registerStrategy')
      const getSpy = jest.spyOn(service['moduleRef'], 'get')
      const reflectStrategyNameSpy = jest.spyOn(Oauth2GrantStrategyRegistry.prototype as any, 'reflectStrategyName')
      const { strategies } = explorer.explore()
      service.register(strategies)
      expect(service['registry'].client_credentials).toBeDefined()
      expect(registerStrategySpy).toHaveBeenCalledTimes(1)
      expect(registerStrategySpy).toHaveBeenCalledWith(Oauth2GrantStrategyStub)
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(getSpy).toHaveBeenCalledWith(Oauth2GrantStrategyStub, { strict: false })
      expect(reflectStrategyNameSpy).toHaveBeenCalledTimes(1)
      expect(reflectStrategyNameSpy).toHaveBeenCalledWith(Oauth2GrantStrategyStub)
    })
    it('should no have strategies registered', () => {
      const getSpy = jest.spyOn(service['moduleRef'], 'get').mockReturnValue(undefined)
      service.register([Oauth2GrantStrategyStub])
      expect(service['registry']).toEqual({})
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(getSpy).toHaveBeenCalledWith(Oauth2GrantStrategyStub, { strict: false })
    })
  })
})
