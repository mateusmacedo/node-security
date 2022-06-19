import { Controller, Get, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Controller('ap-protected')
export class ApProtectedController {
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async validateApJwtToken() {
    return 'Success validation'
  }
}
