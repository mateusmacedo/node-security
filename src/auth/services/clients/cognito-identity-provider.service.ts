import { IDENTITY_PROVIDER_METADATA } from '@app/auth/constants'
import { OAuth2Request } from '@app/auth/dtos'
import { IdentityProviderClient, StrategyRegistry } from '@app/auth/interfaces'
import { IdentityProviderService } from '@app/auth/services'
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'
import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'

@Injectable()
export class CognitoIdentityProviderService extends IdentityProviderService implements StrategyRegistry {
  private registry: { [s: string]: CognitoIdentityProviderClient } = {}

  constructor(private readonly moduleRef: ModuleRef) {
    super()
  }

  register<CognitoIdentityProviderClient>(strategies: CognitoIdentityProviderClient[]): void {
    strategies.forEach((strategy: CognitoIdentityProviderClient) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const instance = this.moduleRef.get(strategy as any, {
        strict: false
      })
      if (!instance) {
        return
      }
      const strategyName = Reflect.getMetadata(IDENTITY_PROVIDER_METADATA, strategy)
      this.registry[strategyName] = instance
    })
  }

  async createAccessToken(request: OAuth2Request): Promise<unknown> {
    throw new Error('Method not implemented.')
  }

  identifyClient(data: Partial<IdentityProviderClient>): Promise<IdentityProviderClient> {
    throw new Error('Method not implemented.')
  }
}
