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
    await this.identityProvider.identifyClient(request.clientId)
    return true
  }
  getOauth2Response(request: OAuth2Request): Promise<OAuth2Response> {
    throw new Error('Method not implemented.')
  }
}
