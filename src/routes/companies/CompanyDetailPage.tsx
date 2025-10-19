import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  deleteCompany,
  fetchCompany,
  uploadCompanyImage,
} from '../../api/companies'
import { ApiError } from '../../api/client'
import CompanyIcon from '../../components/CompanyIcon'
import ImageUploadForm from '../../components/ImageUploadForm'
import { isLikelyImageUrl } from '../../utils/images'

const CompanyDetailPage = () => {
  const { companyId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const id = Number(companyId)

  const [uploadFormKey, setUploadFormKey] = useState(0)
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null)

  const {
    mutate: uploadImage,
    isPending: isUploading,
    error: uploadError,
    reset: resetUploadError,
  } = useMutation({
    mutationFn: ({ file, altText }: { file: File; altText?: string }) =>
      uploadCompanyImage(id, { file, altText }),
    onMutate: () => {
      setUploadFeedback(null)
    },
    onSuccess: async () => {
      setUploadFeedback('Image uploaded successfully.')
      setUploadFormKey((previous) => previous + 1)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['company', id] }),
        queryClient.invalidateQueries({ queryKey: ['companies'] }),
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
    data: company,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['company', id],
    queryFn: () => fetchCompany(id),
    enabled: Number.isFinite(id),
  })

  const { mutate: removeCompany, isPending: isDeleting } = useMutation({
    mutationFn: deleteCompany,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['companies'] }),
        queryClient.invalidateQueries({ queryKey: ['company', id] }),
      ])
      navigate('..', { replace: true })
    },
  })

  if (!Number.isFinite(id)) {
    return (
      <div className="alert alert--error" role="alert">
        <p>Invalid company identifier.</p>
      </div>
    )
  }

  if (isLoading) {
    return <p>Loading company…</p>
  }

  if (isError || !company) {
    return (
      <div className="alert alert--error" role="alert">
        <p>Unable to load the requested company.</p>
        {error instanceof ApiError && <p>{error.message}</p>}
        <Link to=".." className="button button--secondary">
          Back to companies
        </Link>
      </div>
    )
  }

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete ${company.name}? This action cannot be undone.`,
    )
    if (!confirmed) {
      return
    }
    removeCompany(company.id)
  }

  const iconUrl = isLikelyImageUrl(company.icon) ? company.icon.trim() : null

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
          <p className="muted">Company #{company.id}</p>
          <h2 className="section-title cluster">
            <CompanyIcon icon={company.icon} name={company.name} size="md" />
            <span>{company.name}</span>
          </h2>
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
        <h3 className="section-subtitle">Description</h3>
        <p>{company.description || 'No description provided yet.'}</p>
      </section>
      <section className="stack">
        <h3 className="section-subtitle">Brand imagery</h3>
        {iconUrl ? (
          <div className="media-grid">
            <figure className="media-grid__item">
              <img
                src={iconUrl}
                alt={`Logo for ${company.name}`}
                className="media-grid__image"
              />
              <figcaption className="media-grid__caption">
                Logo for {company.name}
              </figcaption>
            </figure>
          </div>
        ) : (
          <p className="muted">No logo uploaded yet.</p>
        )}

        <ImageUploadForm
          key={uploadFormKey}
          label="Upload a company image"
          helperText="Square or landscape images work best for logos and brand art."
          submitLabel="Upload image"
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

export default CompanyDetailPage
