import { apiRequest } from './client'
import { uploadAsset } from './assets'

export interface Company {
  id: number
  name: string
  icon?: string | null
  description: string
}

export interface CompanyInput {
  name: string
  icon: string
  description: string
}

interface CompaniesResponse {
  companies: Company[]
}

interface CompanyResponse {
  company: Company
}

export const fetchCompanies = async (): Promise<Company[]> => {
  const response = await apiRequest<CompaniesResponse>('/companies')
  return response.companies
}

export const fetchCompany = async (companyId: number): Promise<Company> => {
  const response = await apiRequest<CompanyResponse>(`/companies/${companyId}`)
  return response.company
}

export const createCompany = async (input: CompanyInput): Promise<Company> => {
  const response = await apiRequest<CompanyResponse>('/companies', {
    method: 'POST',
    body: JSON.stringify(input),
  })

  return response.company
}

export const updateCompany = async (
  companyId: number,
  input: Partial<CompanyInput>,
): Promise<Company> => {
  const response = await apiRequest<CompanyResponse>(`/companies/${companyId}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })

  return response.company
}

export const deleteCompany = async (companyId: number): Promise<void> => {
  await apiRequest(`/companies/${companyId}`, {
    method: 'DELETE',
  })
}

export const uploadCompanyImage = async (
  companyId: number,
  input: { file: File; altText?: string },
): Promise<void> => {
  const asset = await uploadAsset(input)

  await updateCompany(companyId, { icon: asset.url })
}
