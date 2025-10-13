import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '../../api/client'
import { Role, deleteRole, fetchRoles } from '../../api/roles'
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
    <div className="space-y-8">
      <div
        className={`${panelClassName} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
      >
        <div className="space-y-1">
          <h2 className={sectionHeadingClassName}>Experience roles</h2>
          <p className={mutedTextClassName}>
            {roles?.length ?? 0} role{roles && roles.length !== 1 ? 's' : ''} maintained in the API.
          </p>
        </div>
        <button
          type="button"
          className={buttonVariants.primary}
          onClick={() => navigate('new')}
        >
          Add role
        </button>
      </div>

      {isLoading && (
        <div className={`${panelClassName} text-sm text-slate-300`}>Loading roles…</div>
      )}

      {isError && (
        <div className={`${panelClassName} space-y-4`}>
          <div className={errorAlertClassName} role="alert">
            <p className="font-semibold">Unable to load roles.</p>
            {error instanceof ApiError && <p>{error.message}</p>}
          </div>
          <button
            type="button"
            className={buttonVariants.secondary}
            onClick={() => refetch()}
          >
            Retry
          </button>
        </div>
      )}

      {deleteError && (
        <div className={errorAlertClassName} role="alert">
          <p className="font-semibold">Failed to delete the role. Please try again.</p>
          {deleteError instanceof ApiError && <p>{deleteError.message}</p>}
        </div>
      )}

      {roles && roles.length > 0 ? (
        <div className={tableWrapperClassName}>
          <table className={tableClassName} aria-label="Roles">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th scope="col" className={tableHeadCellClassName}>
                  Title
                </th>
                <th scope="col" className={tableHeadCellClassName}>
                  Company
                </th>
                <th scope="col" className={tableHeadCellClassName}>
                  Duration
                </th>
                <th scope="col" className={tableHeadCellClassName}>
                  Skills
                </th>
                <th scope="col" className={tableHeadCellClassName}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id} className={tableBodyRowClassName}>
                  <th scope="row" className={`${tableBodyCellClassName} space-y-1 font-semibold`}>
                    <Link to={`${role.id}`} className="text-sky-300 transition hover:text-sky-200">
                      {role.title}
                    </Link>
                    {role.subtitle && (
                      <p className={mutedTextClassName} aria-label="Role subtitle">
                        {role.subtitle}
                      </p>
                    )}
                  </th>
                  <td className={tableBodyCellClassName}>
                    {role.companyIcon && (
                      <span aria-hidden="true">{role.companyIcon} </span>
                    )}
                    {role.company}
                  </td>
                  <td className={tableBodyCellClassName}>{formatTenure(role)}</td>
                  <td className={tableBodyCellClassName}>
                    {role.skills.length > 0 ? role.skills.join(', ') : '—'}
                  </td>
                  <td className={tableBodyCellClassName}>
                    <div className="flex flex-wrap gap-2">
                      <Link to={`${role.id}`} className={buttonVariants.ghost}>
                        View
                      </Link>
                      <Link to={`${role.id}/edit`} className={buttonVariants.ghost}>
                        Edit
                      </Link>
                      <button
                        type="button"
                        className={buttonVariants.danger}
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
        !isLoading && !isError && (
          <div className={emptyStateClassName}>
            <h3 className="text-lg font-semibold text-white">No roles yet</h3>
            <p className={sectionSubheadingClassName}>Document your experience by creating the first role.</p>
            <button
              type="button"
              className={buttonVariants.primary}
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
