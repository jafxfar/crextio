// ─── Base API Client ─────────────────────────────────────────────────────────

export const API_BASE_URL = 'https://a17a-109-75-49-177.ngrok-free.app'

export const TOKEN_KEY = 'access_token'

// ─── Token helpers ────────────────────────────────────────────────────────────

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
  // Also persist in cookie so the middleware (edge runtime) can read it
  document.cookie = `${TOKEN_KEY}=${token}; path=/; SameSite=Lax`
}

export function removeToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
  // Clear the cookie as well
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  /** Skip attaching the Authorization header (e.g. for login) */
  public?: boolean
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, public: isPublic, ...rest } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(rest.headers as Record<string, string>),
  }

  if (!isPublic) {
    const token = getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`
    try {
      const errorData = await response.json()
      errorMessage = errorData?.detail ?? errorData?.message ?? errorMessage
    } catch {
      // ignore JSON parse error, use default message
    }
    throw new Error(errorMessage)
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
