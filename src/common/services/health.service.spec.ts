import { HealthService } from '@app/common/services'
import { createMock } from '@golevelup/nestjs-testing'
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus'
import { Test, TestingModule } from '@nestjs/testing'

describe('HealthService', () => {
  let sut: HealthService
  const mockHttpHealthIndicator = createMock<HttpHealthIndicator>({
    pingCheck: jest.fn().mockImplementation(async () => Promise.resolve())
  })
  const mockHealthCheckService = createMock<HealthCheckService>({
    check: jest.fn().mockImplementation(async () => mockHttpHealthIndicator.pingCheck.mockRejectedValue({}))
  })
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: HealthCheckService,
          useValue: mockHealthCheckService
        },
        {
          provide: HttpHealthIndicator,
          useValue: mockHttpHealthIndicator
        },
        HealthService
      ]
    }).compile()

    sut = module.get<HealthService>(HealthService)
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })
  describe('performHealthCheck', () => {
    it('should call HealthCheckService.check correctly', async () => {
      await sut.performHealthCheck()
      expect(mockHealthCheckService.check).toHaveBeenCalledTimes(1)
      expect(mockHealthCheckService.check).toHaveBeenCalledWith([expect.any(Function)])
    })
  })
})
