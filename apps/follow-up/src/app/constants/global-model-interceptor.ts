import { GeneralInterceptorContract } from 'cast-response'

export class GlobalModelInterceptor implements GeneralInterceptorContract {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send(model: Partial<any>): Partial<any> {
    if (!model['id']) {
      delete model['id']
    }
    delete model['$$primaryKey']
    delete model['$$service']
    return model
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  receive(model: any) {
    return model
  }
}
