import { OAuth2Request } from '@app/auth/dtos'
import { IdentifyProviderClient, IdentityProviderClient } from '@app/auth/interfaces'
import { Injectable } from '@nestjs/common'

@Injectable()
export abstract class IdentityProviderService implements IdentifyProviderClient {
  abstract createAccessToken(request: OAuth2Request): Promise<unknown>
  abstract identifyClient(data: Partial<IdentityProviderClient>): Promise<IdentityProviderClient>
}
