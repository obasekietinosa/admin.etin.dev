import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ApiError } from '../../api/client'
import { deleteNote, fetchNote } from '../../api/notes'

const formatPublishedAt = (value: string | null) => {
  if (!value) {
    return 'Draft'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'Unknown'
  }

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const NoteDetailPage = () => {
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

  const { mutate: removeNote, isPending: isDeleting } = useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['notes'] }),
        queryClient.invalidateQueries({ queryKey: ['note', id] }),
      ])
      navigate('..', { replace: true })
    },
  })

  if (!Number.isFinite(id)) {
    return (
      <div className="alert alert--error" role="alert">
        <p>Invalid note identifier.</p>
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

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete ${note.title}? This action cannot be undone.`,
    )

    if (!confirmed) {
      return
    }

    removeNote(note.id)
  }

  return (
    <article className="card stack stack--large">
      <header className="cluster cluster--between">
        <div>
          <p className="muted">Note #{note.id}</p>
          <h2 className="section-title">{note.title}</h2>
          {note.subtitle && <p className="muted">{note.subtitle}</p>}
        </div>
        <div className="cluster">
          <Link to="edit" className="button button--secondary">
            Edit
          </Link>
          <button
            type="button"
            className="button button--danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </header>

      <section>
        <h3 className="section-subtitle">Publication status</h3>
        <p>{formatPublishedAt(note.publishedAt)}</p>
      </section>

      <section>
        <h3 className="section-subtitle">Body</h3>
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
          {note.body || 'No body content yet.'}
        </div>
      </section>

      <footer className="cluster">
        <Link to=".." className="button button--ghost">
          Back to list
        </Link>
      </footer>
    </article>
  )
}

export default NoteDetailPage
