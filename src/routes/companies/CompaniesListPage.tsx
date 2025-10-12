import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import {
  Company,
  deleteCompany,
  fetchCompanies,
} from '../../api/companies'
import { ApiError } from '../../api/client'

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
    <div className="stack stack--large">
      <div className="cluster cluster--between">
        <div>
          <h2 className="section-title">Company directory</h2>
          <p className="muted">
            {companies?.length ?? 0} company{companies && companies.length !== 1 ? 'ies' : ''}{' '}
            managed through the API.
          </p>
        </div>
        <button
          type="button"
          className="button button--primary"
          onClick={() => navigate('new')}
        >
          Add company
        </button>
      </div>

      {isLoading && <p>Loading companies…</p>}

      {isError && (
        <div className="alert alert--error" role="alert">
          <p>Unable to load companies.</p>
          {error instanceof ApiError && <p>{error.message}</p>}
          <button type="button" className="button button--secondary" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      )}

      {deleteError && (
        <div className="alert alert--error" role="alert">
          <p>Failed to delete the company. Please try again.</p>
          {deleteError instanceof ApiError && <p>{deleteError.message}</p>}
        </div>
      )}

      {companies && companies.length > 0 ? (
        <div className="card">
          <table className="table" aria-label="Companies">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Icon</th>
                <th scope="col">Description</th>
                <th scope="col" className="table__actions">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id}>
                  <th scope="row">
                    <Link to={`${company.id}`} className="link">
                      {company.name}
                    </Link>
                  </th>
                  <td>{company.icon}</td>
                  <td>{company.description}</td>
                  <td className="table__actions">
                    <div className="cluster">
                      <Link to={`${company.id}`} className="button button--ghost">
                        View
                      </Link>
                      <Link to={`${company.id}/edit`} className="button button--ghost">
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="button button--danger"
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
        !isLoading && (
          <div className="empty-state">
            <h3>No companies yet</h3>
            <p>Get started by creating your first company profile.</p>
            <button
              type="button"
              className="button button--primary"
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
