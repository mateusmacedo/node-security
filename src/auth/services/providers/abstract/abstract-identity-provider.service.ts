import { OAuth2Request } from '@app/auth/dtos'
import {
  IdentityProviderInterface,
  IdentityProviderServiceInterface,
  StrategyRegistryInterface
} from '@app/auth/interfaces'
import { Injectable } from '@nestjs/common'

@Injectable()
export abstract class AbstractIdentityProviderService<T>
  implements IdentityProviderServiceInterface, StrategyRegistryInterface<T>
{
  abstract register(strategies: T[]): void
  abstract createAccessToken(request: OAuth2Request): Promise<unknown>
  abstract identifyClient(data: Partial<IdentityProviderInterface>): Promise<IdentityProviderInterface>
}
