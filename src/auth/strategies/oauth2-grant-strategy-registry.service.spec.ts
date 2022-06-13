import { OAUTH2_STRATEGY_METADATA } from '@app/auth/constants'
import { OAuth2Request, OAuth2Response } from '@app/auth/dtos'
import { GrantType } from '@app/auth/enums'
import { InvalidGrantTypeException } from '@app/auth/errors/invalid-grant-type.exception'
import { Oauth2StrategyNotFoundException } from '@app/auth/exceptions'
import { Oauth2GrantStrategyInterface } from '@app/auth/interfaces'
import { Oauth2GrantStrategyRegistry, StrategyExplorer } from '@app/auth/strategies'
import { Oauth2GrantStrategy } from '@app/auth/strategies/decorator/oauth2-grant-strategy.decorator'
import { createMock } from '@golevelup/nestjs-testing'
import { Injectable } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

@Injectable()
@Oauth2GrantStrategy(GrantType.CLIENT_CREDENTIALS)
class Oauth2GrantStrategyStub implements Oauth2GrantStrategyInterface {
  async validate(request: OAuth2Request): Promise<boolean> {
    return request.grantType === GrantType.CLIENT_CREDENTIALS
  }
  async getOauth2Response(request: OAuth2Request): Promise<OAuth2Response> {
    return request.grantType === GrantType.CLIENT_CREDENTIALS
      ? new OAuth2Response('access_token', 'refresh_token', 1, 1, 'scope')
      : Promise.reject(new InvalidGrantTypeException())
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
            explore: jest.fn().mockReturnValue([Oauth2GrantStrategyStub])
          })
        },
        Oauth2GrantStrategyStub,
        Oauth2GrantStrategyRegistry
      ]
    }).compile()
    service = module.get<Oauth2GrantStrategyRegistry>(Oauth2GrantStrategyRegistry)
    explorer = module.get<StrategyExplorer>(StrategyExplorer)
    service.register(explorer.explore<Oauth2GrantStrategyInterface>(OAUTH2_STRATEGY_METADATA))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
  describe('register', () => {
    it('should register a grant strategy', () => {
      const getSpy = jest.spyOn(service['moduleRef'], 'get')
      const reflect = jest.spyOn(Reflect, 'getMetadata')
      service.register(explorer.explore(OAUTH2_STRATEGY_METADATA))
      expect(service['registry'].client_credentials).toBeDefined()
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(getSpy).toHaveBeenCalledWith(Oauth2GrantStrategyStub, { strict: false })
      expect(reflect).toHaveBeenCalledTimes(1)
      expect(reflect).toHaveBeenCalledWith(OAUTH2_STRATEGY_METADATA, Oauth2GrantStrategyStub)
    })
    it('should no have strategies registered', () => {
      service['registry'] = {}
      const getSpy = jest.spyOn(service['moduleRef'], 'get').mockReturnValue(undefined)
      service.register([Oauth2GrantStrategyStub])
      expect(service['registry']).toEqual({})
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(getSpy).toHaveBeenCalledWith(Oauth2GrantStrategyStub, { strict: false })
    })
  })
  describe('validate', () => {
    it('should throw a error when not have a registered strategy', async () => {
      const request = createMock<OAuth2Request>({
        grantType: GrantType.PASSWORD
      })
      await expect(service.validate(request)).rejects.toThrow(Oauth2StrategyNotFoundException)
    })
    it('should validate when has a strategy registered', async () => {
      const strategySpy = jest.spyOn(Oauth2GrantStrategyStub.prototype, 'validate')
      const request = createMock<OAuth2Request>({
        grantType: GrantType.CLIENT_CREDENTIALS
      })
      const result = await service.validate(request)
      expect(result).toBeTruthy()
      expect(strategySpy).toHaveBeenCalledTimes(1)
      expect(strategySpy).toHaveBeenCalledWith(request)
    })
  })
  describe('getOauth2Response', () => {
    it('should throw a error when no have strategies registered for grant type', async () => {
      const request = createMock<OAuth2Request>({
        grantType: GrantType.PASSWORD
      })
      await expect(service.getOauth2Response(request)).rejects.toThrow(Oauth2StrategyNotFoundException)
    })
    it('should return a response when success', async () => {
      const strategySpy = jest.spyOn(service['registry'][GrantType.CLIENT_CREDENTIALS], 'getOauth2Response')
      const request = createMock<OAuth2Request>({
        grantType: GrantType.CLIENT_CREDENTIALS
      })
      const result = await service.getOauth2Response(request)
      expect(result).toBeInstanceOf(OAuth2Response)
      expect(strategySpy).toHaveBeenCalledTimes(1)
      expect(strategySpy).toHaveBeenCalledWith(request)
    })
  })
})
