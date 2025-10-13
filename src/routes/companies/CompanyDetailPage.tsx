import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteCompany, fetchCompany } from '../../api/companies'
import { ApiError } from '../../api/client'
import {
  buttonVariants,
  errorAlertClassName,
  mutedTextClassName,
  panelClassName,
  sectionHeadingClassName,
  sectionSubheadingClassName,
} from '../ui'

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
          <p className="font-semibold">Unable to load the requested company.</p>
          {error instanceof ApiError && <p>{error.message}</p>}
        </div>
        <Link to=".." className={buttonVariants.secondary}>
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
    <article className={`${panelClassName} space-y-6`}>
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className={mutedTextClassName}>Company #{company.id}</p>
          <h2 className={`${sectionHeadingClassName} flex items-center gap-2`}>
            {company.icon && <span aria-hidden="true">{company.icon}</span>}
            <span>{company.name}</span>
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="edit" className={buttonVariants.secondary}>
            Edit
          </Link>
          <button
            type="button"
            className={buttonVariants.danger}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </header>
      <section className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
          Description
        </h3>
        <p className={sectionSubheadingClassName}>
          {company.description || 'No description provided yet.'}
        </p>
      </section>
      <footer className="flex flex-wrap gap-2">
        <Link to=".." className={buttonVariants.ghost}>
          Back to list
        </Link>
      </footer>
    </article>
  )
}

export default CompanyDetailPage
