import { BadRequestException } from '@nestjs/common'

export class InvalidClientCredentialsException extends BadRequestException {
  constructor() {
    super('Invalid client credentials')
  }
}
