import { IdentityContext } from '@app/auth/enums'
import { CognitoIdentityProviderClientWithPoolId } from '@app/auth/interfaces'
import { IdentityProvider } from '@app/auth/services/clients/decorator'
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
@IdentityProvider(IdentityContext.AP)
export class ApIdentityProviderClientService implements CognitoIdentityProviderClientWithPoolId {
  constructor(
    @Inject('AP_USER_POOL_ID') private readonly userPoolId: string,
    @Inject('AP_PROVIDER_CLIENT') private readonly client: CognitoIdentityProviderClient
  ) {}
  getUserPoolId(): string {
    return this.userPoolId
  }
  getClient(): CognitoIdentityProviderClient {
    return this.client
  }
}
