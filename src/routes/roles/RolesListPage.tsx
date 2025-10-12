import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '../../api/client'
import { Role, deleteRole, fetchRoles } from '../../api/roles'

const isOngoing = (value: string) => !value || value.startsWith('0001-01-01')

const displayDate = (value: string) => {
  if (!value) {
    return 'Unknown'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Unknown'
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
  }).format(date)
}

const formatTenure = (role: Role) => {
  const start = displayDate(role.startDate)
  const end = isOngoing(role.endDate) ? 'Present' : displayDate(role.endDate)

  return `${start} – ${end}`
}

const RolesListPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    data: roles,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['roles'],
    queryFn: fetchRoles,
  })

  const {
    mutate: removeRole,
    isPending: isDeleting,
    variables: deletingRoleId,
    error: deleteError,
  } = useMutation({
    mutationFn: deleteRole,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
  })

  const handleDelete = (role: Role) => {
    const confirmed = window.confirm(
      `Delete ${role.title}? This action cannot be undone.`,
    )

    if (!confirmed) {
      return
    }

    removeRole(role.id)
  }

  return (
    <div className="stack stack--large">
      <div className="cluster cluster--between">
        <div>
          <h2 className="section-title">Experience roles</h2>
          <p className="muted">
            {roles?.length ?? 0} role
            {roles && roles.length !== 1 ? 's' : ''} maintained in the API.
          </p>
        </div>
        <button
          type="button"
          className="button button--primary"
          onClick={() => navigate('new')}
        >
          Add role
        </button>
      </div>

      {isLoading && <p>Loading roles…</p>}

      {isError && (
        <div className="alert alert--error" role="alert">
          <p>Unable to load roles.</p>
          {error instanceof ApiError && <p>{error.message}</p>}
          <button
            type="button"
            className="button button--secondary"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </div>
      )}

      {deleteError && (
        <div className="alert alert--error" role="alert">
          <p>Failed to delete the role. Please try again.</p>
          {deleteError instanceof ApiError && <p>{deleteError.message}</p>}
        </div>
      )}

      {roles && roles.length > 0 ? (
        <div className="card">
          <table className="table" aria-label="Roles">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Company</th>
                <th scope="col">Duration</th>
                <th scope="col">Skills</th>
                <th scope="col" className="table__actions">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id}>
                  <th scope="row">
                    <Link to={`${role.id}`} className="link">
                      {role.title}
                    </Link>
                    {role.subtitle && (
                      <p className="muted" aria-label="Role subtitle">
                        {role.subtitle}
                      </p>
                    )}
                  </th>
                  <td>
                    {role.companyIcon && (
                      <span aria-hidden="true">{role.companyIcon} </span>
                    )}
                    {role.company}
                  </td>
                  <td>{formatTenure(role)}</td>
                  <td>
                    {role.skills.length > 0 ? role.skills.join(', ') : '—'}
                  </td>
                  <td className="table__actions">
                    <div className="cluster">
                      <Link to={`${role.id}`} className="button button--ghost">
                        View
                      </Link>
                      <Link to={`${role.id}/edit`} className="button button--ghost">
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="button button--danger"
                        onClick={() => handleDelete(role)}
                        disabled={isDeleting && deletingRoleId === role.id}
                      >
                        {isDeleting && deletingRoleId === role.id
                          ? 'Deleting…'
                          : 'Delete'}
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
            <h3>No roles yet</h3>
            <p>Document your experience by creating the first role.</p>
            <button
              type="button"
              className="button button--primary"
              onClick={() => navigate('new')}
            >
              Create role
            </button>
          </div>
        )
      )}
    </div>
  )
}

export default RolesListPage
