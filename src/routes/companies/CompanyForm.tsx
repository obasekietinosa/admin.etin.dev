import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from 'react'
import type { CompanyInput } from '../../api/companies'
import {
  buttonVariants,
  errorAlertClassName,
  formHelperClassName,
  formInputClassName,
  formLabelClassName,
  formTextareaClassName,
} from '../ui'

export interface CompanyFormValues extends CompanyInput {}

interface CompanyFormProps {
  initialValues?: CompanyFormValues
  onSubmit: (values: CompanyFormValues) => void
  isSubmitting: boolean
  submitLabel: string
  secondaryAction?: ReactNode
}

const emptyValues: CompanyFormValues = {
  name: '',
  icon: '',
  description: '',
}

const CompanyForm = ({
  initialValues,
  onSubmit,
  isSubmitting,
  submitLabel,
  secondaryAction,
}: CompanyFormProps) => {
  const [values, setValues] = useState<CompanyFormValues>(initialValues ?? emptyValues)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialValues) {
      setValues(initialValues)
    }
  }, [initialValues])

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!values.name.trim()) {
      setError('Name is required to save a company.')
      return
    }
    setError(null)
    onSubmit({
      name: values.name.trim(),
      icon: values.icon.trim(),
      description: values.description.trim(),
    })
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className={formLabelClassName} htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Acme Inc."
            className={formInputClassName}
            value={values.name}
            onChange={handleChange}
          />
          <p className={formHelperClassName}>Public display name for the company.</p>
        </div>
        <div>
          <label className={formLabelClassName} htmlFor="icon">
            Icon
          </label>
          <input
            id="icon"
            name="icon"
            type="text"
            placeholder="🚀"
            className={formInputClassName}
            value={values.icon}
            onChange={handleChange}
          />
          <p className={formHelperClassName}>Emoji or short label used alongside the company name.</p>
        </div>
      </div>
      <div>
        <label className={formLabelClassName} htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          placeholder="What does this company do?"
          className={formTextareaClassName}
          value={values.description}
          onChange={handleChange}
        />
        <p className={formHelperClassName}>Provide a concise overview of the company&apos;s focus.</p>
      </div>
      {error && (
        <div className={errorAlertClassName} role="alert">
          <p>{error}</p>
        </div>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className={buttonVariants.primary} disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </button>
        {secondaryAction}
      </div>
    </form>
  )
}

export default CompanyForm
