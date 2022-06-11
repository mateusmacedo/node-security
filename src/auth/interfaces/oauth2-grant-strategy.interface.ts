import { OAuth2Request, OAuth2Response } from '@app/auth/dtos'

export interface Oauth2GrantStrategyInterface {
  validate(request: OAuth2Request): Promise<boolean>

  getOauth2Response(request: OAuth2Request): Promise<OAuth2Response>
}
