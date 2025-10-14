import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '../../api/client'
import { Note, deleteNote, fetchNotes } from '../../api/notes'

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
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const NotesListPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    data: notes,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['notes'],
    queryFn: fetchNotes,
  })

  const {
    mutate: removeNote,
    isPending: isDeleting,
    variables: deletingNoteId,
    error: deleteError,
  } = useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  const handleDelete = (note: Note) => {
    const confirmed = window.confirm(
      `Delete ${note.title}? This action cannot be undone.`,
    )

    if (!confirmed) {
      return
    }

    removeNote(note.id)
  }

  return (
    <div className="stack stack--large">
      <div className="cluster cluster--between">
        <div>
          <h2 className="section-title">Long-form notes</h2>
          <p className="muted">
            {notes?.length ?? 0} note{notes && notes.length !== 1 ? 's' : ''} keeping ideas in motion.
          </p>
        </div>
        <button
          type="button"
          className="button button--primary"
          onClick={() => navigate('new')}
        >
          Add note
        </button>
      </div>

      {isLoading && <p>Loading notes…</p>}

      {isError && (
        <div className="alert alert--error" role="alert">
          <p>Unable to load notes.</p>
          {error instanceof ApiError && <p>{error.message}</p>}
          <button
            type="button"
            className="button button--secondary"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </div>
      )}

      {deleteError && (
        <div className="alert alert--error" role="alert">
          <p>Failed to delete the note. Please try again.</p>
          {deleteError instanceof ApiError && <p>{deleteError.message}</p>}
        </div>
      )}

      {notes && notes.length > 0 ? (
        <div className="card">
          <table className="table" aria-label="Notes">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Subtitle</th>
                <th scope="col">Published</th>
                <th scope="col" className="table__actions">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {notes.map((note) => (
                <tr key={note.id}>
                  <th scope="row">
                    <Link to={`${note.id}`} className="link">
                      {note.title}
                    </Link>
                  </th>
                  <td>{note.subtitle || '—'}</td>
                  <td>{formatPublishedAt(note.publishedAt)}</td>
                  <td className="table__actions">
                    <div className="cluster">
                      <Link to={`${note.id}`} className="button button--ghost">
                        View
                      </Link>
                      <Link to={`${note.id}/edit`} className="button button--ghost">
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="button button--danger"
                        onClick={() => handleDelete(note)}
                        disabled={isDeleting && deletingNoteId === note.id}
                      >
                        {isDeleting && deletingNoteId === note.id
                          ? 'Deleting…'
                          : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !isLoading && (
          <div className="empty-state">
            <h3>No notes yet</h3>
            <p>Start capturing drafts, essays, and experiments in one place.</p>
            <button
              type="button"
              className="button button--primary"
              onClick={() => navigate('new')}
            >
              Create note
            </button>
          </div>
        )
      )}
    </div>
  )
}

export default NotesListPage
