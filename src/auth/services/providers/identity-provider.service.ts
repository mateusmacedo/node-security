import { IDENTITY_PROVIDER_METADATA } from '@app/auth/constants'
import { OAuth2Request } from '@app/auth/dtos'
import { IdentityContext } from '@app/auth/enums'
import { InvalidContextException } from '@app/auth/errors'
import {
  IdentityProviderAccessTokenInterface,
  IdentityProviderClientInterface,
  IdentityProviderClientType,
  IdentityProviderInterface
} from '@app/auth/interfaces'
import { AbstractIdentityProviderService } from '@app/auth/services/providers/abstract'
import {
  DescribeUserPoolClientCommand,
  DescribeUserPoolClientCommandInput,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  RespondToAuthChallengeCommand,
  RespondToAuthChallengeCommandInput
} from '@aws-sdk/client-cognito-identity-provider'
import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import * as crypto from 'crypto'

@Injectable()
export class IdentityProviderService extends AbstractIdentityProviderService<IdentityProviderClientType> {
  private registry: { [s: string]: IdentityProviderClientInterface } = {}

  constructor(private readonly moduleRef: ModuleRef) {
    super()
  }

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

  private validateIdentityContext(identityContext: IdentityContext): void {
    if (!(identityContext in this.registry)) {
      throw new InvalidContextException(identityContext)
    }
  }

  async createAccessToken(request: OAuth2Request): Promise<IdentityProviderAccessTokenInterface> {
    const { identityContext, username, password, clientId } = request
    this.validateIdentityContext(identityContext)
    const hash = crypto
      .createHmac('sha256', request.clientSecret)
      .update(`${request.username}${request.clientId}`)
      .digest('base64')
    const inputInitiateAuthCommand: InitiateAuthCommandInput = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: hash
      },
      ClientId: clientId
    }
    const initiateAuthCommand = new InitiateAuthCommand(inputInitiateAuthCommand)
    const result = await this.registry[identityContext].getClient().send(initiateAuthCommand)
    if (result.ChallengeName !== undefined) {
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
      const resultChallenge = await this.registry[identityContext].getClient().send(command)
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
}
