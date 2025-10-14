import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ApiError } from '../../api/client'
import { Tag, TagInput, fetchTag, updateTag } from '../../api/tags'
import TagForm, { TagFormInitialValues } from './TagForm'

const toInitialValues = (tag: Tag): TagFormInitialValues => ({
  name: tag.name,
  slug: tag.slug,
  icon: tag.icon ?? '',
  theme: tag.theme ?? '',
})

const EditTagPage = () => {
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

  const {
    mutate: saveTag,
    isPending: isSaving,
    error: updateError,
  } = useMutation({
    mutationFn: (values: TagInput) => updateTag(id, values),
    onSuccess: async (updated: Tag) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['tags'] }),
        queryClient.invalidateQueries({ queryKey: ['tag', id] }),
      ])
      navigate(`/tags/${updated.id}`)
    },
  })

  if (!Number.isFinite(id)) {
    return (
      <div className="alert alert--error" role="alert">
        <p>Invalid tag identifier.</p>
        <Link to=".." className="button button--secondary">
          Back to tags
        </Link>
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

  return (
    <article className="card stack stack--large">
      <header>
        <h2 className="section-title">Edit tag</h2>
        <p className="muted">
          Update tag metadata to keep the taxonomy consistent.
        </p>
      </header>

      {updateError instanceof ApiError && (
        <div className="alert alert--error" role="alert">
          <p>Unable to update the tag.</p>
          <p>{updateError.message}</p>
        </div>
      )}

      <TagForm
        initialValues={toInitialValues(tag)}
        onSubmit={(values) => saveTag(values)}
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

export default EditTagPage
