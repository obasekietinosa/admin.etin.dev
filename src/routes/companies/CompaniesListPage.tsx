import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import {
  Company,
  deleteCompany,
  fetchCompanies,
} from '../../api/companies'
import { ApiError } from '../../api/client'
import {
  buttonVariants,
  emptyStateClassName,
  errorAlertClassName,
  mutedTextClassName,
  panelClassName,
  sectionHeadingClassName,
  sectionSubheadingClassName,
  tableBodyCellClassName,
  tableBodyRowClassName,
  tableClassName,
  tableHeadCellClassName,
  tableWrapperClassName,
} from '../ui'

const CompaniesListPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    data: companies,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
  })

  const {
    mutate: removeCompany,
    isPending: isDeleting,
    variables: deletingCompanyId,
    error: deleteError,
  } = useMutation({
    mutationFn: deleteCompany,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['companies'] })
    },
  })

  const handleDelete = (company: Company) => {
    const confirmed = window.confirm(
      `Delete ${company.name}? This action cannot be undone.`,
    )
    if (!confirmed) {
      return
    }
    removeCompany(company.id)
  }

  return (
    <div className="space-y-8">
      <div
        className={`${panelClassName} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
      >
        <div className="space-y-1">
          <h2 className={sectionHeadingClassName}>Company directory</h2>
          <p className={mutedTextClassName}>
            {companies?.length ?? 0} company{companies && companies.length !== 1 ? 'ies' : ''} managed through the API.
          </p>
        </div>
        <button
          type="button"
          className={buttonVariants.primary}
          onClick={() => navigate('new')}
        >
          Add company
        </button>
      </div>

      {isLoading && (
        <div className={`${panelClassName} text-sm text-slate-300`}>Loading companies…</div>
      )}

      {isError && (
        <div className={`${panelClassName} space-y-4`}>
          <div className={errorAlertClassName} role="alert">
            <p className="font-semibold">Unable to load companies.</p>
            {error instanceof ApiError && <p>{error.message}</p>}
          </div>
          <button type="button" className={buttonVariants.secondary} onClick={() => refetch()}>
            Retry
          </button>
        </div>
      )}

      {deleteError && (
        <div className={errorAlertClassName} role="alert">
          <p className="font-semibold">Failed to delete the company. Please try again.</p>
          {deleteError instanceof ApiError && <p>{deleteError.message}</p>}
        </div>
      )}

      {companies && companies.length > 0 ? (
        <div className={tableWrapperClassName}>
          <table className={tableClassName} aria-label="Companies">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th scope="col" className={tableHeadCellClassName}>
                  Name
                </th>
                <th scope="col" className={tableHeadCellClassName}>
                  Icon
                </th>
                <th scope="col" className={tableHeadCellClassName}>
                  Description
                </th>
                <th scope="col" className={tableHeadCellClassName}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id} className={tableBodyRowClassName}>
                  <th scope="row" className={`${tableBodyCellClassName} font-semibold`}>
                    <Link to={`${company.id}`} className="text-sky-300 transition hover:text-sky-200">
                      {company.name}
                    </Link>
                  </th>
                  <td className={tableBodyCellClassName}>{company.icon}</td>
                  <td className={tableBodyCellClassName}>{company.description}</td>
                  <td className={tableBodyCellClassName}>
                    <div className="flex flex-wrap gap-2">
                      <Link to={`${company.id}`} className={buttonVariants.ghost}>
                        View
                      </Link>
                      <Link to={`${company.id}/edit`} className={buttonVariants.ghost}>
                        Edit
                      </Link>
                      <button
                        type="button"
                        className={buttonVariants.danger}
                        onClick={() => handleDelete(company)}
                        disabled={isDeleting && deletingCompanyId === company.id}
                      >
                        {isDeleting && deletingCompanyId === company.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !isLoading && !isError && (
          <div className={emptyStateClassName}>
            <h3 className="text-lg font-semibold text-white">No companies yet</h3>
            <p className={sectionSubheadingClassName}>Get started by creating your first company profile.</p>
            <button
              type="button"
              className={buttonVariants.primary}
              onClick={() => navigate('new')}
            >
              Create company
            </button>
          </div>
        )
      )}
    </div>
  )
}

export default CompaniesListPage
