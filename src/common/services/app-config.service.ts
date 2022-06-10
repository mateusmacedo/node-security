import { AppConfigService as IAppConfigService } from '@app/common/interfaces/app-config.interface'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AppConfigService implements IAppConfigService {
  constructor(private readonly configService: ConfigService) {}
  getName(): string {
    return this.configService.get('app.name')
  }
  getDescription(): string {
    return this.configService.get('app.description')
  }
  getVersion(): string {
    return this.configService.get('app.version')
  }
  getPort(): number {
    return this.configService.get('app.port')
  }
}
