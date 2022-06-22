/* eslint-disable @typescript-eslint/no-explicit-any */
import { StrategyExplorerService } from '@app/common/services/strategy-explorer.service'
import { Injectable } from '@nestjs/common'
import { ModulesContainer } from '@nestjs/core'
import { Test } from '@nestjs/testing'

const StubStrategyDecorator = (name: string): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata('StubStrategyDecorator', name, target)
  }
}
interface StrategyStub {
  stub: string
}
@StubStrategyDecorator('StubStrategyDecorator_1')
@Injectable()
class StrategyStubImp1 implements StrategyStub {
  stub: string
  constructor() {
    this.stub = 'StubStrategyDecorator_1'
  }
}

@StubStrategyDecorator('StubStrategyDecorator_2')
@Injectable()
class StrategyStubImp2 implements StrategyStub {
  stub: string
  constructor() {
    this.stub = 'StubStrategyDecorator_2'
  }
}

describe('StrategyExplorerService', () => {
  let strategyExplorerService: StrategyExplorerService
  let strategyStub1: StrategyStub
  let strategyStub2: StrategyStub
  let modulesContainer: ModulesContainer
  beforeEach(async () => {
    jest.clearAllMocks()
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [StrategyStubImp1, StrategyStubImp2, StrategyExplorerService]
    }).compile()

    strategyExplorerService = moduleRef.get<StrategyExplorerService>(StrategyExplorerService)
    strategyStub1 = moduleRef.get<StrategyStub>(StrategyStubImp1)
    strategyStub2 = moduleRef.get<StrategyStub>(StrategyStubImp2)
    modulesContainer = moduleRef.get<ModulesContainer>(ModulesContainer)
  })

  it('should be defined', () => {
    expect(strategyExplorerService).toBeDefined()
    expect(strategyStub1).toBeDefined()
    expect(strategyStub2).toBeDefined()
  })
  describe('explore', () => {
    it('should execute explore flow correctly', () => {
      const flatMapSpy = jest.spyOn(strategyExplorerService as any, 'flatMap')
      const filterProviderSpy = jest.spyOn(strategyExplorerService as any, 'filterProvider')
      const extractMetadataSpy = jest.spyOn(strategyExplorerService as any, 'extractMetadata')
      const getMetadataSpy = jest.spyOn(Reflect, 'getMetadata')
      const modules = [...modulesContainer.values()]
      strategyExplorerService.explore<StrategyStub>('StubStrategyDecorator')
      expect(flatMapSpy).toHaveBeenCalledTimes(1)
      expect(flatMapSpy).toHaveBeenCalledWith(modules, expect.any(Function))
      expect(filterProviderSpy).toHaveBeenCalledWith(expect.any(Object), 'StubStrategyDecorator')
      expect(extractMetadataSpy).toHaveBeenCalledWith(expect.any(Object), 'StubStrategyDecorator')
      expect(getMetadataSpy).toHaveBeenCalledWith('StubStrategyDecorator', expect.any(Function))
    })
    it('should have strategies as defined on above', () => {
      const flatMapSpy = jest.spyOn(strategyExplorerService as any, 'flatMap')
      const filterProviderSpy = jest.spyOn(strategyExplorerService as any, 'filterProvider')
      const extractMetadataSpy = jest.spyOn(strategyExplorerService as any, 'extractMetadata')
      const getMetadataSpy = jest.spyOn(Reflect, 'getMetadata')
      const modules = [...modulesContainer.values()]
      const strategy = strategyExplorerService.explore<StrategyStub>('StubStrategyDecorator')
      expect(strategy).toBeDefined()
      expect(strategy).toHaveLength(2)
      expect(new strategy[0]()).toEqual(strategyStub1)
      expect(new strategy[1]()).toEqual(strategyStub2)
      expect(flatMapSpy).toHaveBeenCalledTimes(1)
      expect(flatMapSpy).toHaveBeenCalledWith(modules, expect.any(Function))
      expect(filterProviderSpy).toHaveBeenCalledWith(expect.any(Object), 'StubStrategyDecorator')
      expect(extractMetadataSpy).toHaveBeenCalledWith(expect.any(Object), 'StubStrategyDecorator')
      expect(getMetadataSpy).toHaveBeenCalledWith('StubStrategyDecorator', expect.any(Function))
    })
    it('should not have strategies when correct identifier is not provided', () => {
      const strategy = strategyExplorerService.explore<StrategyStub>('StubStrategyDecoratorNotDefined')
      expect(strategy).toBeDefined()
      expect(strategy).toHaveLength(0)
    })
  })
})
