import { apiRequest } from './client'

export interface Role {
  id: number
  startDate: string
  endDate: string
  title: string
  subtitle: string
  slug: string
  description: string
  skills: string[]
  companyId: number
  company: string
  companyIcon: string
}

export interface RoleInput {
  startDate: string
  endDate?: string
  title: string
  subtitle?: string
  companyId: number
  description?: string
  skills: string[]
}

interface RolesResponse {
  roles: Role[]
}

interface RoleResponse {
  role: Role
}

export const fetchRoles = async (): Promise<Role[]> => {
  const response = await apiRequest<RolesResponse>('/roles')
  return response.roles
}

export const fetchRole = async (roleId: number): Promise<Role> => {
  const response = await apiRequest<RoleResponse>(`/roles/${roleId}`)
  return response.role
}

export const createRole = async (input: RoleInput): Promise<Role> => {
  const response = await apiRequest<RoleResponse>('/roles', {
    method: 'POST',
    body: JSON.stringify(input),
  })

  return response.role
}

export const updateRole = async (
  roleId: number,
  input: Partial<RoleInput>,
): Promise<Role> => {
  const response = await apiRequest<RoleResponse>(`/roles/${roleId}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })

  return response.role
}

export const deleteRole = async (roleId: number): Promise<void> => {
  await apiRequest(`/roles/${roleId}`, {
    method: 'DELETE',
  })
}
