import { GrantType } from '@app/auth/enums'
import { BadRequestException } from '@nestjs/common'

export class Oauth2StrategyNotFoundException extends BadRequestException {
  constructor(public readonly grantType: GrantType) {
    super(`Cannot find the a strategy for the grant type ${grantType}`)
  }
}
