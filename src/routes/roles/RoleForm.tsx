import {
  ChangeEvent,
  FormEvent,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { Company } from '../../api/companies'
import type { RoleInput } from '../../api/roles'
import {
  buttonVariants,
  errorAlertClassName,
  formHelperClassName,
  formInputClassName,
  formLabelClassName,
  formTextareaClassName,
} from '../ui'

export interface RoleFormInitialValues {
  title: string
  subtitle: string
  startDate: string
  endDate: string
  companyId: number | ''
  description: string
  skills: string[]
}

interface RoleFormProps {
  companies: Company[]
  initialValues?: RoleFormInitialValues
  onSubmit: (values: RoleInput) => void
  isSubmitting: boolean
  submitLabel: string
  secondaryAction?: ReactNode
}

interface RoleFormState {
  title: string
  subtitle: string
  startDate: string
  endDate: string
  companyId: string
  description: string
  skills: string
}

const emptyValues: RoleFormState = {
  title: '',
  subtitle: '',
  startDate: '',
  endDate: '',
  companyId: '',
  description: '',
  skills: '',
}

const RoleForm = ({
  companies,
  initialValues,
  onSubmit,
  isSubmitting,
  submitLabel,
  secondaryAction,
}: RoleFormProps) => {
  const initialState = useMemo<RoleFormState>(() => {
    if (!initialValues) {
      return { ...emptyValues }
    }

    return {
      title: initialValues.title,
      subtitle: initialValues.subtitle,
      startDate: initialValues.startDate,
      endDate: initialValues.endDate,
      companyId: initialValues.companyId === '' ? '' : String(initialValues.companyId),
      description: initialValues.description,
      skills: initialValues.skills.join('\n'),
    }
  }, [initialValues])

  const [values, setValues] = useState<RoleFormState>(initialState)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setValues(initialState)
  }, [initialState])

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!values.title.trim()) {
      setError('Title is required to save a role.')
      return
    }

    if (!values.startDate) {
      setError('Start date is required to save a role.')
      return
    }

    if (!values.companyId) {
      setError('Please select a company for the role.')
      return
    }

    const skills = values.skills
      .split(/\r?\n|,/)
      .map((skill) => skill.trim())
      .filter(Boolean)

    if (skills.length === 0) {
      setError('Add at least one skill associated with this role.')
      return
    }

    const start = new Date(`${values.startDate}T00:00:00Z`)

    if (Number.isNaN(start.getTime())) {
      setError('Provide a valid start date.')
      return
    }

    let end: Date | null = null

    if (values.endDate) {
      const parsed = new Date(`${values.endDate}T00:00:00Z`)
      if (Number.isNaN(parsed.getTime())) {
        setError('Provide a valid end date or leave it blank.')
        return
      }
      end = parsed
    }

    const payload: RoleInput = {
      title: values.title.trim(),
      subtitle: values.subtitle.trim(),
      startDate: start.toISOString(),
      companyId: Number(values.companyId),
      description: values.description.trim(),
      skills,
    }

    if (end) {
      payload.endDate = end.toISOString()
    }

    setError(null)
    onSubmit(payload)
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className={formLabelClassName} htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="Senior Software Engineer"
            className={formInputClassName}
            value={values.title}
            onChange={handleChange}
          />
          <p className={formHelperClassName}>Public job title shown on the site.</p>
        </div>
        <div>
          <label className={formLabelClassName} htmlFor="subtitle">
            Subtitle
          </label>
          <input
            id="subtitle"
            name="subtitle"
            type="text"
            placeholder="Core platform team"
            className={formInputClassName}
            value={values.subtitle}
            onChange={handleChange}
          />
          <p className={formHelperClassName}>Optional context such as team, location, or focus area.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className={formLabelClassName} htmlFor="startDate">
            Start date
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            required
            className={formInputClassName}
            value={values.startDate}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className={formLabelClassName} htmlFor="endDate">
            End date
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            className={formInputClassName}
            value={values.endDate}
            onChange={handleChange}
          />
          <p className={formHelperClassName}>Leave blank if the role is ongoing.</p>
        </div>
      </div>

      <div>
        <label className={formLabelClassName} htmlFor="companyId">
          Company
        </label>
        <select
          id="companyId"
          name="companyId"
          required
          className={formInputClassName}
          value={values.companyId}
          onChange={handleChange}
        >
          <option value="" disabled>
            Select a company…
          </option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={formLabelClassName} htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={6}
          placeholder="Summarize responsibilities using Markdown."
          className={formTextareaClassName}
          value={values.description}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className={formLabelClassName} htmlFor="skills">
          Skills
        </label>
        <textarea
          id="skills"
          name="skills"
          rows={4}
          required
          placeholder="Type each skill on a new line"
          className={formTextareaClassName}
          value={values.skills}
          onChange={handleChange}
        />
        <p className={formHelperClassName}>
          Provide at least one skill. Use separate lines or commas for multiple skills.
        </p>
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

export default RoleForm
