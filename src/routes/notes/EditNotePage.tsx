import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ApiError } from '../../api/client'
import { NoteInput, fetchNote, updateNote } from '../../api/notes'
import NoteForm, { NoteFormInitialValues } from './NoteForm'

const EditNotePage = () => {
  const { noteId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const id = Number(noteId)

  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNote(id),
    enabled: Number.isFinite(id),
  })

  const {
    mutate: saveNote,
    isPending: isSaving,
    error: mutationError,
  } = useMutation({
    mutationFn: (values: NoteInput) => updateNote(id, values),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['notes'] }),
        queryClient.invalidateQueries({ queryKey: ['note', id] }),
      ])
      navigate(`/notes/${id}`)
    },
  })

  if (!Number.isFinite(id)) {
    return (
      <div className="alert alert--error" role="alert">
        <p>Invalid note identifier.</p>
        <Link to=".." className="button button--secondary">
          Back to notes
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return <p>Loading note…</p>
  }

  if (isError || !note) {
    return (
      <div className="alert alert--error" role="alert">
        <p>Unable to load the requested note.</p>
        {error instanceof ApiError && <p>{error.message}</p>}
        <Link to=".." className="button button--secondary">
          Back to notes
        </Link>
      </div>
    )
  }

  const initialValues: NoteFormInitialValues = {
    title: note.title,
    subtitle: note.subtitle ?? '',
    body: note.body,
    publishedAt: note.publishedAt,
  }

  return (
    <article className="card stack stack--large">
      <header>
        <h2 className="section-title">Edit note</h2>
        <p className="muted">Update the draft before publishing to etin.dev.</p>
      </header>

      {mutationError instanceof ApiError && (
        <div className="alert alert--error" role="alert">
          <p>Unable to update the note.</p>
          <p>{mutationError.message}</p>
        </div>
      )}

      <NoteForm
        initialValues={initialValues}
        onSubmit={(values) => saveNote(values)}
        isSubmitting={isSaving}
        submitLabel="Save changes"
        secondaryAction={
          <button
            type="button"
            className="button button--ghost"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        }
      />
    </article>
  )
}

export default EditNotePage
