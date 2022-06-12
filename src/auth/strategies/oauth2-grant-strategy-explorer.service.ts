import { Oauth2StrategyOptions } from '@app/auth/interfaces'
import { Injectable } from '@nestjs/common'
import { ModulesContainer } from '@nestjs/core/injector/modules-container'

@Injectable()
export class StrategyExplorer {
  constructor(private readonly modulesContainer: ModulesContainer) {}

  explore(): Oauth2StrategyOptions {
    throw new Error('Method not implemented.')
  }
}
