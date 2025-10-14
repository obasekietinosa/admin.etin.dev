import { apiRequest } from './client'

export interface Note {
  id: number
  title: string
  subtitle: string
  body: string
  publishedAt: string | null
}

export interface NoteInput {
  title: string
  subtitle?: string
  body: string
  publishedAt?: string | null
}

interface NotesResponse {
  notes: Note[]
}

interface NoteResponse {
  note: Note
}

export const fetchNotes = async (): Promise<Note[]> => {
  const response = await apiRequest<NotesResponse>('/notes')
  return response.notes
}

export const fetchNote = async (noteId: number): Promise<Note> => {
  const response = await apiRequest<NoteResponse>(`/notes/${noteId}`)
  return response.note
}

export const createNote = async (input: NoteInput): Promise<Note> => {
  const response = await apiRequest<NoteResponse>('/notes', {
    method: 'POST',
    body: JSON.stringify(input),
  })

  return response.note
}

export const updateNote = async (
  noteId: number,
  input: Partial<NoteInput>,
): Promise<Note> => {
  const response = await apiRequest<NoteResponse>(`/notes/${noteId}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })

  return response.note
}

export const deleteNote = async (noteId: number): Promise<void> => {
  await apiRequest(`/notes/${noteId}`, {
    method: 'DELETE',
  })
}
