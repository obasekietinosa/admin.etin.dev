import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteCompany, fetchCompany } from '../../api/companies'
import { ApiError } from '../../api/client'

const CompanyDetailPage = () => {
  const { companyId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const id = Number(companyId)

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

  return (
    <article className="card stack stack--large">
      <header className="cluster cluster--between">
        <div>
          <p className="muted">Company #{company.id}</p>
          <h2 className="section-title">
            {company.icon && <span aria-hidden="true">{company.icon} </span>}
            {company.name}
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
      <footer className="cluster">
        <Link to=".." className="button button--ghost">
          Back to list
        </Link>
      </footer>
    </article>
  )
}

export default CompanyDetailPage
