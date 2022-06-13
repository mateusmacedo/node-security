import { BadGatewayException } from '@nestjs/common'

export class Oauth2StrategyNotFoundException extends BadGatewayException {
  constructor(public readonly strategy: string) {
    super(`Cannot find the a strategy for the grant type "${strategy}"`)
  }
}
