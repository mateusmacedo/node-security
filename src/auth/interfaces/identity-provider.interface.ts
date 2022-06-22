import { IdentityContext } from '@app/auth/enums'

export interface IdentityProviderInterface {
  allowedAuthFlow: string[]
  clientId: string
  clientSecret: string
  clientName: string
  clientScopes: string[]
  identityContext?: IdentityContext
}
