import { OAuth2Response } from '@app/auth/dtos'
import { OAuth2Payload } from '@app/auth/interfaces'

export interface GrantStrategyInterface {
  validate(request: OAuth2Payload): Promise<boolean>

  getOauth2Response(request: OAuth2Payload): Promise<OAuth2Response>
}
