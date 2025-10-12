import { apiRequest } from './client'

export type AdminLoginRequest = {
  email: string
  password: string
}

export type AdminLoginResponse = {
  token: string
  expiresAt: string
}

export type AdminLogoutResponse = {
  message?: string
}

export const adminLogin = (payload: AdminLoginRequest) =>
  apiRequest<AdminLoginResponse>('/admin/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const adminLogout = () =>
  apiRequest<AdminLogoutResponse>('/admin/logout', {
    method: 'POST',
  })
