import { OAuth2Request } from '@app/auth/dtos'
import { IdentityProviderClient } from '@app/auth/interfaces'

export interface IdentifyProviderClient {
  identifyClient(data: IdentityProviderClient): Promise<IdentityProviderClient>
  createAccessToken(request: OAuth2Request): Promise<unknown>
}
