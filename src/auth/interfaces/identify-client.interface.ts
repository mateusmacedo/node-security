import { OAuth2Request } from '@app/auth/dtos'
import { IdentityProviderClient } from '@app/auth/interfaces'
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'

export interface CognitoIdentityProviderClientWithPoolId {
  getUserPoolId(): string
  getClient(): CognitoIdentityProviderClient
}
export interface IdentifyProviderClient {
  identifyClient(data: IdentityProviderClient): Promise<IdentityProviderClient>
  createAccessToken(request: OAuth2Request): Promise<unknown>
}
