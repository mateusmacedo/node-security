import { IDENTITY_PROVIDER_METADATA } from '@app/auth/constants'
import { GrantType, IdentityContext } from '@app/auth/enums'
import { InvalidContextException } from '@app/auth/errors'
import {
  IdentityProviderAccessTokenInterface,
  IdentityProviderClientInterface,
  IdentityProviderClientType,
  IdentityProviderInterface,
  OAuth2Payload
} from '@app/auth/interfaces'
import { AbstractIdentityProviderService } from '@app/auth/services/providers/abstract'
import { LogExecution } from '@app/common/decorators'
import {
  DescribeUserPoolClientCommand,
  DescribeUserPoolClientCommandInput,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  InitiateAuthCommandOutput,
  RespondToAuthChallengeCommand,
  RespondToAuthChallengeCommandInput,
  RespondToAuthChallengeCommandOutput
} from '@aws-sdk/client-cognito-identity-provider'
import { Counter, Span } from '@metinseylan/nestjs-opentelemetry'
import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import crypto from 'crypto'

@Injectable()
export class CognitoIdentityProviderService extends AbstractIdentityProviderService<IdentityProviderClientType> {
  private registry: { [s: string]: IdentityProviderClientInterface } = {}

  constructor(private readonly moduleRef: ModuleRef) {
    super()
  }

  @Span('respondToAuthChallenge')
  @Counter()
  @LogExecution()
  private async respondToAuthChallenge(
    request: OAuth2Payload,
    result: InitiateAuthCommandOutput,
    hash: string
  ): Promise<RespondToAuthChallengeCommandOutput> {
    const { identityContext, clientId, username, password } = request
    const inputCommand: RespondToAuthChallengeCommandInput = {
      ClientId: clientId,
      ChallengeName: result.ChallengeName,
      ChallengeResponses: {
        USERNAME: username,
        SECRET_HASH: hash,
        NEW_PASSWORD: password
      },
      Session: result.Session
    }
    const command = new RespondToAuthChallengeCommand(inputCommand)
    return this.registry[identityContext].getClient().send(command)
  }

  @Span('createInitiateAuthCommandInput')
  @Counter()
  @LogExecution()
  private createInitiateAuthCommandInput(request: OAuth2Payload, hash: string): InitiateAuthCommandInput {
    const { identityContext, clientId, username, password } = request
    this.validateIdentityContext(identityContext)
    if (request.grantType === GrantType.CLIENT_CREDENTIALS) {
      return {
        AuthFlow: 'USER_PASSWORD_AUTH',
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
          SECRET_HASH: hash
        },
        ClientId: clientId
      }
    }
    if (request.grantType === GrantType.REFRESH_TOKEN) {
      return {
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        AuthParameters: {
          REFRESH_TOKEN: request.refreshToken,
          SECRET_HASH: hash
        },
        ClientId: clientId
      }
    }
  }

  @Span('createSecretHash')
  @Counter()
  @LogExecution()
  private createSecretHash(request: OAuth2Payload): string {
    return crypto
      .createHmac('sha256', request.clientSecret)
      .update(`${request.username}${request.clientId}`)
      .digest('base64')
  }

  @Span('validateIdentityContext')
  @Counter()
  @LogExecution()
  private validateIdentityContext(identityContext: IdentityContext): void {
    if (!(identityContext in this.registry)) {
      throw new InvalidContextException(identityContext)
    }
  }

  @Span('createAccessToken')
  @Counter()
  @LogExecution()
  async createAccessToken(request: OAuth2Payload): Promise<IdentityProviderAccessTokenInterface> {
    this.validateIdentityContext(request.identityContext)
    const hash = this.createSecretHash(request)
    const inputInitiateAuthCommand = this.createInitiateAuthCommandInput(request, hash)
    const initiateAuthCommand = new InitiateAuthCommand(inputInitiateAuthCommand)
    const result = await this.registry[request.identityContext].getClient().send(initiateAuthCommand)
    if (result.ChallengeName !== undefined) {
      const resultChallenge = await this.respondToAuthChallenge(request, result, hash)
      result.AuthenticationResult = resultChallenge.AuthenticationResult
    }
    return {
      accessToken: result.AuthenticationResult.AccessToken,
      tokenType: result.AuthenticationResult.TokenType,
      refreshToken: result.AuthenticationResult.RefreshToken,
      accessTokenExp: result.AuthenticationResult.ExpiresIn,
      idToken: result.AuthenticationResult.IdToken
    }
  }

  @Span('identifyClient')
  @Counter()
  @LogExecution()
  async identifyClient(data: Partial<IdentityProviderInterface>): Promise<IdentityProviderInterface> {
    const { identityContext, clientId } = data
    this.validateIdentityContext(identityContext)
    const identifyClientCommandInput: DescribeUserPoolClientCommandInput = {
      UserPoolId: this.registry[identityContext].getUserPoolId(),
      ClientId: clientId
    }
    const identifyClientCommand = new DescribeUserPoolClientCommand(identifyClientCommandInput)
    const result = await this.registry[identityContext].getClient().send(identifyClientCommand)
    return {
      allowedAuthFlow: result.UserPoolClient.AllowedOAuthFlows,
      clientId: result.UserPoolClient.ClientId,
      clientName: result.UserPoolClient.ClientName,
      clientScopes: result.UserPoolClient.AllowedOAuthScopes,
      clientSecret: result.UserPoolClient.ClientSecret
    } as IdentityProviderInterface
  }

  @Span('register')
  @Counter()
  @LogExecution()
  register(strategies: IdentityProviderClientType[]): void {
    strategies.forEach((strategy) => {
      const instance = this.moduleRef.get(strategy, {
        strict: false
      })
      if (!instance) {
        return
      }
      const strategyName = Reflect.getMetadata(IDENTITY_PROVIDER_METADATA, strategy)
      this.registry[strategyName] = instance
    })
  }
}
