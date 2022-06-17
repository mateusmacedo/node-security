import { GrantType, IdentityContext } from '@app/auth/enums'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class OAuth2Request {
  @ApiProperty({
    enum: GrantType,
    description: 'The type of grant you are requesting, must be "client_credentials"',
    required: true
  })
  @Expose({ name: 'grant_type' })
  @IsNotEmpty()
  grantType: GrantType

  @ApiProperty({
    type: String,
    description: 'The API Key given by the application',
    required: true
  })
  @Expose({ name: 'client_id' })
  @IsNotEmpty()
  clientId: string

  @ApiProperty({
    type: String,
    description: 'The API Token given by the application',
    required: true
  })
  @Expose({ name: 'client_secret' })
  @IsNotEmpty()
  clientSecret: string

  @ApiProperty({
    type: Number,
    description:
      'The expiration time of the assertion, specified as seconds since 00:00:00 UTC, January 1, 1970. This value has a maximum of 1 hour after the issued time.'
  })
  @Expose({ name: 'exp' })
  @IsOptional()
  exp?: number

  @ApiProperty({
    type: Number,
    description: 'The time the assertion was issued, specified as seconds since 00:00:00 UTC, January 1, 1970.'
  })
  @Expose({ name: 'iat' })
  @IsOptional()
  iat?: number

  @ApiProperty({
    type: String,
    description: 'The list of the permissions (tpApps) that the application requests.',
    isArray: true
  })
  @Expose({ name: 'scopes' })
  @IsNotEmpty()
  scopes: string | string[]

  @ApiProperty({
    type: String,
    description: 'The refresh token only when grant_type is set to "refresh_token"'
  })
  @Expose({ name: 'refresh_token' })
  @IsOptional()
  refreshToken?: string

  @ApiProperty({
    type: String,
    description: 'The username only when grant_type is set to "password_grant"'
  })
  @Expose({ name: 'username' })
  @IsOptional()
  username?: string

  @ApiProperty({
    type: String,
    description: 'The password when grant_type is set to "password_grant"'
  })
  @Expose({ name: 'password' })
  @IsOptional()
  password?: string

  @ApiProperty({
    enum: IdentityContext,
    description: 'The identity context"'
  })
  @Expose({ name: 'identity_context' })
  @IsNotEmpty()
  identityContext: IdentityContext
}
