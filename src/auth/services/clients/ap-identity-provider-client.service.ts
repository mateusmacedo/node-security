import { IdentityContext } from '@app/auth/enums'
import { IdentityProvider } from '@app/auth/services/clients/decorator'
import {
  CognitoIdentityProviderClient,
  CognitoIdentityProviderClientConfig
} from '@aws-sdk/client-cognito-identity-provider'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
@IdentityProvider(IdentityContext.AP)
export class ApIdentityProviderClientService extends CognitoIdentityProviderClient {
  constructor(configService: ConfigService) {
    const endpoint =
      configService.get('AWS_COGNITO_IDENTITY_PROVIDER_ENDPOINT') + configService.get('AWS_COGNITO_AP_USER_POOL_ID')
    const config: CognitoIdentityProviderClientConfig = {
      credentials: {
        accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY')
      },
      region: configService.get('AWS_DEFAULT_REGION'),
      endpoint
    }
    super(config)
  }
}
