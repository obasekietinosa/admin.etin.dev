import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ApiError } from '../../api/client'
import { deleteRole, fetchRole } from '../../api/roles'
import {
  buttonVariants,
  errorAlertClassName,
  mutedTextClassName,
  panelClassName,
  sectionHeadingClassName,
  sectionSubheadingClassName,
} from '../ui'

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
      <div className={errorAlertClassName} role="alert">
        <p className="font-semibold">Invalid role identifier.</p>
      </div>
    )
  }

  if (isLoading) {
    return <div className={`${panelClassName} text-sm text-slate-300`}>Loading role…</div>
  }

  if (isError || !role) {
    return (
      <div className={`${panelClassName} space-y-4`}>
        <div className={errorAlertClassName} role="alert">
          <p className="font-semibold">Unable to load the requested role.</p>
          {error instanceof ApiError && <p>{error.message}</p>}
        </div>
        <Link to=".." className={buttonVariants.secondary}>
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
    <article className={`${panelClassName} space-y-6`}>
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className={mutedTextClassName}>Role #{role.id}</p>
          <div className="space-y-1">
            <h2 className={sectionHeadingClassName}>{role.title}</h2>
            {role.subtitle && (
              <p className={mutedTextClassName} aria-label="subtitle">
                {role.subtitle}
              </p>
            )}
            <p className={sectionSubheadingClassName}>
              {role.companyIcon && <span aria-hidden="true">{role.companyIcon} </span>}
              {role.company}
            </p>
          </div>
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
          Tenure
        </h3>
        <p className={sectionSubheadingClassName}>
          {formatDate(role.startDate)} – {isOngoing(role.endDate) ? 'Present' : formatDate(role.endDate)}
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
          Description
        </h3>
        <p className={sectionSubheadingClassName}>
          {role.description || 'No description provided yet.'}
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
          Skills
        </h3>
        {role.skills.length > 0 ? (
          <ul className="flex flex-wrap gap-2 text-sm text-slate-200">
            {role.skills.map((skill) => (
              <li
                key={skill}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1"
              >
                {skill}
              </li>
            ))}
          </ul>
        ) : (
          <p className={mutedTextClassName}>No skills recorded.</p>
        )}
      </section>

      <footer className="flex flex-wrap gap-2">
        <Link to=".." className={buttonVariants.ghost}>
          Back to list
        </Link>
      </footer>
    </article>
  )
}

export default RoleDetailPage
