import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ApiError } from '../../api/client'
import {
  deleteProject,
  fetchProject,
  uploadProjectImage,
} from '../../api/projects'
import ImageUploadForm from '../../components/ImageUploadForm'

const isOngoing = (value?: string | null) =>
  !value || value.startsWith('0001-01-01')

const formatDate = (value?: string | null) => {
  if (!value) {
    return 'Unknown'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Unknown'
  }

  return new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
  }).format(date)
}

const ProjectDetailPage = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const id = Number(projectId)

  const [uploadFormKey, setUploadFormKey] = useState(0)
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null)

  const {
    mutate: uploadImage,
    isPending: isUploading,
    error: uploadError,
    reset: resetUploadError,
  } = useMutation({
    mutationFn: ({ file, altText }: { file: File; altText?: string }) =>
      uploadProjectImage(id, { file, altText }),
    onMutate: () => {
      setUploadFeedback(null)
    },
    onSuccess: async () => {
      setUploadFeedback('Image uploaded successfully.')
      setUploadFormKey((previous) => previous + 1)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['project', id] }),
        queryClient.invalidateQueries({ queryKey: ['projects'] }),
      ])
    },
    onError: () => {
      setUploadFeedback(null)
    },
  })

  useEffect(() => {
    if (!uploadFeedback) {
      return
    }

    const timeout = window.setTimeout(() => setUploadFeedback(null), 5000)
    return () => window.clearTimeout(timeout)
  }, [uploadFeedback])

  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProject(id),
    enabled: Number.isFinite(id),
  })

  const { mutate: removeProject, isPending: isDeleting } = useMutation({
    mutationFn: deleteProject,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['projects'] }),
        queryClient.invalidateQueries({ queryKey: ['project', id] }),
      ])
      navigate('..', { replace: true })
    },
  })

  if (!Number.isFinite(id)) {
    return (
      <div className="alert alert--error" role="alert">
        <p>Invalid project identifier.</p>
      </div>
    )
  }

  if (isLoading) {
    return <p>Loading project…</p>
  }

  if (isError || !project) {
    return (
      <div className="alert alert--error" role="alert">
        <p>Unable to load the requested project.</p>
        {error instanceof ApiError && <p>{error.message}</p>}
        <Link to=".." className="button button--secondary">
          Back to projects
        </Link>
      </div>
    )
  }

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete ${project.title}? This action cannot be undone.`,
    )

    if (!confirmed) {
      return
    }

    removeProject(project.id)
  }

  const primaryImageUrl =
    project.coverImageUrl ?? (project as { imageUrl?: string | null }).imageUrl ?? null
  const primaryImageAlt =
    project.coverImageAlt ?? (project as { imageAlt?: string | null }).imageAlt ?? ''
  const galleryImages = project.images ?? []

  const displayImages: Array<{ key: string | number; url: string; altText: string }> =
    galleryImages.length > 0
      ? galleryImages.map((image) => ({
          key: image.id,
          url: image.url,
          altText:
            image.altText && image.altText.trim().length > 0
              ? image.altText
              : primaryImageAlt || `Visual for ${project.title}`,
        }))
      : primaryImageUrl
        ? [
            {
              key: 'primary',
              url: primaryImageUrl,
              altText:
                primaryImageAlt && primaryImageAlt.trim().length > 0
                  ? primaryImageAlt
                  : `Visual for ${project.title}`,
            },
          ]
        : []

  const uploadErrorMessage =
    uploadError instanceof ApiError
      ? uploadError.message
      : uploadError
        ? 'Unable to upload the image. Please try again.'
        : null

  return (
    <article className="card stack stack--large">
      <header className="cluster cluster--between">
        <div>
          <p className="muted">Project #{project.id}</p>
          <h2 className="section-title">{project.title}</h2>
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
        <h3 className="section-subtitle">Timeline</h3>
        <p>
          {formatDate(project.startDate)} –{' '}
          {isOngoing(project.endDate) ? 'Present' : formatDate(project.endDate)}
        </p>
      </section>

      <section>
        <h3 className="section-subtitle">Description</h3>
        <p>{project.description || 'No description provided yet.'}</p>
      </section>

      <section className="stack">
        <h3 className="section-subtitle">Images</h3>
        {displayImages.length > 0 ? (
          <div className="media-grid">
            {displayImages.map((image) => (
              <figure key={image.key} className="media-grid__item">
                <img src={image.url} alt={image.altText} className="media-grid__image" />
                {image.altText && (
                  <figcaption className="media-grid__caption">{image.altText}</figcaption>
                )}
              </figure>
            ))}
          </div>
        ) : (
          <p className="muted">No images uploaded yet.</p>
        )}

        <ImageUploadForm
          key={uploadFormKey}
          label="Upload a project image"
          helperText="Accepted formats: JPG, PNG, GIF, and WebP."
          isSubmitting={isUploading}
          onSubmit={({ file, altText }) => {
            resetUploadError()
            uploadImage({ file, altText })
          }}
          errorMessage={uploadErrorMessage}
        />

        {uploadFeedback && (
          <div className="alert alert--success" role="status">
            <p>{uploadFeedback}</p>
          </div>
        )}
      </section>

      <footer className="cluster">
        <Link to=".." className="button button--ghost">
          Back to list
        </Link>
      </footer>
    </article>
  )
}

export default ProjectDetailPage
