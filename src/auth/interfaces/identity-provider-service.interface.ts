import { OAuth2Request } from '@app/auth/dtos'
import { IdentityProviderInterface } from '@app/auth/interfaces'

export interface IdentityProviderServiceInterface {
  identifyClient(data: IdentityProviderInterface): Promise<IdentityProviderInterface>
  createAccessToken(request: OAuth2Request): Promise<unknown>
}
