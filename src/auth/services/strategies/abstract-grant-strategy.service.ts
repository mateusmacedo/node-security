import { OAuth2Request, OAuth2Response } from '@app/auth/dtos'
import { Oauth2GrantStrategyInterface } from '@app/auth/interfaces'
import { Injectable } from '@nestjs/common'

@Injectable()
export abstract class AbstractGrantStrategy implements Oauth2GrantStrategyInterface {
  abstract validate(request: OAuth2Request): Promise<boolean>
  abstract getOauth2Response(request: OAuth2Request): Promise<OAuth2Response>
}
