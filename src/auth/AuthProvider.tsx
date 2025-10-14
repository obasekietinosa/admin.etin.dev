import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react'
import { adminLogin, adminLogout } from '../api/auth'
import { ApiError } from '../api/client'
import {
  clearSession as clearStoredSession,
  getStoredSession,
  getSessionSnapshot,
  isSessionExpired,
  setSession as persistSession,
  subscribe,
} from './session'
import { AuthContext, LoginCredentials } from './AuthContext'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const session = useSyncExternalStore(subscribe, getSessionSnapshot, getSessionSnapshot)

  useEffect(() => {
    const storedSession = getStoredSession()
    if (storedSession && isSessionExpired(storedSession)) {
      clearStoredSession()
    }
  }, [session])

  const login = useCallback(async ({ email, password }: LoginCredentials) => {
    const response = await adminLogin({ email, password })
    persistSession({ token: response.token, expiresAt: response.expiresAt })
  }, [])

  const logout = useCallback(async () => {
    try {
      if (session) {
        await adminLogout()
      }
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401) {
        console.error('Failed to revoke admin session.', error)
      }
    } finally {
      clearStoredSession()
    }
  }, [session])

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      login,
      logout,
    }),
    [session, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

