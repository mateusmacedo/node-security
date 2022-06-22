import { IdentityProviderInterface, OAuth2Payload } from '@app/auth/interfaces'

export interface IdentityProviderServiceInterface {
  identifyClient(data: IdentityProviderInterface): Promise<IdentityProviderInterface>
  createAccessToken(request: OAuth2Payload): Promise<unknown>
}
