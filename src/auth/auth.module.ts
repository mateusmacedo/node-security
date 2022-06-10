import { Oauth2Controller } from '@app/auth/oauth/oauth.controller'
import { Module } from '@nestjs/common'

@Module({
  controllers: [Oauth2Controller]
})
export class AuthModule {}
