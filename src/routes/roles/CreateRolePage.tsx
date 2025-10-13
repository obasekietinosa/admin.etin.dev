import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { fetchCompanies } from '../../api/companies'
import { ApiError } from '../../api/client'
import { Role, RoleInput, createRole } from '../../api/roles'
import {
  buttonVariants,
  errorAlertClassName,
  infoAlertClassName,
  panelClassName,
  sectionHeadingClassName,
  sectionSubheadingClassName,
} from '../ui'
import RoleForm from './RoleForm'

const CreateRolePage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

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
    mutate: saveRole,
    isPending: isSaving,
    error,
  } = useMutation({
    mutationFn: (values: RoleInput) => createRole(values),
    onSuccess: async (role: Role) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['roles'] }),
        queryClient.invalidateQueries({ queryKey: ['role', role.id] }),
      ])
      navigate(`/roles/${role.id}`)
    },
  })

  return (
    <article className={`${panelClassName} space-y-6`}>
      <header className="space-y-2">
        <h2 className={sectionHeadingClassName}>Create a new role</h2>
        <p className={sectionSubheadingClassName}>
          Capture a professional experience entry that will surface on etin.dev.
        </p>
      </header>

      {error instanceof ApiError && (
        <div className={errorAlertClassName} role="alert">
          <p className="font-semibold">Unable to save the role.</p>
          <p>{error.message}</p>
        </div>
      )}

      {isCompaniesError && (
        <div className={errorAlertClassName} role="alert">
          <p className="font-semibold">Unable to load companies.</p>
          {companiesError instanceof ApiError && <p>{companiesError.message}</p>}
          <button
            type="button"
            className={`${buttonVariants.secondary} mt-3`}
            onClick={() => refetchCompanies()}
          >
            Retry
          </button>
        </div>
      )}

      {isLoadingCompanies && (
        <div className={`${panelClassName} text-sm text-slate-300`}>Loading companies…</div>
      )}

      {companies && (
        <RoleForm
          companies={companies}
          onSubmit={(values) => saveRole(values)}
          isSubmitting={isSaving}
          submitLabel="Create role"
          secondaryAction={
            <button
              type="button"
              className={buttonVariants.ghost}
              onClick={() => navigate('..')}
            >
              Cancel
            </button>
          }
        />
      )}

      {companies && companies.length === 0 && !isLoadingCompanies && !isCompaniesError && (
        <div className={infoAlertClassName} role="alert">
          <p>No companies available yet. Create a company before assigning roles.</p>
        </div>
      )}
    </article>
  )
}

export default CreateRolePage
