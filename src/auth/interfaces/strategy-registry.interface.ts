export interface StrategyRegistry {
  register<T>(strategies: T[]): void
}
