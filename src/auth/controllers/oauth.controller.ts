import { OAuth2Request, OAuth2Response } from '@app/auth/dto'
import { Oauth2GrantStrategyRegistryService } from '@app/auth/strategies'
import { Controller, InternalServerErrorException, Post, Query } from '@nestjs/common'

@Controller('oauth2')
export class Oauth2Controller {
  constructor(private readonly strategyRegistry: Oauth2GrantStrategyRegistryService) {}

  @Post('token')
  async token(@Query() request: OAuth2Request): Promise<OAuth2Response> {
    try {
      if (!(await this.strategyRegistry.validate(request))) {
        throw new Error('Invalid grant type')
      }
      return this.strategyRegistry.getOauth2Response(request)
    } catch (err) {
      throw new InternalServerErrorException()
    }
  }
}
