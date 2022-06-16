import { Oauth2Controller } from '@app/auth/controllers/auth.controller'
import { Oauth2GrantStrategyRegistry } from '@app/auth/services/strategies'
import { Module } from '@nestjs/common'

@Module({
  controllers: [Oauth2Controller],
  providers: [Oauth2GrantStrategyRegistry]
})
export class AuthModule {}
