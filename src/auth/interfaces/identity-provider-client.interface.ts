import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'
import { Type } from '@nestjs/common'

export type IdentityProviderClientType = Type<IdentityProviderClientInterface>

export interface IdentityProviderClientInterface {
  getUserPoolId(): string
  getClient(): CognitoIdentityProviderClient
}
