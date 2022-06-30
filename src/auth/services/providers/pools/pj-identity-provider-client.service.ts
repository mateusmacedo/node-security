import { IdentityContext } from '@app/auth/enums'
import { IdentityProviderClientInterface } from '@app/auth/interfaces'
import { IdentityProviderDecorator } from '@app/auth/services/providers/decorator'
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
@IdentityProviderDecorator(IdentityContext.PJ)
export class PjIdentityProviderClientService implements IdentityProviderClientInterface {
  constructor(
    @Inject('PJ_USER_POOL_ID') private readonly userPoolId: string,
    @Inject('PJ_PROVIDER_CLIENT') private readonly client: CognitoIdentityProviderClient
  ) {}
  getUserPoolId(): string {
    return this.userPoolId
  }
  getClient(): CognitoIdentityProviderClient {
    return this.client
  }
}
