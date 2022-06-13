import { OAUTH2_STRATEGY_METADATA } from '@app/auth/constants'
import { OAuth2Request, OAuth2Response } from '@app/auth/dtos'
import { Oauth2StrategyNotFoundException } from '@app/auth/exceptions'
import { Oauth2GrantStrategyInterface } from '@app/auth/interfaces'
import { Oauth2GrantStrategyType } from '@app/auth/types'
import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'

@Injectable()
export class Oauth2GrantStrategyRegistry {
  private registry: { [s: string]: Oauth2GrantStrategyInterface } = {}

  constructor(private readonly moduleRef: ModuleRef) {}

  register(strategies: Oauth2GrantStrategyType[]) {
    strategies.forEach((strategy) => {
      const instance: Oauth2GrantStrategyInterface = this.moduleRef.get(strategy, { strict: false })
      if (!instance) {
        return
      }
      const strategyName = Reflect.getMetadata(OAUTH2_STRATEGY_METADATA, strategy)
      this.registry[strategyName] = instance
    })
  }

  async validate(request: OAuth2Request): Promise<boolean> {
    if (!(request.grantType in this.registry)) {
      throw new Oauth2StrategyNotFoundException(request.grantType)
    }
    return this.registry[request.grantType].validate(request)
  }

  async getOauth2Response(request: OAuth2Request): Promise<OAuth2Response> {
    if (!(request.grantType in this.registry)) {
      throw new Oauth2StrategyNotFoundException(request.grantType)
    }
    return this.registry[request.grantType].getOauth2Response(request)
  }
}
