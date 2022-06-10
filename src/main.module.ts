import { AuthModule } from '@app/auth/auth.module'
import { CommonModule } from '@app/common/common.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [
    CommonModule.register({
      configModule: {
        ignoreEnvFile: JSON.parse(process.env.IGNORE_ENV_FILE),
        envFilePath: JSON.parse(process.env.ENV_FILE_PATH),
        expandVariables: JSON.parse(process.env.EXPAND_VARIABLES),
        cache: JSON.parse(process.env.CACHE),
        isGlobal: JSON.parse(process.env.IS_GLOBAL)
      }
    }),
    AuthModule
  ],
  controllers: [],
  providers: []
})
export class MainModule {}
