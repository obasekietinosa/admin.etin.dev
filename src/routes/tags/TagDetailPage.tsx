import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ApiError } from '../../api/client'
import { deleteTag, fetchTag } from '../../api/tags'

const TagDetailPage = () => {
  const { tagId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const id = Number(tagId)

  const {
    data: tag,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['tag', id],
    queryFn: () => fetchTag(id),
    enabled: Number.isFinite(id),
  })

  const { mutate: removeTag, isPending: isDeleting } = useMutation({
    mutationFn: deleteTag,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['tags'] }),
        queryClient.invalidateQueries({ queryKey: ['tag', id] }),
      ])
      navigate('..', { replace: true })
    },
  })

  if (!Number.isFinite(id)) {
    return (
      <div className="alert alert--error" role="alert">
        <p>Invalid tag identifier.</p>
      </div>
    )
  }

  if (isLoading) {
    return <p>Loading tag…</p>
  }

  if (isError || !tag) {
    return (
      <div className="alert alert--error" role="alert">
        <p>Unable to load the requested tag.</p>
        {error instanceof ApiError && <p>{error.message}</p>}
        <Link to=".." className="button button--secondary">
          Back to tags
        </Link>
      </div>
    )
  }

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete ${tag.name}? This action cannot be undone.`,
    )

    if (!confirmed) {
      return
    }

    removeTag(tag.id)
  }

  return (
    <article className="card stack stack--large">
      <header className="cluster cluster--between">
        <div>
          <p className="muted">Tag #{tag.id}</p>
          <h2 className="section-title">{tag.name}</h2>
          <p>
            <span className="muted" aria-label="slug">
              Slug: {tag.slug}
            </span>
          </p>
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
        <h3 className="section-subtitle">Icon</h3>
        <p>{tag.icon ?? 'No icon provided yet.'}</p>
      </section>

      <section>
        <h3 className="section-subtitle">Theme</h3>
        <p>{tag.theme ?? 'No theme assigned.'}</p>
      </section>

      <footer className="cluster">
        <Link to=".." className="button button--ghost">
          Back to list
        </Link>
      </footer>
    </article>
  )
}

export default TagDetailPage
