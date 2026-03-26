export type AuthCredentials = {
  userName: string
  password: string
}

export type AuthTokens = {
  accessToken: string
  refreshToken: string
}

export type AuthResponse<T = unknown> = {
  result: AuthTokens & T
}

export type RequiredAuthEndpoints = Record<
  'AUTH' | 'REFRESH_TOKEN' | 'LOGOUT',
  string
>
