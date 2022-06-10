import { Oauth2Controller } from '@app/auth/oauth/oauth.controller'
import { Test, TestingModule } from '@nestjs/testing'

describe('OauthController', () => {
  let controller: Oauth2Controller

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Oauth2Controller]
    }).compile()

    controller = module.get<Oauth2Controller>(Oauth2Controller)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
