import 'reflect-metadata'

import { OAUTH2_STRATEGY_METADATA } from '@app/auth/constants'

export const Oauth2GrantStrategy = (name: string): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata(OAUTH2_STRATEGY_METADATA, name, target)
  }
}
