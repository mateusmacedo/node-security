import { Oauth2Controller } from '@app/auth/controllers/oauth.controller'
import { Oauth2GrantStrategyRegistry } from '@app/auth/strategies'
import { Module } from '@nestjs/common'

@Module({
  controllers: [Oauth2Controller],
  providers: [Oauth2GrantStrategyRegistry]
})
export class AuthModule {}
