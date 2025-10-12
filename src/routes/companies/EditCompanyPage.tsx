import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Company,
  CompanyInput,
  fetchCompany,
  updateCompany,
} from '../../api/companies'
import { ApiError } from '../../api/client'
import CompanyForm from './CompanyForm'

const EditCompanyPage = () => {
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

  const {
    mutate: saveCompany,
    isPending,
    error: mutationError,
  } = useMutation({
    mutationFn: (values: CompanyInput) => updateCompany(id, values),
    onSuccess: async (updated: Company) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['companies'] }),
        queryClient.invalidateQueries({ queryKey: ['company', id] }),
      ])
      navigate(`/companies/${updated.id}`)
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
        <p>Unable to load the company for editing.</p>
        {error instanceof ApiError && <p>{error.message}</p>}
        <Link to=".." className="button button--secondary">
          Back to companies
        </Link>
      </div>
    )
  }

  return (
    <article className="card stack stack--large">
      <header className="stack">
        <h2 className="section-title">Update {company.name}</h2>
        <p className="muted">Make changes below and save when you&apos;re ready.</p>
      </header>
      {mutationError instanceof ApiError && (
        <div className="alert alert--error" role="alert">
          <p>Unable to update the company.</p>
          <p>{mutationError.message}</p>
        </div>
      )}
      <CompanyForm
        initialValues={{
          name: company.name,
          icon: company.icon,
          description: company.description,
        }}
        onSubmit={(values) => saveCompany(values)}
        isSubmitting={isPending}
        submitLabel="Save changes"
        secondaryAction={
          <Link to={`../${company.id}`} className="button button--ghost">
            Cancel
          </Link>
        }
      />
    </article>
  )
}

export default EditCompanyPage
