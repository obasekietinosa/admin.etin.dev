import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '../../api/client'
import { Note, NoteInput, createNote } from '../../api/notes'
import NoteForm from './NoteForm'

const CreateNotePage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    mutate: saveNote,
    isPending: isSaving,
    error,
  } = useMutation({
    mutationFn: (values: NoteInput) => createNote(values),
    onSuccess: async (note: Note) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['notes'] }),
        queryClient.invalidateQueries({ queryKey: ['note', note.id] }),
      ])
      navigate(`/notes/${note.id}`)
    },
  })

  return (
    <article className="card stack stack--large">
      <header>
        <h2 className="section-title">Create a new note</h2>
        <p className="muted">
          Draft long-form writing for etin.dev with full revision history.
        </p>
      </header>

      {error instanceof ApiError && (
        <div className="alert alert--error" role="alert">
          <p>Unable to save the note.</p>
          <p>{error.message}</p>
        </div>
      )}

      <NoteForm
        onSubmit={(values) => saveNote(values)}
        isSubmitting={isSaving}
        submitLabel="Create note"
        secondaryAction={
          <button
            type="button"
            className="button button--ghost"
            onClick={() => navigate('..')}
          >
            Cancel
          </button>
        }
      />
    </article>
  )
}

export default CreateNotePage
