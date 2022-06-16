import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'

export interface IdentityProviderClientInterface {
  getUserPoolId(): string
  getClient(): CognitoIdentityProviderClient
}
