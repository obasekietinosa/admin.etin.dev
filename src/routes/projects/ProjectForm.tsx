import {
  ChangeEvent,
  FormEvent,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ProjectInput } from '../../api/projects'
import MarkdownEditor from '../../components/MarkdownEditor'

export interface ProjectFormInitialValues {
  title: string
  description: string
  startDate: string
  endDate: string
  imageUrl?: string | null
}

export type ProjectSubmitValues = ProjectInput & { imageFile?: File }

interface ProjectFormProps {
  initialValues?: ProjectFormInitialValues
  onSubmit: (values: ProjectSubmitValues) => void
  isSubmitting: boolean
  submitLabel: string
  secondaryAction?: ReactNode
}

interface ProjectFormState {
  title: string
  description: string
  startDate: string
  endDate: string
  imageUrl?: string | null
  imageFile?: File
  imagePreview?: string
}

const emptyValues: ProjectFormState = {
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  imageUrl: null,
  imageFile: undefined,
  imagePreview: undefined,
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
      imageUrl: initialValues.imageUrl,
    }
  }, [initialValues])

  const [values, setValues] = useState<ProjectFormState>(initialState)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setValues(initialState)
  }, [initialState])

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleDescriptionChange = (value: string) => {
    setValues((prev) => ({ ...prev, description: value }))
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setValues((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }))
    }
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

    const payload: ProjectSubmitValues = {
      title: values.title.trim(),
      description: values.description.trim(),
      startDate: start.toISOString(),
      imageUrl: values.imageUrl,
      imageFile: values.imageFile,
    }

    if (end) {
      payload.endDate = end.toISOString()
    }

    setError(null)
    onSubmit(payload)
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="form__field">
        <label className="form__label" htmlFor="image">
          Project Image
        </label>
        {values.imageUrl && !values.imagePreview && (
          <div className="form__image-preview">
            <img
              src={values.imageUrl}
              alt="Current project"
              style={{ maxWidth: '200px', marginBottom: '1rem' }}
            />
          </div>
        )}
        {values.imagePreview && (
          <div className="form__image-preview">
            <img
              src={values.imagePreview}
              alt="New project preview"
              style={{ maxWidth: '200px', marginBottom: '1rem' }}
            />
          </div>
        )}
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          className="form__input"
          onChange={handleFileChange}
        />
        <p className="form__helper">Upload a cover image for the project.</p>
      </div>
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
        <MarkdownEditor
          id="description"
          value={values.description}
          onChange={handleDescriptionChange}
          placeholder="Summarize the problem, process, and measurable impact."
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
