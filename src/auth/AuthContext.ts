import { createContext } from 'react'
import type { AuthSession } from './session'

export type LoginCredentials = {
  email: string
  password: string
}

export type AuthContextValue = {
  session: AuthSession | null
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
