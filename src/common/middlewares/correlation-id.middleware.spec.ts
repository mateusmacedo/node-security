import { CorrelationIdMiddleware } from '@app/common/middlewares'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { Test } from '@nestjs/testing'
import { NextFunction, Request, Response } from 'express'

describe('CorrelationIdMiddleware', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  let correlationIdMiddleware: CorrelationIdMiddleware

  beforeEach(async () => {
    jest.clearAllMocks()
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [CorrelationIdMiddleware]
    }).compile()

    correlationIdMiddleware = moduleRef.get<CorrelationIdMiddleware>(CorrelationIdMiddleware)
  })

  it('should be defined', () => {
    expect(correlationIdMiddleware).toBeDefined()
  })
  describe('use', () => {
    it('should generate a correlation id', () => {
      req = getMockReq()
      res = getMockRes().res
      next = getMockRes().next
      correlationIdMiddleware.use(req, res, next)
      expect(req.headers['x-correlation-id']).toBeDefined()
    })
    it('should preserve a request correlation id', () => {
      req = getMockReq()
      res = getMockRes().res
      next = getMockRes().next
      req.headers['Correlation-Id'] = 'dummy-correlation-id'
      correlationIdMiddleware.use(req, res, next)
      expect(req.headers['x-correlation-id']).toBeDefined()
      expect(req.headers['x-correlation-id']).toBe('dummy-correlation-id')
    })
  })
})
