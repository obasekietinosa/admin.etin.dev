import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ApiError } from '../../api/client'
import { deleteRole, fetchRole } from '../../api/roles'

const isOngoing = (value: string) => !value || value.startsWith('0001-01-01')

const formatDate = (value: string) => {
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

const RoleDetailPage = () => {
  const { roleId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const id = Number(roleId)

  const {
    data: role,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['role', id],
    queryFn: () => fetchRole(id),
    enabled: Number.isFinite(id),
  })

  const { mutate: removeRole, isPending: isDeleting } = useMutation({
    mutationFn: deleteRole,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['roles'] }),
        queryClient.invalidateQueries({ queryKey: ['role', id] }),
      ])
      navigate('..', { replace: true })
    },
  })

  if (!Number.isFinite(id)) {
    return (
      <div className="alert alert--error" role="alert">
        <p>Invalid role identifier.</p>
      </div>
    )
  }

  if (isLoading) {
    return <p>Loading role…</p>
  }

  if (isError || !role) {
    return (
      <div className="alert alert--error" role="alert">
        <p>Unable to load the requested role.</p>
        {error instanceof ApiError && <p>{error.message}</p>}
        <Link to=".." className="button button--secondary">
          Back to roles
        </Link>
      </div>
    )
  }

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete ${role.title}? This action cannot be undone.`,
    )

    if (!confirmed) {
      return
    }

    removeRole(role.id)
  }

  return (
    <article className="card stack stack--large">
      <header className="cluster cluster--between">
        <div>
          <p className="muted">Role #{role.id}</p>
          <h2 className="section-title">
            {role.title}
            {role.subtitle && (
              <span className="muted" aria-label="subtitle">
                {' '}
                · {role.subtitle}
              </span>
            )}
          </h2>
          <p>
            {role.companyIcon && <span aria-hidden="true">{role.companyIcon} </span>}
            {role.company}
          </p>
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
        <h3 className="section-subtitle">Tenure</h3>
        <p>
          {formatDate(role.startDate)} –{' '}
          {isOngoing(role.endDate) ? 'Present' : formatDate(role.endDate)}
        </p>
      </section>

      <section>
        <h3 className="section-subtitle">Description</h3>
        <p>{role.description || 'No description provided yet.'}</p>
      </section>

      <section>
        <h3 className="section-subtitle">Skills</h3>
        {role.skills.length > 0 ? (
          <ul className="list">
            {role.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        ) : (
          <p>No skills recorded.</p>
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

export default RoleDetailPage
