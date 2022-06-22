import { GRANT_STRATEGY_METADATA, IDENTITY_PROVIDER_METADATA } from '@app/auth/constants'
import { ApProtectedController, Oauth2Controller } from '@app/auth/controllers'
import {
  GrantStrategyInterface,
  IdentityProviderClientInterface,
  IdentityProviderClientType
} from '@app/auth/interfaces'
import { GrantStrategyRegistry } from '@app/auth/services'
import { ApIdentityProviderClientService, CognitoIdentityProviderService } from '@app/auth/services/providers'
import { AbstractIdentityProviderService } from '@app/auth/services/providers/abstract'
import {
  ClientCredentialGrantStrategyService,
  JwtStrategy,
  RefreshTokenGrantStrategyService
} from '@app/auth/services/strategies'
import { StrategyExplorerService } from '@app/common/services'
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'
import { Module, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [
    JwtStrategy,
    StrategyExplorerService,
    GrantStrategyRegistry,
    {
      inject: [ConfigService],
      provide: 'AP_USER_POOL_ID',
      useFactory: (configService: ConfigService) => configService.get('AWS_COGNITO_AP_USER_POOL_ID')
    },
    {
      inject: [ConfigService],
      provide: 'AP_PROVIDER_CLIENT',
      useFactory: (configService: ConfigService) => {
        const config = {
          region: configService.get('AWS_DEFAULT_REGION'),
          credentials: {
            accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY')
          },
          endpoint: configService.get('AWS_COGNITO_AP_USER_POOL_URL')
        }
        return new CognitoIdentityProviderClient(config)
      }
    },
    ApIdentityProviderClientService,
    {
      provide: AbstractIdentityProviderService,
      useClass: CognitoIdentityProviderService
    },
    ClientCredentialGrantStrategyService,
    RefreshTokenGrantStrategyService
  ],
  controllers: [Oauth2Controller, ApProtectedController],
  exports: [PassportModule, JwtStrategy]
})
export class AuthModule implements OnModuleInit {
  constructor(
    private readonly explorerService: StrategyExplorerService,
    private readonly strategyRegistry: GrantStrategyRegistry,
    private readonly identityProviderService: AbstractIdentityProviderService<IdentityProviderClientType>
  ) {}
  onModuleInit() {
    const strategies = this.explorerService.explore<GrantStrategyInterface>(GRANT_STRATEGY_METADATA)
    this.strategyRegistry.register(strategies)
    const providers = this.explorerService.explore<IdentityProviderClientInterface>(IDENTITY_PROVIDER_METADATA)
    this.identityProviderService.register(providers)
  }
}
