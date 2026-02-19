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

  it('should not be authenticated initially', () => {
    expect(service.isAuthenticated()).toBe(false)
    expect(service.accessToken()).toBeNull()
    expect(service.refreshToken()).toBeNull()
  })

  it('should store tokens in memory on login', () => {
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
        expect(service.isAuthenticated()).toBe(true)
        expect(service.accessToken()).toBe('test-access-token')
        expect(service.refreshToken()).toBe('test-refresh-token')
      })

    const req = httpMock.expectOne('https://api.example.com/auth')
    expect(req.request.method).toBe('POST')
    expect(req.request.body).toEqual({
      userName: 'testuser',
      password: 'testpass',
    })
    req.flush(mockResponse)
  })

  it('should clear tokens on logout', () => {
    const mockResponse = {
      accessToken: 'token',
      refreshToken: 'refresh',
    }

    service
      .login('https://api.example.com/auth', {
        userName: 'user',
        password: 'pass',
      })
      .subscribe()

    httpMock.expectOne('https://api.example.com/auth').flush(mockResponse)

    expect(service.isAuthenticated()).toBe(true)

    service.logout()

    expect(service.isAuthenticated()).toBe(false)
    expect(service.accessToken()).toBeNull()
    expect(service.refreshToken()).toBeNull()
  })
})
