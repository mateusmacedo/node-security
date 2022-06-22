import { AuthModule } from '@app/auth/auth.module'
import { CommonModule } from '@app/common/common.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [
    CommonModule.register({
      configModule: {
        ignoreEnvFile: ['production', 'staging'].includes(process.env.NODE_ENV),
        envFilePath: '.env',
        expandVariables: ['development', 'test'].includes(process.env.NODE_ENV),
        cache: ['production', 'staging'].includes(process.env.NODE_ENV),
        isGlobal: true
      }
    }),
    AuthModule
  ],
  controllers: [],
  providers: []
})
export class MainModule {}
