import { apiRequest } from './client'

export interface Tag {
  id: number
  name: string
  slug: string
  icon: string | null
  theme: string | null
}

export interface TagInput {
  name: string
  slug: string
  icon?: string | null
  theme?: string | null
}

interface TagsResponse {
  tags: Tag[]
}

interface TagResponse {
  tag: Tag
}

export const fetchTags = async (): Promise<Tag[]> => {
  const response = await apiRequest<TagsResponse>('/tags')
  return response.tags
}

export const fetchTag = async (tagId: number): Promise<Tag> => {
  const response = await apiRequest<TagResponse>(`/tags/${tagId}`)
  return response.tag
}

export const createTag = async (input: TagInput): Promise<Tag> => {
  const response = await apiRequest<TagResponse>('/tags', {
    method: 'POST',
    body: JSON.stringify(input),
  })

  return response.tag
}

export const updateTag = async (
  tagId: number,
  input: Partial<TagInput>,
): Promise<Tag> => {
  const response = await apiRequest<TagResponse>(`/tags/${tagId}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })

  return response.tag
}

export const deleteTag = async (tagId: number): Promise<void> => {
  await apiRequest(`/tags/${tagId}`, {
    method: 'DELETE',
  })
}
