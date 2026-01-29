import { TestBed } from '@angular/core/testing'
import {
  CONFIG_SERVICE_DEFAULTS_TOKEN,
  ConfigServiceOptions,
  injectConfigService,
  provideConfigService,
} from './provide-config-service'
import { ConfigService } from '../services/config-service'
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing'
import { EnvironmentInjector, runInInjectionContext } from '@angular/core'

describe('ProvideConfig', () => {
  let service: ConfigService<{
    ENVIRONMENTS: Record<string, string>
    ENV: string
  }>
  let options: ConfigServiceOptions
  let controller: HttpTestingController
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting(),
        provideConfigService({
          AUTO_LOAD: false,
          CONFIG_FILE_URL: '/configurations.json',
        }),
      ],
    })
    const injector = TestBed.inject(EnvironmentInjector)
    options = TestBed.inject(CONFIG_SERVICE_DEFAULTS_TOKEN)
    controller = TestBed.inject(HttpTestingController)

    runInInjectionContext(injector, () => {
      service = injectConfigService<{
        ENVIRONMENTS: Record<string, string>
        ENV: string
      }>()
    })
  })

  afterEach(() => {
    controller.verify()
  })

  it('should be initialized', () => {
    expect(service).toBeTruthy()
  })

  it('should has AUTO_LOAD = false and CONFIG_FILE_URL = `/configurations.json`', () => {
    expect(options.AUTO_LOAD).toBe(false)
    expect(options.CONFIG_FILE_URL).toBe('/configurations.json')
  })

  it('should should load configuration file', () => {
    service.load().subscribe((value) => {
      expect(value).toStrictEqual({
        ENVIRONMENTS: {
          DEV: 'dev',
          STG: 'stg',
        },
        ENV: 'DEV',
      })
    })
    const req = controller.expectOne(options.CONFIG_FILE_URL)
    expect(req.request.url).toBe(options.CONFIG_FILE_URL)
    expect(req.request.method).toBe('GET')

    req.flush({
      ENVIRONMENTS: {
        DEV: 'dev',
        STG: 'stg',
      },
      ENV: 'DEV',
    })
  })
})
