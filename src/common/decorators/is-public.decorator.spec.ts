import { IsPublic } from '@app/common/decorators'

describe('IsPublicDecorator', () => {
  class DummyClass {
    @IsPublic()
    dummyMethod() {
      return 'dummy'
    }
  }
  const sut = new DummyClass()
  it('should be defined', () => {
    expect(sut).toBeDefined()
  })
})
