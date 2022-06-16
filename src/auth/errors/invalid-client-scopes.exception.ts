import { BadRequestException } from '@nestjs/common'

export class InvalidClientScopesException extends BadRequestException {
  constructor() {
    super('Invalid client scopes')
  }
}
