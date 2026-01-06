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
import MarkdownEditor from '../../components/MarkdownEditor'
import { useFormDrafts, Draft } from '../../hooks/useFormDrafts'
import { DraftManager } from '../../components/DraftManager'

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

  const {
    drafts,
    currentDraftId,
    lastSaved,
    restoreDraft,
    deleteDraft,
    startNewDraft,
    saveDraft,
  } = useFormDrafts({
    data: values,
    getLabel: (data) => data.title || 'Untitled Role',
  })

  const handleRestore = (draft: Draft<RoleFormState>) => {
    setValues(draft.data)
    restoreDraft(draft)
  }

  useEffect(() => {
    setValues(initialState)
  }, [initialState])

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleDescriptionChange = (value: string) => {
    setValues((prev) => ({ ...prev, description: value }))
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
    <form className="form" onSubmit={handleSubmit} noValidate>
      <DraftManager
        drafts={drafts}
        currentDraftId={currentDraftId}
        lastSaved={lastSaved}
        onRestore={handleRestore}
        onDelete={deleteDraft}
        onStartNew={startNewDraft}
        onSaveNow={saveDraft}
      />
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
            placeholder="Senior Software Engineer"
            className="form__input"
            value={values.title}
            onChange={handleChange}
          />
          <p className="form__helper">Public job title shown on the site.</p>
        </div>
        <div className="form__field">
          <label className="form__label" htmlFor="subtitle">
            Subtitle
          </label>
          <input
            id="subtitle"
            name="subtitle"
            type="text"
            placeholder="Core platform team"
            className="form__input"
            value={values.subtitle}
            onChange={handleChange}
          />
          <p className="form__helper">Optional context such as team or location.</p>
        </div>
      </div>

      <div className="form__grid">
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
          <p className="form__helper">Leave blank if the role is ongoing.</p>
        </div>
      </div>

      <div className="form__field">
        <label className="form__label" htmlFor="companyId">
          Company
        </label>
        <select
          id="companyId"
          name="companyId"
          required
          className="form__input"
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

      <div className="form__field">
        <label className="form__label" htmlFor="description">
          Description
        </label>
        <MarkdownEditor
          id="description"
          value={values.description}
          onChange={handleDescriptionChange}
          placeholder="Summarize responsibilities using Markdown."
        />
      </div>

      <div className="form__field">
        <label className="form__label" htmlFor="skills">
          Skills
        </label>
        <textarea
          id="skills"
          name="skills"
          rows={4}
          required
          placeholder="Type each skill on a new line"
          className="form__textarea"
          value={values.skills}
          onChange={handleChange}
        />
        <p className="form__helper">
          Provide at least one skill. Use separate lines or commas for multiple skills.
        </p>
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

export default RoleForm
