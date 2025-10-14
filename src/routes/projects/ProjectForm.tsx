import {
  ChangeEvent,
  FormEvent,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ProjectInput } from '../../api/projects'

export interface ProjectFormInitialValues {
  title: string
  description: string
  startDate: string
  endDate: string
}

interface ProjectFormProps {
  initialValues?: ProjectFormInitialValues
  onSubmit: (values: ProjectInput) => void
  isSubmitting: boolean
  submitLabel: string
  secondaryAction?: ReactNode
}

interface ProjectFormState {
  title: string
  description: string
  startDate: string
  endDate: string
}

const emptyValues: ProjectFormState = {
  title: '',
  description: '',
  startDate: '',
  endDate: '',
}

const ProjectForm = ({
  initialValues,
  onSubmit,
  isSubmitting,
  submitLabel,
  secondaryAction,
}: ProjectFormProps) => {
  const initialState = useMemo<ProjectFormState>(() => {
    if (!initialValues) {
      return { ...emptyValues }
    }

    return {
      title: initialValues.title,
      description: initialValues.description,
      startDate: initialValues.startDate,
      endDate: initialValues.endDate,
    }
  }, [initialValues])

  const [values, setValues] = useState<ProjectFormState>(initialState)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setValues(initialState)
  }, [initialState])

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!values.title.trim()) {
      setError('Title is required to save a project.')
      return
    }

    if (!values.startDate) {
      setError('Start date is required to save a project.')
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

    if (!values.description.trim()) {
      setError('Description is required to save a project.')
      return
    }

    const payload: ProjectInput = {
      title: values.title.trim(),
      description: values.description.trim(),
      startDate: start.toISOString(),
    }

    if (end) {
      payload.endDate = end.toISOString()
    }

    setError(null)
    onSubmit(payload)
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="form__grid">
        <div className="form__field">
          <label className="form__label" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="Project Alpha rollout"
            className="form__input"
            value={values.title}
            onChange={handleChange}
          />
          <p className="form__helper">Public facing project name.</p>
        </div>
        <div className="form__field">
          <label className="form__label" htmlFor="startDate">
            Start date
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            required
            className="form__input"
            value={values.startDate}
            onChange={handleChange}
          />
          <p className="form__helper">When did work on this project begin?</p>
        </div>
        <div className="form__field">
          <label className="form__label" htmlFor="endDate">
            End date
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            className="form__input"
            value={values.endDate}
            onChange={handleChange}
          />
          <p className="form__helper">Leave blank if the project is ongoing.</p>
        </div>
      </div>

      <div className="form__field">
        <label className="form__label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={6}
          required
          placeholder="Summarize the problem, process, and measurable impact."
          className="form__textarea"
          value={values.description}
          onChange={handleChange}
        />
      </div>

      {error && (
        <div className="alert alert--error" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="form__actions">
        <button type="submit" className="button button--primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </button>
        {secondaryAction}
      </div>
    </form>
  )
}

export default ProjectForm
