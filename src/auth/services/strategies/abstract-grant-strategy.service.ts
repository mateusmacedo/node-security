import { OAuth2Response } from '@app/auth/dtos'
import { GrantStrategyInterface, OAuth2Payload } from '@app/auth/interfaces'
import { Injectable } from '@nestjs/common'

@Injectable()
export abstract class AbstractGrantStrategy implements GrantStrategyInterface {
  abstract validate(request: OAuth2Payload): Promise<boolean>
  abstract getOauth2Response(request: OAuth2Payload): Promise<OAuth2Response>
}
