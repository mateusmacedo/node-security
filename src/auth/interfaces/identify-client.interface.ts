import { IdentityProviderClient } from '@app/auth/interfaces'

export interface IdentifyProviderClient {
  identifyClient(clientId: string): Promise<IdentityProviderClient>
}
