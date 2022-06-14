import { OAuth2Request, OAuth2Response } from '@app/auth/dtos'
import { IdentityProviderService } from '@app/auth/services'
import { AbstractGrantStrategy } from '@app/auth/services/strategies'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ClientCredentialGrantStrategyService extends AbstractGrantStrategy {
  constructor(private readonly identityProvider: IdentityProviderService) {
    super()
  }
  async validate(request: OAuth2Request): Promise<boolean> {
    const { clientId, clientSecret, identityContext } = request
    const clientFound = await this.identityProvider.identifyClient({ clientId, clientSecret, identityContext })
    if (!clientFound) {
      throw new Error('Client not found')
    }
    return true
  }
  getOauth2Response(request: OAuth2Request): Promise<OAuth2Response> {
    throw new Error('Method not implemented.')
  }
}
