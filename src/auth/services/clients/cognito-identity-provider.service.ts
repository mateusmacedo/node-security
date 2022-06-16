import { IDENTITY_PROVIDER_METADATA } from '@app/auth/constants'
import { OAuth2Request } from '@app/auth/dtos'
import { IdentifyProviderClient, IdentityProviderClient, StrategyRegistry } from '@app/auth/interfaces'
import { IdentityProviderService } from '@app/auth/services'
import { Injectable, Type } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'

type IdentityProviderClientType = Type<IdentifyProviderClient>
@Injectable()
export class CognitoIdentityProviderService
  extends IdentityProviderService
  implements StrategyRegistry<IdentityProviderClientType>
{
  private registry: { [s: string]: IdentifyProviderClient } = {}

  constructor(private readonly moduleRef: ModuleRef) {
    super()
  }

  register(strategies): void {
    strategies.forEach((strategy) => {
      const instance = this.moduleRef.get(strategy, {
        strict: false
      })
      if (!instance) {
        return
      }
      const strategyName = Reflect.getMetadata(IDENTITY_PROVIDER_METADATA, strategy)
      this.registry[strategyName] = instance as IdentifyProviderClient
    })
  }

  async createAccessToken(request: OAuth2Request): Promise<unknown> {
    throw new Error('Method not implemented.')
  }

  identifyClient(data: Partial<IdentityProviderClient>): Promise<IdentityProviderClient> {
    throw new Error('Method not implemented.')
  }
}
