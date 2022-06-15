import 'reflect-metadata'

import { IDENTITY_PROVIDER_METADATA } from '@app/auth/constants'

export const IdentityProvider = (name: string): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata(IDENTITY_PROVIDER_METADATA, name, target)
  }
}
