import { OAuth2Request, OAuth2Response, UserCredentialsDto } from '@app/auth/dtos'
import { IdentityContext } from '@app/auth/enums'
import { InvalidGrantTypeException } from '@app/auth/errors'
import { GrantStrategyRegistry } from '@app/auth/services'
import { LogExecution } from '@app/common/decorators'
import { Counter, Span } from '@metinseylan/nestjs-opentelemetry'
import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  InternalServerErrorException,
  Post,
  Query
} from '@nestjs/common'

@Controller('oauth2')
export class Oauth2Controller {
  constructor(private readonly strategyRegistry: GrantStrategyRegistry) {}

  @Post('token')
  @Span('token')
  @Counter()
  @LogExecution()
  async token(
    @Headers('x-identity-context') identityContext: IdentityContext,
    @Query() request: OAuth2Request,
    @Body() userCredentials: UserCredentialsDto
  ): Promise<OAuth2Response> {
    try {
      const requestMerged = Object.assign(request, userCredentials, { identityContext })
      if (!(await this.strategyRegistry.validate(requestMerged))) {
        throw new InvalidGrantTypeException(requestMerged.grantType)
      }
      return this.strategyRegistry.getOauth2Response(requestMerged)
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err
      }
      throw new InternalServerErrorException('We have a problem')
    }
  }
}
