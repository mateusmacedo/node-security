export interface StrategyRegistryInterface<T> {
  register(strategies: T[]): void
}
