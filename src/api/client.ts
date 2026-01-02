import { clearSession, getAccessToken } from '../auth/session'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://api.etin.dev/v1'

export class ApiError extends Error {
  public readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const isJsonResponse = (response: Response) => {
  const contentType = response.headers.get('Content-Type')
  return contentType?.includes('application/json') ?? false
}

const isFormDataBody = (body: RequestInit['body']): body is FormData =>
  typeof FormData !== 'undefined' && body instanceof FormData

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')

  if (options.body && !headers.has('Content-Type') && !isFormDataBody(options.body)) {
    headers.set('Content-Type', 'application/json')
  }

  const token = getAccessToken()
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let message = response.statusText

    if (isJsonResponse(response)) {
      try {
        const body = await response.json()
        message = typeof body === 'string' ? body : JSON.stringify(body)
      } catch (error) {
        // Ignore JSON parsing errors and fall back to status text.
      }
    } else {
      try {
        const text = await response.text()
        if (text.trim().length > 0) {
          message = text
        }
      } catch (error) {
        // Ignore text parsing errors and fall back to status text.
      }
    }

    if (response.status === 401) {
      clearSession()

      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    throw new ApiError(response.status, message)
  }

  if (response.status === 204) {
    return null as T
  }

  if (!isJsonResponse(response)) {
    throw new ApiError(response.status, 'Expected a JSON response from the API.')
  }

  return (await response.json()) as T
}
