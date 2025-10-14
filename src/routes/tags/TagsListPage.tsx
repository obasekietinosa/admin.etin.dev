import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '../../api/client'
import { Tag, deleteTag, fetchTags } from '../../api/tags'

const TagsListPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    data: tags,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
  })

  const {
    mutate: removeTag,
    isPending: isDeleting,
    variables: deletingTagId,
    error: deleteError,
  } = useMutation({
    mutationFn: deleteTag,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })

  const handleDelete = (tag: Tag) => {
    const confirmed = window.confirm(
      `Delete ${tag.name}? This action cannot be undone.`,
    )

    if (!confirmed) {
      return
    }

    removeTag(tag.id)
  }

  return (
    <div className="stack stack--large">
      <div className="cluster cluster--between">
        <div>
          <h2 className="section-title">Discovery tags</h2>
          <p className="muted">
            {tags?.length ?? 0} tag{tags && tags.length !== 1 ? 's' : ''} powering taxonomy metadata.
          </p>
        </div>
        <button
          type="button"
          className="button button--primary"
          onClick={() => navigate('new')}
        >
          Add tag
        </button>
      </div>

      {isLoading && <p>Loading tags…</p>}

      {isError && (
        <div className="alert alert--error" role="alert">
          <p>Unable to load tags.</p>
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
          <p>Failed to delete the tag. Please try again.</p>
          {deleteError instanceof ApiError && <p>{deleteError.message}</p>}
        </div>
      )}

      {tags && tags.length > 0 ? (
        <div className="card">
          <table className="table" aria-label="Tags">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Slug</th>
                <th scope="col">Icon</th>
                <th scope="col">Theme</th>
                <th scope="col" className="table__actions">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tags.map((tag) => (
                <tr key={tag.id}>
                  <th scope="row">
                    <Link to={`${tag.id}`} className="link">
                      {tag.name}
                    </Link>
                  </th>
                  <td>{tag.slug}</td>
                  <td>{tag.icon ?? '—'}</td>
                  <td>{tag.theme ?? '—'}</td>
                  <td className="table__actions">
                    <div className="cluster">
                      <Link to={`${tag.id}`} className="button button--ghost">
                        View
                      </Link>
                      <Link to={`${tag.id}/edit`} className="button button--ghost">
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="button button--danger"
                        onClick={() => handleDelete(tag)}
                        disabled={isDeleting && deletingTagId === tag.id}
                      >
                        {isDeleting && deletingTagId === tag.id ? 'Deleting…' : 'Delete'}
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
            <h3>No tags yet</h3>
            <p>Create your first tag to organize notes, projects, and roles.</p>
            <button
              type="button"
              className="button button--primary"
              onClick={() => navigate('new')}
            >
              Create tag
            </button>
          </div>
        )
      )}
    </div>
  )
}

export default TagsListPage
