import { apiRequest } from './client'

export interface Project {
  id: number
  startDate: string
  endDate?: string | null
  title: string
  description: string
}

export interface ProjectInput {
  startDate: string
  endDate?: string
  title: string
  description: string
}

interface ProjectsResponse {
  projects: Project[]
}

interface ProjectResponse {
  project: Project
}

export const fetchProjects = async (): Promise<Project[]> => {
  const response = await apiRequest<ProjectsResponse>('/projects')
  return response.projects
}

export const fetchProject = async (projectId: number): Promise<Project> => {
  const response = await apiRequest<ProjectResponse>(`/projects/${projectId}`)
  return response.project
}

export const createProject = async (input: ProjectInput): Promise<Project> => {
  const response = await apiRequest<ProjectResponse>('/projects', {
    method: 'POST',
    body: JSON.stringify(input),
  })

  return response.project
}

export const updateProject = async (
  projectId: number,
  input: Partial<ProjectInput>,
): Promise<Project> => {
  const response = await apiRequest<ProjectResponse>(`/projects/${projectId}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })

  return response.project
}

export const deleteProject = async (projectId: number): Promise<void> => {
  await apiRequest(`/projects/${projectId}`, {
    method: 'DELETE',
  })
}
