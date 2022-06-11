import { OAuth2Request, OAuth2Response } from '@app/auth/dto'
import { Oauth2GrantStrategyRegistryService } from '@app/auth/strategies'
import { Controller, Post, Query } from '@nestjs/common'

@Controller('oauth2')
export class Oauth2Controller {
  constructor(private readonly grantStrategyRegistry: Oauth2GrantStrategyRegistryService) {}

  @Post('token')
  async token(@Query() request: OAuth2Request): Promise<OAuth2Response> {
    return undefined
  }
}
