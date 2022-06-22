import 'reflect-metadata'

import { IDENTITY_PROVIDER_METADATA } from '@app/auth/constants'

export const IdentityProviderDecorator = (name: string): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata(IDENTITY_PROVIDER_METADATA, name, target)
  }
}
