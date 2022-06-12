import { Oauth2GrantStrategyInterface } from '@app/auth/interfaces/oauth2-grant-strategy.interface'
import { Type } from '@nestjs/common'

export interface Oauth2StrategyOptions {
  strategies: Type<Oauth2GrantStrategyInterface>[]
}
