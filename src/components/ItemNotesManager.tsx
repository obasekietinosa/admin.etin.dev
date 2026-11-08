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

  if (isLoading) return <p className="muted">Loading attached notes…</p>

  // Filter out already attached notes from available notes
  const attachableNotes = availableNotes.filter(
    (n) => !attachedNotes.find((an) => an.id === n.id),
  )

  return (
    <div className="mt-8 space-y-6 border-t border-border pt-6">
      <div>
        <h3 className="section-subtitle">Attached Notes</h3>
        <p className="muted">Link long-form notes or case study entries to this record.</p>
      </div>

      {error && (
        <div className="alert alert--error" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-3">
        {attachedNotes.length === 0 ? (
          <p className="muted">No notes attached yet.</p>
        ) : (
          attachedNotes.map((note) => (
            <div
              key={note.id}
              className="flex flex-col justify-between gap-3 rounded-sm border border-border bg-surface/60 p-4 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 space-y-1">
                <h4 className="font-display text-base font-semibold text-foreground">
                  {note.title}
                </h4>
                <p className="truncate text-sm text-muted">
                  {note.subtitle || note.body.substring(0, 100)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDetachNote(note.id)}
                className="button button--danger self-start sm:self-auto"
              >
                Detach
              </button>
            </div>
          ))
        )}
      </div>

      <div className="space-y-4 rounded-sm border border-border bg-surface/40 p-4 sm:p-5">
        <h4 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-bronze-light">
          Add Note
        </h4>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            className="form__input flex-grow"
            value={selectedNoteId || ''}
            onChange={(e) => setSelectedNoteId(Number(e.target.value))}
          >
            <option value="">Select an existing note…</option>
            {attachableNotes.map((note) => (
              <option key={note.id} value={note.id}>
                {note.title}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAttachNote}
            disabled={!selectedNoteId}
            className="button button--secondary shrink-0"
          >
            Attach
          </button>
        </div>

        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-border-inner" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            or
          </span>
          <div className="h-px flex-1 bg-border-inner" />
        </div>

        {!isCreating ? (
          <div className="space-y-3">
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
              type="button"
              onClick={() => setIsCreating(true)}
              className="button button--secondary w-full border-dashed"
            >
              + Create & Attach New Note
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreateAndAttachNote} className="space-y-4 pt-2">
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
            <div className="form__field">
              <label className="form__label" htmlFor="new-note-title">
                Note Title
              </label>
              <input
                id="new-note-title"
                type="text"
                placeholder="Note Title"
                className="form__input"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                required
              />
            </div>
            <div className="form__field">
              <label className="form__label" htmlFor="new-note-body">
                Note Body
              </label>
              <MarkdownEditor
                id="new-note-body"
                value={newNoteBody}
                onChange={setNewNoteBody}
                placeholder="Note Body (Markdown)"
              />
            </div>
            <div className="form__actions justify-end">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="button button--ghost"
              >
                Cancel
              </button>
              <button type="submit" className="button button--primary">
                Create & Attach
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
