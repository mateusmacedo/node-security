import { CommonModule } from '@app/common/common.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [
    CommonModule.register({
      configModule: {
        ignoreEnvFile: false,
        envFilePath: '.env',
        expandVariables: true,
        cache: true,
        isGlobal: true
      }
    })
  ],
  controllers: [],
  providers: []
})
export class MainModule {}
