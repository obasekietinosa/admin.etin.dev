import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '../../api/client'
import { Tag, TagInput, createTag } from '../../api/tags'
import TagForm from './TagForm'

const CreateTagPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    mutate: saveTag,
    isPending: isSaving,
    error,
  } = useMutation({
    mutationFn: (values: TagInput) => createTag(values),
    onSuccess: async (tag: Tag) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['tags'] }),
        queryClient.invalidateQueries({ queryKey: ['tag', tag.id] }),
      ])
      navigate(`/tags/${tag.id}`)
    },
  })

  return (
    <article className="card stack stack--large">
      <header>
        <h2 className="section-title">Create a new tag</h2>
        <p className="muted">
          Establish a tag that can be applied across notes, projects, and roles.
        </p>
      </header>

      {error instanceof ApiError && (
        <div className="alert alert--error" role="alert">
          <p>Unable to save the tag.</p>
          <p>{error.message}</p>
        </div>
      )}

      <TagForm
        onSubmit={(values) => saveTag(values)}
        isSubmitting={isSaving}
        submitLabel="Create tag"
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

export default CreateTagPage
