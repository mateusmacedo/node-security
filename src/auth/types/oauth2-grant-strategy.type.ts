import { GrantStrategyInterface } from '@app/auth/interfaces'
import { Type } from '@nestjs/common'

export type Oauth2GrantStrategyType = Type<GrantStrategyInterface>
