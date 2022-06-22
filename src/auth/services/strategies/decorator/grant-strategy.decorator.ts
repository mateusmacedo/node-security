import 'reflect-metadata'

import { GRANT_STRATEGY_METADATA } from '@app/auth/constants'

export const GrantStrategyDecorator = (name: string): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata(GRANT_STRATEGY_METADATA, name, target)
  }
}
