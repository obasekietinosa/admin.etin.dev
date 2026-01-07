import React, { useEffect, useState } from 'react'
import MarkdownEditor from './MarkdownEditor'
import { useFormDrafts, Draft } from '../hooks/useFormDrafts'
import { DraftManager } from '../components/DraftManager'
import {
  ItemType,
  fetchItemNotes,
  createItemNote,
  deleteItemNote,
  fetchAllItemNoteLinks,
  ItemNote,
} from '../api/itemNotes'
import { Note, fetchNotes, createNote } from '../api/notes'

interface ItemNotesManagerProps {
  itemId: number
  itemType: ItemType
}

export const ItemNotesManager: React.FC<ItemNotesManagerProps> = ({
  itemId,
  itemType,
}) => {
  const [attachedNotes, setAttachedNotes] = useState<Note[]>([])
  const [availableNotes, setAvailableNotes] = useState<Note[]>([])
  const [itemNoteLinks, setItemNoteLinks] = useState<ItemNote[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // State for attaching existing note
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null)

  // State for creating new note
  const [isCreating, setIsCreating] = useState(false)
  const [newNoteTitle, setNewNoteTitle] = useState('')
  const [newNoteBody, setNewNoteBody] = useState('')

  const {
    drafts,
    currentDraftId,
    lastSaved,
    restoreDraft,
    deleteDraft,
    startNewDraft,
    saveDraft,
  } = useFormDrafts({
    key: `item-note-${itemType}-${itemId}`,
    data: { title: newNoteTitle, body: newNoteBody },
    getLabel: (data) => data.title || 'Untitled Item Note',
  })

  const handleRestore = (draft: Draft<{ title: string; body: string }>) => {
    setNewNoteTitle(draft.data.title)
    setNewNoteBody(draft.data.body)
    setIsCreating(true)
    restoreDraft(draft)
  }

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [notes, links, allNotes] = await Promise.all([
        fetchItemNotes(itemType, itemId),
        fetchAllItemNoteLinks(),
        fetchNotes(),
      ])
      setAttachedNotes(notes)
      setItemNoteLinks(links)
      setAvailableNotes(allNotes)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to load notes')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId, itemType])

  const handleAttachNote = async () => {
    if (!selectedNoteId) return

    try {
      await createItemNote({
        itemId,
        itemType,
        noteId: selectedNoteId,
      })
      await loadData()
      setSelectedNoteId(null)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to attach note')
      }
    }
  }

  const handleDetachNote = async (noteId: number) => {
    // Find the link ID for this note and item
    const link = itemNoteLinks.find(
      (l) =>
        l.noteId === noteId && l.itemId === itemId && l.itemType === itemType,
    )

    if (!link) {
      setError('Could not find attachment link to delete')
      return
    }

    if (!confirm('Are you sure you want to detach this note?')) return

    try {
      await deleteItemNote(link.id)
      await loadData()
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to detach note')
      }
    }
  }

  const handleCreateAndAttachNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNoteTitle || !newNoteBody) return

    try {
      const newNote = await createNote({
        title: newNoteTitle,
        body: newNoteBody,
        subtitle: '', // Optional
        publishedAt: undefined, // Draft by default
      })

      await createItemNote({
        itemId,
        itemType,
        noteId: newNote.id,
      })

      await loadData()
      setIsCreating(false)
      setNewNoteTitle('')
      setNewNoteBody('')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to create and attach note')
      }
    }
  }

  if (isLoading) return <div>Loading notes...</div>

  // Filter out already attached notes from available notes
  const attachableNotes = availableNotes.filter(
    (n) => !attachedNotes.find((an) => an.id === n.id),
  )

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-lg font-semibold mb-4">Attached Notes</h3>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="space-y-4 mb-6">
        {attachedNotes.length === 0 ? (
          <p className="text-gray-500">No notes attached.</p>
        ) : (
          attachedNotes.map((note) => (
            <div
              key={note.id}
              className="border p-4 rounded flex justify-between items-start"
            >
              <div>
                <h4 className="font-medium">{note.title}</h4>
                <p className="text-sm text-gray-600 truncate max-w-md">
                  {note.subtitle || note.body.substring(0, 100)}
                </p>
              </div>
              <button
                onClick={() => handleDetachNote(note.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Detach
              </button>
            </div>
          ))
        )}
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <h4 className="font-medium mb-3">Add Note</h4>

        <div className="flex gap-4 mb-4">
          <select
            className="border p-2 rounded flex-grow"
            value={selectedNoteId || ''}
            onChange={(e) => setSelectedNoteId(Number(e.target.value))}
          >
            <option value="">Select an existing note...</option>
            {attachableNotes.map((note) => (
              <option key={note.id} value={note.id}>
                {note.title}
              </option>
            ))}
          </select>
          <button
            onClick={handleAttachNote}
            disabled={!selectedNoteId}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Attach
          </button>
        </div>

        <div className="text-center my-2 text-gray-500">- OR -</div>

        {!isCreating ? (
          <>
            {drafts.length > 0 && (
              <DraftManager
                drafts={drafts}
                currentDraftId={currentDraftId}
                lastSaved={lastSaved}
                onRestore={handleRestore}
                onDelete={deleteDraft}
                onStartNew={() => {
                  startNewDraft()
                  setIsCreating(true)
                  setNewNoteTitle('')
                  setNewNoteBody('')
                }}
                onSaveNow={saveDraft}
              />
            )}
            <button
              onClick={() => setIsCreating(true)}
              className="w-full border-2 border-dashed border-gray-300 p-2 text-gray-600 hover:border-gray-400 rounded"
            >
              Create New Note
            </button>
          </>
        ) : (
          <form onSubmit={handleCreateAndAttachNote} className="space-y-3 mt-4">
            <DraftManager
              drafts={drafts}
              currentDraftId={currentDraftId}
              lastSaved={lastSaved}
              onRestore={handleRestore}
              onDelete={deleteDraft}
              onStartNew={() => {
                startNewDraft()
                setNewNoteTitle('')
                setNewNoteBody('')
              }}
              onSaveNow={saveDraft}
            />
            <input
              type="text"
              placeholder="Note Title"
              className="w-full border p-2 rounded"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              required
            />
            <MarkdownEditor
              id="new-note-body"
              value={newNoteBody}
              onChange={setNewNoteBody}
              placeholder="Note Body (Markdown)"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-gray-600 px-3 py-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Create & Attach
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
