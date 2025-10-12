export interface AuthSession {
  token: string
  expiresAt: string
}

type AuthListener = (session: AuthSession | null) => void

const STORAGE_KEY = 'admin.etin.dev/auth-session'
const listeners = new Set<AuthListener>()
let cachedSession: AuthSession | null | undefined

const parseSession = (rawValue: string | null): AuthSession | null => {
  if (!rawValue) {
    return null
  }

  try {
    const parsed = JSON.parse(rawValue) as AuthSession
    if (typeof parsed?.token === 'string' && typeof parsed?.expiresAt === 'string') {
      return parsed
    }
  } catch (error) {
    console.warn('Failed to parse stored auth session.', error)
  }

  return null
}

const readSessionFromStorage = (): AuthSession | null => {
  if (typeof window === 'undefined') {
    return cachedSession ?? null
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY)
  return parseSession(storedValue)
}

const writeSessionToStorage = (session: AuthSession | null) => {
  if (typeof window === 'undefined') {
    return
  }

  if (session) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } else {
    window.localStorage.removeItem(STORAGE_KEY)
  }
}

const notify = (session: AuthSession | null) => {
  listeners.forEach((listener) => listener(session))
}

const getCachedSession = (): AuthSession | null => {
  if (cachedSession === undefined) {
    cachedSession = readSessionFromStorage()
  }

  return cachedSession ?? null
}

export const getStoredSession = (): AuthSession | null => getCachedSession()

export const getSessionSnapshot = (): AuthSession | null => {
  const session = getCachedSession()
  if (!session) {
    return null
  }

  return isSessionExpired(session) ? null : session
}

export const subscribe = (listener: AuthListener) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const setSession = (session: AuthSession) => {
  cachedSession = session
  writeSessionToStorage(session)
  notify(session)
}

export const clearSession = () => {
  cachedSession = null
  writeSessionToStorage(null)
  notify(null)
}

export const isSessionExpired = (session: AuthSession, referenceDate = new Date()): boolean => {
  const expiresAt = new Date(session.expiresAt)
  if (Number.isNaN(expiresAt.getTime())) {
    return true
  }

  return expiresAt.getTime() <= referenceDate.getTime()
}

export const getAccessToken = (): string | null => {
  const session = getCachedSession()
  if (!session) {
    return null
  }

  if (isSessionExpired(session)) {
    clearSession()
    return null
  }

  return session.token
}
