import { apiFetch, setToken, removeToken } from './api'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type?: string
}

// ─── Auth API calls ───────────────────────────────────────────────────────────

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const data = await apiFetch<LoginResponse>('/api/v0/auth/login', {
    method: 'POST',
    body: credentials,
    public: true,
  })

  setToken(data.access_token)
  return data
}

export function logout(): void {
  removeToken()
}
