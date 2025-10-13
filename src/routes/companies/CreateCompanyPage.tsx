import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Company, CompanyInput, createCompany } from '../../api/companies'
import { ApiError } from '../../api/client'
import {
  buttonVariants,
  errorAlertClassName,
  panelClassName,
  sectionHeadingClassName,
  sectionSubheadingClassName,
} from '../ui'
import CompanyForm from './CompanyForm'

const CreateCompanyPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { mutate, isPending, error } = useMutation({
    mutationFn: (values: CompanyInput) => createCompany(values),
    onSuccess: async (company: Company) => {
      await queryClient.invalidateQueries({ queryKey: ['companies'] })
      navigate(`/companies/${company.id}`)
    },
  })

  return (
    <article className={`${panelClassName} space-y-6`}>
      <header className="space-y-2">
        <h2 className={sectionHeadingClassName}>Create a new company</h2>
        <p className={sectionSubheadingClassName}>
          Fill out the form below to add a company to the platform.
        </p>
      </header>
      {error instanceof ApiError && (
        <div className={errorAlertClassName} role="alert">
          <p className="font-semibold">Unable to save the company.</p>
          <p>{error.message}</p>
        </div>
      )}
      <CompanyForm
        onSubmit={(values) => mutate(values)}
        isSubmitting={isPending}
        submitLabel="Create company"
        secondaryAction={
          <button
            type="button"
            className={buttonVariants.ghost}
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        }
      />
    </article>
  )
}

export default CreateCompanyPage
