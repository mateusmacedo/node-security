import { OAUTH2_STRATEGY_METADATA } from '@app/auth/constants'
import { Oauth2GrantStrategyInterface, Oauth2StrategyOptions } from '@app/auth/interfaces'
import { Injectable, Type } from '@nestjs/common'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'
import { Module } from '@nestjs/core/injector/module'
import { ModulesContainer } from '@nestjs/core/injector/modules-container'

@Injectable()
export class StrategyExplorer {
  constructor(private readonly modulesContainer: ModulesContainer) {}

  explore(): Oauth2StrategyOptions {
    const modules = [...this.modulesContainer.values()]
    const strategies = this.flatMap<Oauth2GrantStrategyInterface>(modules, (instance) =>
      this.filterProvider(instance, OAUTH2_STRATEGY_METADATA)
    )
    return { strategies }
  }

  flatMap<T>(modules: Module[], callback: (instance: InstanceWrapper) => Type<unknown> | undefined): Type<T>[] {
    const items = modules
      .map((module) => [...module.providers.values()].map(callback))
      .reduce((a, b) => a.concat(b), [])
    return items.filter((element) => !!element) as Type<T>[]
  }

  filterProvider(wrapper: InstanceWrapper, metadataKey: string): Type<unknown> | undefined {
    const { instance } = wrapper
    if (!instance) {
      return undefined
    }
    return this.extractMetadata(instance, metadataKey)
  }

  extractMetadata(instance: Record<string, unknown>, metadataKey: string): Type<unknown> {
    if (!instance.constructor) {
      return
    }
    const metadata = Reflect.getMetadata(metadataKey, instance.constructor)
    return metadata ? (instance.constructor as Type<unknown>) : undefined
  }
}
