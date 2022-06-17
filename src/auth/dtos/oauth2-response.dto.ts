import { IdentityContext } from '@app/auth/enums'
import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

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
  @IsNotEmpty()
  accessToken: string

  @ApiProperty({
    type: String,
    description: 'The type of token, in our case should always be "bearer"',
    required: true
  })
  @Expose({ name: 'token_type' })
  @IsNotEmpty()
  tokenType = 'bearer'

  @ApiProperty({
    type: String,
    description: 'The generated refresh token',
    required: true
  })
  @Expose({ name: 'refresh_token' })
  @IsNotEmpty()
  refreshToken: string

  @ApiProperty({
    type: Number,
    description: 'Number of seconds until the access token expires',
    required: true
  })
  @Expose({ name: 'expires_in' })
  @IsNotEmpty()
  accessTokenExp: number

  @ApiProperty({
    type: Number,
    description: 'Number of seconds until the refresh token expires',
    required: true
  })
  @Exclude()
  @IsNotEmpty()
  refreshTokenExp?: number

  @ApiProperty({
    type: String,
    description: 'Scopes you are allowed to use if any requested',
    required: true
  })
  @Expose({ name: 'scope' })
  @IsNotEmpty()
  scopes: string

  @ApiProperty({
    enum: IdentityContext,
    description: 'The identity context',
    required: true
  })
  @Expose({ name: 'identity_context' })
  @IsNotEmpty()
  identityContext: IdentityContext
}
