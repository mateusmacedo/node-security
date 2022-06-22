import { BadRequestException } from '@nestjs/common'

export class InvalidContextException extends BadRequestException {
  constructor(context: string) {
    super(`Invalid context for the context ${context}`)
  }
}
