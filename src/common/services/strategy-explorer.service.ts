import { Injectable, Type } from '@nestjs/common'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'
import { Module } from '@nestjs/core/injector/module'
import { ModulesContainer } from '@nestjs/core/injector/modules-container'

@Injectable()
export class StrategyExplorerService {
  constructor(private readonly modulesContainer: ModulesContainer) {}

  explore<T>(metadataKey: string): Type<T>[] {
    const modules = [...this.modulesContainer.values()]
    return this.flatMap<T>(modules, (instance) => this.filterProvider(instance, metadataKey))
  }

  private flatMap<T>(modules: Module[], callback: (instance: InstanceWrapper) => Type<T>): Type<T>[] {
    return modules
      .map((module) => [...module.providers.values()].map(callback))
      .reduce((a, b) => a.concat(b), [])
      .filter((element) => !!element)
  }

  private filterProvider<T>(wrapper: InstanceWrapper, metadataKey: string): Type<T> {
    const { instance } = wrapper
    if (!instance) {
      return undefined
    }
    return this.extractMetadata<T>(instance, metadataKey)
  }

  private extractMetadata<T>(instance: Record<string, unknown>, metadataKey: string): Type<T> {
    const metadata = Reflect.getMetadata(metadataKey, instance.constructor)
    return metadata ? (instance.constructor as Type<T>) : undefined
  }
}
