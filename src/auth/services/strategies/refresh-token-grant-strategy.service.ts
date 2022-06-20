import { OAuth2Response } from '@app/auth/dtos'
import { GrantType } from '@app/auth/enums'
import { InvalidClientCredentialsException, InvalidClientScopesException } from '@app/auth/errors'
import { IdentityProviderClientType, IdentityProviderInterface, OAuth2Payload } from '@app/auth/interfaces'
import { AbstractIdentityProviderService } from '@app/auth/services/providers/abstract'
import { AbstractGrantStrategy, GrantStrategyDecorator } from '@app/auth/services/strategies'
import { Injectable } from '@nestjs/common'

@GrantStrategyDecorator(GrantType.REFRESH_TOKEN)
@Injectable()
export class RefreshTokenGrantStrategyService extends AbstractGrantStrategy {
  constructor(private readonly identityProvider: AbstractIdentityProviderService<IdentityProviderClientType>) {
    super()
  }
  private validateCredentials(request: OAuth2Payload, client: IdentityProviderInterface): Promise<boolean> {
    if (request.clientSecret !== client.clientSecret) {
      throw new InvalidClientCredentialsException()
    }
    const requestScopes = typeof request.scopes === 'string' ? [request.scopes] : request.scopes
    if (!requestScopes.every((scope) => client.clientScopes.includes(scope))) {
      throw new InvalidClientScopesException()
    }
    return Promise.resolve(true)
  }
  async validate(request: OAuth2Payload): Promise<boolean> {
    const { clientId, identityContext } = request
    const clientIdentified = await this.identityProvider.identifyClient({ clientId, identityContext })
    if (!clientIdentified) {
      throw new InvalidClientCredentialsException()
    }
    return this.validateCredentials(request, clientIdentified)
  }
  async getOauth2Response(request: OAuth2Payload): Promise<OAuth2Response> {
    return this.identityProvider.createAccessToken(request) as Promise<OAuth2Response>
  }
}
