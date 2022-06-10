import { CommonModule } from '@app/common/common.module'
import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'

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
    }),
    AuthModule
  ],
  controllers: [],
  providers: []
})
export class MainModule {}
