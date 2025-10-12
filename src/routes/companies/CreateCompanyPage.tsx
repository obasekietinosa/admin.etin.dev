import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Company, CompanyInput, createCompany } from '../../api/companies'
import { ApiError } from '../../api/client'
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
    <article className="card stack stack--large">
      <header>
        <h2 className="section-title">Create a new company</h2>
        <p className="muted">Fill out the form below to add a company to the platform.</p>
      </header>
      {error instanceof ApiError && (
        <div className="alert alert--error" role="alert">
          <p>Unable to save the company.</p>
          <p>{error.message}</p>
        </div>
      )}
      <CompanyForm
        onSubmit={(values) => mutate(values)}
        isSubmitting={isPending}
        submitLabel="Create company"
      />
    </article>
  )
}

export default CreateCompanyPage
