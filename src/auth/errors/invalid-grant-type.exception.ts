import { BadRequestException } from '@nestjs/common'

export class InvalidGrantTypeException extends BadRequestException {
  constructor() {
    super('Invalid grant type')
  }
}
