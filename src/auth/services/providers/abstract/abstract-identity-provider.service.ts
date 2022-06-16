import { OAuth2Request } from '@app/auth/dtos'
import { IdentityProviderInterface, IdentityProviderServiceInterface } from '@app/auth/interfaces'
import { Injectable } from '@nestjs/common'

@Injectable()
export abstract class AbstractIdentityProviderService implements IdentityProviderServiceInterface {
  abstract createAccessToken(request: OAuth2Request): Promise<unknown>
  abstract identifyClient(data: Partial<IdentityProviderInterface>): Promise<IdentityProviderInterface>
}
