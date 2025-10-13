import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Company,
  CompanyInput,
  fetchCompany,
  updateCompany,
} from '../../api/companies'
import { ApiError } from '../../api/client'
import {
  buttonVariants,
  errorAlertClassName,
  panelClassName,
  sectionHeadingClassName,
  sectionSubheadingClassName,
} from '../ui'
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
      <div className={errorAlertClassName} role="alert">
        <p className="font-semibold">Invalid company identifier.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={`${panelClassName} text-sm text-slate-300`}>Loading company…</div>
    )
  }

  if (isError || !company) {
    return (
      <div className={`${panelClassName} space-y-4`}>
        <div className={errorAlertClassName} role="alert">
          <p className="font-semibold">Unable to load the company for editing.</p>
          {error instanceof ApiError && <p>{error.message}</p>}
        </div>
        <Link to=".." className={buttonVariants.secondary}>
          Back to companies
        </Link>
      </div>
    )
  }

  return (
    <article className={`${panelClassName} space-y-6`}>
      <header className="space-y-2">
        <h2 className={sectionHeadingClassName}>Update {company.name}</h2>
        <p className={sectionSubheadingClassName}>
          Make changes below and save when you&apos;re ready.
        </p>
      </header>
      {mutationError instanceof ApiError && (
        <div className={errorAlertClassName} role="alert">
          <p className="font-semibold">Unable to update the company.</p>
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
          <Link to={`../${company.id}`} className={buttonVariants.ghost}>
            Cancel
          </Link>
        }
      />
    </article>
  )
}

export default EditCompanyPage
