import { OAuth2Request, OAuth2Response } from '@app/auth/dtos'
import { InvalidGrantTypeException } from '@app/auth/errors'
import { Oauth2GrantStrategyRegistry } from '@app/auth/services'
import { BadRequestException, Controller, InternalServerErrorException, Post, Query } from '@nestjs/common'

@Controller('oauth2')
export class Oauth2Controller {
  constructor(private readonly strategyRegistry: Oauth2GrantStrategyRegistry) {}

  @Post('token')
  async token(@Query() request: OAuth2Request): Promise<OAuth2Response> {
    try {
      if (!(await this.strategyRegistry.validate(request))) {
        throw new InvalidGrantTypeException()
      }
      return this.strategyRegistry.getOauth2Response(request)
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err
      }
      throw new InternalServerErrorException('We have a problem')
    }
  }
}
