import { Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectPinoLogger } from 'nestjs-pino'

export function LogExecution() {
  return (target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor) => {
    const pinoInjector = InjectPinoLogger(`${target.constructor.name}.${propertyKey}`)
    const nestInjector = Inject(ConfigService)
    pinoInjector(target, 'logger')
    nestInjector(target, 'configService')
    const originalMethod = propertyDescriptor.value
    propertyDescriptor.value = async function (...data: any[]) {
      const result = await originalMethod.apply(this, data)
      if (this.configService.get('NODE_ENV') === 'test') {
        return result
      }
      this.logger.info({ data, result })
      return result
    }
  }
}
