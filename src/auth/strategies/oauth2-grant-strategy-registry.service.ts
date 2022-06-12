import { OAUTH2_STRATEGY_METADATA } from '@app/auth/constants'
import { OAuth2Request, OAuth2Response } from '@app/auth/dtos'
import { Oauth2GrantStrategyInterface } from '@app/auth/interfaces'
import { Oauth2GrantStrategyType } from '@app/auth/types'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'

@Injectable()
export class Oauth2GrantStrategyRegistry {
  private registry: { [s: string]: Oauth2GrantStrategyInterface } = {}

  constructor(private readonly moduleRef: ModuleRef) {}

  private reflectStrategyName(strategy: Oauth2GrantStrategyType): string {
    return Reflect.getMetadata(OAUTH2_STRATEGY_METADATA, strategy)
  }

  protected registerStrategy(strategy: Oauth2GrantStrategyType): void {
    const instance: Oauth2GrantStrategyInterface = this.moduleRef.get(strategy, { strict: false })
    if (!instance) {
      return
    }
    const strategyName = this.reflectStrategyName(strategy)
    this.registry[strategyName] = instance
  }

  register(strategies: Oauth2GrantStrategyType[] = []) {
    strategies.forEach((strategy) => this.registerStrategy(strategy))
  }

  async validate(request: OAuth2Request): Promise<boolean> {
    if (!(request.grantType in this.registry)) {
      throw new BadRequestException(`Cannot find the a strategy for the grant type "${request.grantType}"`)
    }
    return this.registry[request.grantType].validate(request)
  }

  async getOauth2Response(request: OAuth2Request): Promise<OAuth2Response> {
    if (!(request.grantType in this.registry)) {
      throw new BadRequestException(`Cannot find the a strategy for the grant type "${request.grantType}"`)
    }
    throw new Error('Method not implemented.')
  }
}
