import { OAuth2Request, OAuth2Response } from '@app/auth/dtos'
import { IdentityProviderClient } from '@app/auth/interfaces'
import { IdentityProviderService } from '@app/auth/services'
import { AbstractGrantStrategy } from '@app/auth/services/strategies'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ClientCredentialGrantStrategyService extends AbstractGrantStrategy {
  constructor(private readonly identityProvider: IdentityProviderService) {
    super()
  }
  private validateCredentials(request: OAuth2Request, client: IdentityProviderClient): Promise<boolean> {
    if (client.clientSecret !== request.clientSecret || request.identityContext !== client.identityContext) {
      throw new Error('Invalid client credentials')
    }
    if (!client.allowedAuthFlow.includes(request.grantType)) {
      throw new Error('Client not allowed to use this grant type')
    }
    const requestScopes = typeof request.scopes === 'string' ? [request.scopes] : request.scopes
    if (!requestScopes.every((scope) => client.clientScopes.includes(scope))) {
      throw new Error('Invalid client scopes')
    }
    return Promise.resolve(true)
  }
  async validate(request: OAuth2Request): Promise<boolean> {
    const { clientId, identityContext } = request
    const clientIdentified = await this.identityProvider.identifyClient({ clientId, identityContext })
    if (!clientIdentified) {
      throw new Error('Client not found')
    }
    return this.validateCredentials(request, clientIdentified)
  }
  getOauth2Response(request: OAuth2Request): Promise<OAuth2Response> {
    throw new Error('Method not implemented.')
  }
}
