export interface IdentityProviderAccessTokenInterface {
  accessToken: string
  tokenType: string
  refreshToken: string
  accessTokenExp: number
  idToken: string
}
