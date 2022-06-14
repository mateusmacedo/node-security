import { IdentityContext } from '@app/auth/enums'
import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

/**
 * Main object used to transport data
 */
export class OAuth2Response {
  @ApiProperty({
    type: String,
    description: 'The generated access token',
    required: true
  })
  @Expose({ name: 'access_token' })
  accessToken: string

  @ApiProperty({
    type: String,
    description: 'The type of token, in our case should always be "bearer"',
    required: true
  })
  @Expose({ name: 'token_type' })
  tokenType = 'bearer'

  @ApiProperty({
    type: String,
    description: 'The generated refresh token',
    required: true
  })
  @Expose({ name: 'refresh_token' })
  refreshToken: string

  @ApiProperty({
    type: Number,
    description: 'Number of seconds until the access token expires',
    required: true
  })
  @Expose({ name: 'expires_in' })
  accessTokenExp: number

  @ApiProperty({
    type: Number,
    description: 'The list of the permissions (tpApps) that the application requests.',
    required: true
  })
  @Exclude()
  refreshTokenExp: number

  @ApiProperty({
    type: String,
    description: 'Scopes you are allowed to use if any requested',
    required: true
  })
  @Expose({ name: 'scope' })
  scope?: string

  @ApiProperty({
    type: IdentityContext,
    description: 'The password when grant_type is set to "password_grant"'
  })
  @Expose({ name: 'identity_context' })
  identityContext?: IdentityContext

  constructor(
    accessToken: string,
    refreshToken: string,
    accessTokenExp: number,
    refreshTokenExp: number,
    scope?: string
  ) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    this.accessTokenExp = accessTokenExp
    this.refreshTokenExp = refreshTokenExp
    this.scope = scope
  }
}
