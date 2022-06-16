import { IDENTITY_PROVIDER_METADATA } from '@app/auth/constants'
import { OAuth2Request } from '@app/auth/dtos'
import { CognitoIdentityProviderClientWithPoolId, IdentityProviderClient, StrategyRegistry } from '@app/auth/interfaces'
import { IdentityProviderService } from '@app/auth/services'
import {
  DescribeUserPoolClientCommand,
  DescribeUserPoolClientCommandInput
} from '@aws-sdk/client-cognito-identity-provider'
import { Injectable, Type } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'

type CognitoIdentityProviderClientType = Type<CognitoIdentityProviderClientWithPoolId>
@Injectable()
export class CognitoIdentityProviderService
  extends IdentityProviderService
  implements StrategyRegistry<CognitoIdentityProviderClientType>
{
  private registry: { [s: string]: CognitoIdentityProviderClientWithPoolId } = {}

  constructor(private readonly moduleRef: ModuleRef) {
    super()
  }

  register(strategies: CognitoIdentityProviderClientType[]): void {
    strategies.forEach((strategy) => {
      const instance = this.moduleRef.get(strategy, {
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

  async identifyClient(data: Partial<IdentityProviderClient>): Promise<IdentityProviderClient> {
    const { identityContext, clientId } = data
    const identifyClientCommandInput: DescribeUserPoolClientCommandInput = {
      UserPoolId: this.registry[identityContext].getUserPoolId(),
      ClientId: clientId
    }
    const identifyClientCommand = new DescribeUserPoolClientCommand(identifyClientCommandInput)
    const result = await this.registry[identityContext].getClient().send(identifyClientCommand)
    return {
      allowedAuthFlow: result.UserPoolClient.AllowedOAuthFlows,
      clientId: result.UserPoolClient.ClientId,
      clientName: result.UserPoolClient.ClientName,
      clientScopes: result.UserPoolClient.AllowedOAuthScopes,
      clientSecret: result.UserPoolClient.ClientSecret
    } as IdentityProviderClient
  }
}
