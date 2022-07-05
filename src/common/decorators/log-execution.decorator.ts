import { InjectPinoLogger } from 'nestjs-pino'

/* eslint-disable @typescript-eslint/no-explicit-any */
export function LogExecution() {
  return (target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor) => {
    if (process.env.NODE_ENV !== 'test') {
      const pinoInjector = InjectPinoLogger(`${target.constructor.name}.${propertyKey}`)
      pinoInjector(target, 'logger')
      const originalMethod = propertyDescriptor.value
      propertyDescriptor.value = new Proxy(originalMethod, {
        apply: (target, thisArg, argumentsList) => {
          try {
            const result = target.apply(thisArg, argumentsList)
            if (result instanceof Promise) {
              return result
                .then((res) => {
                  thisArg.logger.info({ data: argumentsList, result: res })
                  return res
                })
                .catch((err) => {
                  thisArg.logger.error({ data: argumentsList, error: err })
                  throw err
                })
            } else {
              thisArg.logger.info({ data: argumentsList, result })
              return result
            }
          } catch (err) {
            thisArg.logger.error({ data: argumentsList, error: err })
            throw err
          }
        }
      })
    }
  }
}
