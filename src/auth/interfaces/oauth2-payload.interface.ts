import { GrantType, IdentityContext } from '@app/auth/enums'

export interface OAuth2Payload {
  grantType: GrantType

  clientId: string

  clientSecret: string

  scopes: string | string[]

  refreshToken?: string

  username?: string

  password?: string

  exp?: number

  iat?: number

  identityContext: IdentityContext
}
