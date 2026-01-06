import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from 'react'
import type { CompanyInput } from '../../api/companies'
import MarkdownEditor from '../../components/MarkdownEditor'
import { useFormDrafts, Draft } from '../../hooks/useFormDrafts'
import { DraftManager } from '../../components/DraftManager'

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
    getLabel: (data) => data.name || 'Untitled Company',
  })

  const handleRestore = (draft: Draft<CompanyFormValues>) => {
    setValues(draft.data)
    restoreDraft(draft)
  }

  useEffect(() => {
    if (initialValues) {
      setValues(initialValues)
    }
  }, [initialValues])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleDescriptionChange = (value: string) => {
    setValues((prev) => ({ ...prev, description: value }))
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
          <label className="form__label" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Acme Inc."
            className="form__input"
            value={values.name}
            onChange={handleChange}
          />
          <p className="form__helper">Public display name for the company.</p>
        </div>
        <div className="form__field">
          <label className="form__label" htmlFor="icon">
            Icon
          </label>
          <input
            id="icon"
            name="icon"
            type="text"
            placeholder="🚀"
            className="form__input"
            value={values.icon}
            onChange={handleChange}
          />
          <p className="form__helper">Emoji or short label used alongside the company name.</p>
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
          placeholder="What does this company do?"
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

export default CompanyForm
