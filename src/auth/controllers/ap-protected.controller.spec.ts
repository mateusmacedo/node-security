import { ApProtectedController } from '@app/auth/controllers'
import { Test } from '@nestjs/testing'

describe('ApProtectedController', () => {
  let apProtectedController: ApProtectedController

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [ApProtectedController],
      providers: []
    }).compile()

    apProtectedController = moduleRef.get<ApProtectedController>(ApProtectedController)
  })

  it('should be defined', () => {
    expect(apProtectedController).toBeDefined()
  })
  describe('validateApJwtToken', () => {
    it('should validate', async () => {
      expect(await apProtectedController.validateApJwtToken()).toBeTruthy()
    })
  })
})
