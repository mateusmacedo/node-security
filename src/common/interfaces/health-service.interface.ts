import { HealthCheckResult } from '@nestjs/terminus'

export interface HealthService {
  performHealthCheck(): Promise<HealthCheckResult>
}
