import { OAUTH2_STRATEGY_METADATA } from '@app/auth/constants'
import { OAuth2Request, OAuth2Response } from '@app/auth/dtos'
import { Oauth2StrategyNotFoundException } from '@app/auth/exceptions'
import { Oauth2GrantStrategyInterface, StrategyRegistry } from '@app/auth/interfaces'
import { Injectable, Type } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'

type Oauth2GrantStrategyInterfaceType = Type<Oauth2GrantStrategyInterface>

@Injectable()
export class Oauth2GrantStrategyRegistry
  implements StrategyRegistry<Oauth2GrantStrategyInterfaceType>, Oauth2GrantStrategyInterface
{
  private registry: { [s: string]: Oauth2GrantStrategyInterface } = {}

  constructor(protected readonly moduleRef: ModuleRef) {}

  register(strategies: Oauth2GrantStrategyInterfaceType[]): void {
    strategies.forEach((strategy: Oauth2GrantStrategyInterfaceType) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const instance = this.moduleRef.get(strategy, {
        strict: false
      })
      if (!instance) {
        return
      }
      const strategyName = Reflect.getMetadata(OAUTH2_STRATEGY_METADATA, strategy)
      this.registry[strategyName] = instance
    })
  }
  private validateGrantType(request: OAuth2Request): boolean {
    if (!(request.grantType in this.registry)) {
      throw new Oauth2StrategyNotFoundException(request.grantType)
    }
    return true
  }

  async validate(request: OAuth2Request): Promise<boolean> {
    if (this.validateGrantType(request)) {
      return this.registry[request.grantType].validate(request)
    }
  }

  async getOauth2Response(request: OAuth2Request): Promise<OAuth2Response> {
    if (this.validateGrantType(request)) {
      return this.registry[request.grantType].getOauth2Response(request)
    }
  }
}
