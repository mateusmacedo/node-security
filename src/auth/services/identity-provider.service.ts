import { IdentifyProviderClient, IdentityProviderClient } from '@app/auth/interfaces'
import { Injectable } from '@nestjs/common'

@Injectable()
export abstract class IdentityProviderService implements IdentifyProviderClient {
  abstract identifyClient(data: Partial<IdentityProviderClient>): Promise<IdentityProviderClient>
}
