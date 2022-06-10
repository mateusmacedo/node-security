export interface AppConfigService {
  getName(): string
  getDescription(): string
  getVersion(): string
  getPort(): number
}
