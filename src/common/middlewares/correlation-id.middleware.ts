import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const correlationKeys = ['Correlation-Id', 'X-Correlation-Id', 'x-correlation-id']
    const headers = req.headers
    let correlationId: string
    for (const header in headers) {
      if (correlationKeys.includes(header)) {
        correlationId = headers[header] as string
        delete headers[header]
        break
      }
    }
    if (!correlationId) {
      correlationId = uuidv4()
      req.headers['x-correlation-id'] = correlationId
    } else {
      req.headers['x-correlation-id'] = correlationId
    }
    next()
  }
}
