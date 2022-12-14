import { GRANT_STRATEGY_METADATA } from '@app/auth/constants'
import { OAuth2Response } from '@app/auth/dtos'
import { GrantType, IdentityContext } from '@app/auth/enums'
import { Oauth2StrategyNotFoundException } from '@app/auth/errors'
import { InvalidGrantTypeException } from '@app/auth/errors/invalid-grant-type.exception'
import { GrantStrategyInterface, OAuth2Payload } from '@app/auth/interfaces'
import { GrantStrategyRegistry } from '@app/auth/services'
import { GrantStrategyDecorator } from '@app/auth/services/strategies'
import { StrategyExplorerService } from '@app/common/services'
import { createMock } from '@golevelup/nestjs-testing'
import { Injectable } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { plainToClass } from 'class-transformer'

@Injectable()
@GrantStrategyDecorator(GrantType.CLIENT_CREDENTIALS)
class GrantStrategyStub implements GrantStrategyInterface {
  async validate(request: OAuth2Payload): Promise<boolean> {
    return request.grantType === GrantType.CLIENT_CREDENTIALS
  }
  async getOauth2Response(request: OAuth2Payload): Promise<OAuth2Response> {
    return request.grantType === GrantType.CLIENT_CREDENTIALS
      ? plainToClass(OAuth2Response, {
          access_token: 'access-token',
          token_type: 'bearer',
          refresh_token: 'refresh-token',
          expires_in: 123456789,
          scope: ['scope-1', 'scope-2'].toString(),
          identity_context: IdentityContext.AP
        })
      : Promise.reject(new InvalidGrantTypeException(request.grantType))
  }
}

describe('GrantStrategyRegistryService', () => {
  let service: GrantStrategyRegistry
  let explorer: StrategyExplorerService
  let module: TestingModule
  beforeEach(async () => {
    jest.clearAllMocks()
    module = await Test.createTestingModule({
      providers: [
        {
          provide: StrategyExplorerService,
          useValue: createMock<StrategyExplorerService>({
            explore: jest.fn().mockReturnValue([GrantStrategyStub])
          })
        },
        GrantStrategyStub,
        GrantStrategyRegistry
      ]
    }).compile()
    service = module.get<GrantStrategyRegistry>(GrantStrategyRegistry)
    explorer = module.get<StrategyExplorerService>(StrategyExplorerService)
    service.register(explorer.explore<GrantStrategyInterface>(GRANT_STRATEGY_METADATA))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
  describe('register', () => {
    it('should register a grant strategy', () => {
      const getSpy = jest.spyOn(service['moduleRef'], 'get')
      const reflect = jest.spyOn(Reflect, 'getMetadata')
      service.register(explorer.explore<GrantStrategyInterface>(GRANT_STRATEGY_METADATA))
      expect(service['registry'].client_credentials).toBeDefined()
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(getSpy).toHaveBeenCalledWith(GrantStrategyStub, { strict: false })
      expect(reflect).toHaveBeenCalledTimes(1)
      expect(reflect).toHaveBeenCalledWith(GRANT_STRATEGY_METADATA, GrantStrategyStub)
    })
    it('should no have strategies registered', () => {
      service['registry'] = {}
      const getSpy = jest.spyOn(service['moduleRef'], 'get').mockReturnValue(undefined)
      service.register([GrantStrategyStub])
      expect(service['registry']).toEqual({})
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(getSpy).toHaveBeenCalledWith(GrantStrategyStub, { strict: false })
    })
  })
  describe('validate', () => {
    it('should throw a error when not have a registered strategy', async () => {
      const payload = createMock<OAuth2Payload>({
        grantType: GrantType.PASSWORD
      })
      await expect(service.validate(payload)).rejects.toThrow(Oauth2StrategyNotFoundException)
    })
    it('should validate when has a strategy registered', async () => {
      const strategySpy = jest.spyOn(GrantStrategyStub.prototype, 'validate')
      const payload = createMock<OAuth2Payload>({
        grantType: GrantType.CLIENT_CREDENTIALS
      })
      const result = await service.validate(payload)
      expect(result).toBeTruthy()
      expect(strategySpy).toHaveBeenCalledTimes(1)
      expect(strategySpy).toHaveBeenCalledWith(payload)
    })
  })
  describe('getOauth2Response', () => {
    it('should throw a error when no have strategies registered for grant type', async () => {
      const payload = createMock<OAuth2Payload>({
        grantType: GrantType.PASSWORD
      })
      await expect(service.getOauth2Response(payload)).rejects.toThrow(Oauth2StrategyNotFoundException)
    })
    it('should return a response when success', async () => {
      const strategySpy = jest.spyOn(service['registry'][GrantType.CLIENT_CREDENTIALS], 'getOauth2Response')
      const payload = createMock<OAuth2Payload>({
        grantType: GrantType.CLIENT_CREDENTIALS
      })
      const result = await service.getOauth2Response(payload)
      expect(result).toBeInstanceOf(OAuth2Response)
      expect(strategySpy).toHaveBeenCalledTimes(1)
      expect(strategySpy).toHaveBeenCalledWith(payload)
    })
  })
})
