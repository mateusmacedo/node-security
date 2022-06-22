import { JwtTokenInterface } from '@app/auth/interfaces'
import { LogExecution } from '@app/common/decorators'
import { Counter, Span } from '@metinseylan/nestjs-opentelemetry'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { passportJwtSecret } from 'jwks-rsa'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: configService.get<string>('AWS_COGNITO_AP_USER_POOL_JWKS_URL')
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ['RS256']
    })
  }

  @Span()
  @Counter()
  @LogExecution()
  public async validate(payload: JwtTokenInterface) {
    return payload !== undefined
  }
}
