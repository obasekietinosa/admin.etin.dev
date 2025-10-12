import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchCompanies } from '../../api/companies'
import { ApiError } from '../../api/client'
import { Role, RoleInput, fetchRole, updateRole } from '../../api/roles'
import RoleForm, { RoleFormInitialValues } from './RoleForm'

const toDateInputValue = (value: string) => {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime()) || date.getUTCFullYear() === 1) {
    return ''
  }

  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const EditRolePage = () => {
  const { roleId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const id = Number(roleId)

  const {
    data: companies,
    isLoading: isLoadingCompanies,
    isError: isCompaniesError,
    error: companiesError,
    refetch: refetchCompanies,
  } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
  })

  const {
    data: role,
    isLoading: isLoadingRole,
    isError: isRoleError,
    error: roleError,
  } = useQuery({
    queryKey: ['role', id],
    queryFn: () => fetchRole(id),
    enabled: Number.isFinite(id),
  })

  const initialFormValues = useMemo<RoleFormInitialValues | null>(() => {
    if (!role) {
      return null
    }

    return {
      title: role.title,
      subtitle: role.subtitle ?? '',
      startDate: toDateInputValue(role.startDate),
      endDate: toDateInputValue(role.endDate),
      companyId: role.companyId,
      description: role.description ?? '',
      skills: role.skills,
    }
  }, [role])

  const {
    mutate: saveRole,
    isPending: isSaving,
    error: updateError,
  } = useMutation({
    mutationFn: (values: RoleInput) => updateRole(id, values),
    onSuccess: async (updatedRole: Role) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['roles'] }),
        queryClient.invalidateQueries({ queryKey: ['role', id] }),
      ])
      navigate(`/roles/${updatedRole.id}`)
    },
  })

  if (!Number.isFinite(id)) {
    return (
      <div className="alert alert--error" role="alert">
        <p>Invalid role identifier.</p>
        <Link to=".." className="button button--secondary">
          Back to roles
        </Link>
      </div>
    )
  }

  if (isLoadingRole) {
    return <p>Loading role…</p>
  }

  if (isRoleError || !role) {
    return (
      <div className="alert alert--error" role="alert">
        <p>Unable to load the requested role.</p>
        {roleError instanceof ApiError && <p>{roleError.message}</p>}
        <Link to=".." className="button button--secondary">
          Back to roles
        </Link>
      </div>
    )
  }

  return (
    <article className="card stack stack--large">
      <header>
        <h2 className="section-title">Edit role</h2>
        <p className="muted">
          Update the details below and save to publish the latest information.
        </p>
      </header>

      {updateError instanceof ApiError && (
        <div className="alert alert--error" role="alert">
          <p>Unable to save the role.</p>
          <p>{updateError.message}</p>
        </div>
      )}

      {isCompaniesError && (
        <div className="alert alert--error" role="alert">
          <p>Unable to load companies.</p>
          {companiesError instanceof ApiError && <p>{companiesError.message}</p>}
          <button
            type="button"
            className="button button--secondary"
            onClick={() => refetchCompanies()}
          >
            Retry
          </button>
        </div>
      )}

      {isLoadingCompanies && <p>Loading companies…</p>}

      {companies && (
        <RoleForm
          companies={companies}
          onSubmit={(values) => saveRole(values)}
          isSubmitting={isSaving}
          submitLabel="Save changes"
          initialValues={initialFormValues ?? undefined}
          secondaryAction={
            <button
              type="button"
              className="button button--ghost"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          }
        />
      )}
    </article>
  )
}

export default EditRolePage
