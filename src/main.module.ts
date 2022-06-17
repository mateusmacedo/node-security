import { AuthModule } from '@app/auth/auth.module'
import { CommonModule } from '@app/common/common.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [
    CommonModule.register({
      configModule: {
        ignoreEnvFile: process.env.NODE_ENV === 'production',
        envFilePath: process.env.ENV_FILE_PATH,
        expandVariables: process.env.NODE_ENV !== 'production',
        cache: process.env.NODE_ENV === 'production',
        isGlobal: true
      }
    }),
    AuthModule
  ],
  controllers: [],
  providers: []
})
export class MainModule {}
