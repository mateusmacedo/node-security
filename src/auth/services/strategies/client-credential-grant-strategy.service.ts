import { OAuth2Request, OAuth2Response } from '@app/auth/dtos'
import { InvalidClientScopesException, InvalidCredentialsException, InvalidGrantTypeException } from '@app/auth/errors'
import { IdentityProviderInterface } from '@app/auth/interfaces'
import { AbstractIdentityProviderService } from '@app/auth/services/providers/abstract'
import { AbstractGrantStrategy } from '@app/auth/services/strategies'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ClientCredentialGrantStrategyService extends AbstractGrantStrategy {
  constructor(private readonly identityProvider: AbstractIdentityProviderService) {
    super()
  }
  private validateCredentials(request: OAuth2Request, client: IdentityProviderInterface): Promise<boolean> {
    if (client.clientSecret !== request.clientSecret || request.identityContext !== client.identityContext) {
      throw new InvalidCredentialsException()
    }
    if (!client.allowedAuthFlow.includes(request.grantType)) {
      throw new InvalidGrantTypeException()
    }
    const requestScopes = typeof request.scopes === 'string' ? [request.scopes] : request.scopes
    if (!requestScopes.every((scope) => client.clientScopes.includes(scope))) {
      throw new InvalidClientScopesException()
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
  async getOauth2Response(request: OAuth2Request): Promise<OAuth2Response> {
    return this.identityProvider.createAccessToken(request) as Promise<OAuth2Response>
  }
}
