import { GrantType } from '@app/auth/enums'
import { BadRequestException } from '@nestjs/common'

export class InvalidGrantTypeException extends BadRequestException {
  constructor(grantType: GrantType) {
    super(`Invalid for the grant type ${grantType}`)
  }
}
