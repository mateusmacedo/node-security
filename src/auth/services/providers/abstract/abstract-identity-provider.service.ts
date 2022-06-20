import {
  IdentityProviderInterface,
  IdentityProviderServiceInterface,
  OAuth2Payload,
  StrategyRegistryInterface
} from '@app/auth/interfaces'
import { Injectable } from '@nestjs/common'

@Injectable()
export abstract class AbstractIdentityProviderService<T>
  implements IdentityProviderServiceInterface, StrategyRegistryInterface<T>
{
  abstract register(strategies: T[]): void
  abstract createAccessToken(request: OAuth2Payload): Promise<unknown>
  abstract identifyClient(data: Partial<IdentityProviderInterface>): Promise<IdentityProviderInterface>
}
