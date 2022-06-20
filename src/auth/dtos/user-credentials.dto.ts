import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsOptional } from 'class-validator'

export class UserCredentialsDto {
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
}
