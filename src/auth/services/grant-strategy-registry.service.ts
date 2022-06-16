import { GRANT_STRATEGY_METADATA } from '@app/auth/constants'
import { OAuth2Request, OAuth2Response } from '@app/auth/dtos'
import { Oauth2StrategyNotFoundException } from '@app/auth/errors'
import { GrantStrategyInterface, StrategyRegistryInterface } from '@app/auth/interfaces'
import { Injectable, Type } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'

type GrantStrategyInterfaceType = Type<GrantStrategyInterface>

@Injectable()
export class GrantStrategyRegistry
  implements StrategyRegistryInterface<GrantStrategyInterfaceType>, GrantStrategyInterface
{
  private registry: { [s: string]: GrantStrategyInterface } = {}

  constructor(protected readonly moduleRef: ModuleRef) {}

  register(strategies: GrantStrategyInterfaceType[]): void {
    strategies.forEach((strategy: GrantStrategyInterfaceType) => {
      const instance = this.moduleRef.get(strategy, {
        strict: false
      })
      if (!instance) {
        return
      }
      const strategyName = Reflect.getMetadata(GRANT_STRATEGY_METADATA, strategy)
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
