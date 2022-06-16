export interface StrategyRegistry<T> {
  register(strategies: T[]): void
}
