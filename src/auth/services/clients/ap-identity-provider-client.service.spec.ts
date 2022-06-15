import { ApIdentityProviderClientService } from '@app/auth/services/clients'
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'
import { ConfigModule } from '@nestjs/config'
import { Test } from '@nestjs/testing'

describe('ApIdentityProviderClientService', () => {
  let apIdentityProviderClientService: ApIdentityProviderClientService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [ApIdentityProviderClientService],
      providers: []
    }).compile()

    apIdentityProviderClientService = moduleRef.get<ApIdentityProviderClientService>(ApIdentityProviderClientService)
  })

  it('should be a derived instance of CognitoIdentityProviderClient', () => {
    expect(apIdentityProviderClientService).toBeDefined()
    expect(apIdentityProviderClientService).toBeInstanceOf(CognitoIdentityProviderClient)
  })
})
