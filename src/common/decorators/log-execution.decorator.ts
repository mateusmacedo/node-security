import { InjectPinoLogger } from 'nestjs-pino'

export function LogExecution() {
  return (target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor) => {
    const pinoInjector = InjectPinoLogger(`${target.constructor.name}.${propertyKey}`)
    pinoInjector(target, 'logger')
    const originalMethod = propertyDescriptor.value
    propertyDescriptor.value = function (...data: any[]) {
      const result = originalMethod.apply(this, data)
      if (result instanceof Promise) {
        return result.then((res) => {
          this.logger.info({ data, result: res })
          return res
        })
      }
      this.logger.info({ data, result })
      return result
    }
  }
}
