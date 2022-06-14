export interface IdentityProviderClient {
  clientId: string
  clientSecret?: string
  clientName?: string
  clientScopes?: string[]
}
