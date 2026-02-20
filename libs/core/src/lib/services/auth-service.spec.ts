import { TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing'
import { AuthService } from './auth-service'

describe('AuthService', () => {
  let service: AuthService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
    service = TestBed.inject(AuthService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should POST credentials and return auth response', () => {
    const mockResponse = {
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token',
    }

    service
      .login('https://api.example.com/auth', {
        userName: 'testuser',
        password: 'testpass',
      })
      .subscribe((response) => {
        expect(response.accessToken).toBe('test-access-token')
        expect(response.refreshToken).toBe('test-refresh-token')
      })

    const req = httpMock.expectOne('https://api.example.com/auth')
    expect(req.request.method).toBe('POST')
    expect(req.request.body).toEqual({
      userName: 'testuser',
      password: 'testpass',
    })
    req.flush(mockResponse)
  })
})
