export interface InfoContract {
  id: number
  arName: string
  enName: string
  parent?: number
}

export interface HasForm {
  buildForm(): Record<string, unknown>
}

export interface ModelHasService {
  $$service: string
  $$getService<Service>(): Service
}

export interface ServiceNameContract {
  $$serviceName: string
}
