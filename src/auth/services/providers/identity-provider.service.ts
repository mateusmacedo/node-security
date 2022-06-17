import { IDENTITY_PROVIDER_METADATA } from '@app/auth/constants'
import { OAuth2Request } from '@app/auth/dtos'
import { InvalidContextException } from '@app/auth/errors'
import {
  IdentityProviderClientInterface,
  IdentityProviderClientType,
  IdentityProviderInterface
} from '@app/auth/interfaces'
import { AbstractIdentityProviderService } from '@app/auth/services/providers/abstract'
import {
  DescribeUserPoolClientCommand,
  DescribeUserPoolClientCommandInput
} from '@aws-sdk/client-cognito-identity-provider'
import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'

@Injectable()
export class IdentityProviderService extends AbstractIdentityProviderService<IdentityProviderClientType> {
  private registry: { [s: string]: IdentityProviderClientInterface } = {}

  constructor(private readonly moduleRef: ModuleRef) {
    super()
  }

  register(strategies: IdentityProviderClientType[]): void {
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

  async identifyClient(data: Partial<IdentityProviderInterface>): Promise<IdentityProviderInterface> {
    const { identityContext, clientId } = data
    if (!(identityContext in this.registry)) {
      throw new InvalidContextException(identityContext)
    }
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
    } as IdentityProviderInterface
  }
}
