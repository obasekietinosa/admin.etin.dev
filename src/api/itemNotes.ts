import { apiRequest } from './client'
import { Note } from './notes'

export type ItemType = 'projects' | 'roles' | 'notes'

export interface ItemNote {
  id: number
  itemId: number
  itemType: ItemType
  noteId: number
}

interface ItemNotesResponse {
  itemNotes: ItemNote[]
}

interface ItemNoteResponse {
  itemNote: ItemNote
}

interface NotesResponse {
  notes: Note[]
}

export interface CreateItemNoteInput {
  itemId: number
  itemType: ItemType
  noteId: number
}

export const fetchItemNotes = async (
  itemType: ItemType,
  itemId: number,
): Promise<Note[]> => {
  const response = await apiRequest<NotesResponse>(
    `/item-notes/items/${itemType}/${itemId}`,
  )
  return response.notes
}

export const fetchAllItemNoteLinks = async (): Promise<ItemNote[]> => {
  const response = await apiRequest<ItemNotesResponse>('/item-notes')
  return response.itemNotes
}

export const createItemNote = async (
  input: CreateItemNoteInput,
): Promise<ItemNote> => {
  const response = await apiRequest<ItemNoteResponse>('/item-notes', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return response.itemNote
}

export const deleteItemNote = async (itemNoteId: number): Promise<void> => {
  await apiRequest(`/item-notes/${itemNoteId}`, {
    method: 'DELETE',
  })
}
