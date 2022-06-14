import { IdentityProviderClient } from '@app/auth/interfaces'

export interface IdentifyProviderClient {
  identifyClient(data: IdentityProviderClient): Promise<IdentityProviderClient>
}
