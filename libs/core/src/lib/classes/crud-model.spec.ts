import { CrudModel } from './crud-model'
import { CrudServiceContract } from '../services/crud-service'

interface TestModelShape {
  id: number
  name: string
}

class TestModel extends CrudModel<TestModelShape, CrudServiceContract<TestModelShape, number>> {
  $$primaryKey = 'id' as const
  $$service = 'TestService'
  id = 0
  name = ''
}

describe('CrudModel', () => {
  it('should create an instance', () => {
    expect(new TestModel()).toBeTruthy()
  })

  it('should have the correct primary key', () => {
    const model = new TestModel()
    expect(model.$$primaryKey).toBe('id')
  })

  it('should have the correct service name', () => {
    const model = new TestModel()
    expect(model.$$service).toBe('TestService')
  })
})
