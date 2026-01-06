import {
  ChangeEvent,
  FormEvent,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { NoteInput } from '../../api/notes'
import MarkdownEditor from '../../components/MarkdownEditor'
import { useFormDrafts, Draft } from '../../hooks/useFormDrafts'
import { DraftManager } from '../../components/DraftManager'

export interface NoteFormInitialValues {
  title: string
  subtitle: string
  body: string
  publishedAt: string | null
}

interface NoteFormProps {
  initialValues?: NoteFormInitialValues
  onSubmit: (values: NoteInput) => void
  isSubmitting: boolean
  submitLabel: string
  secondaryAction?: ReactNode
}

interface NoteFormState {
  title: string
  subtitle: string
  body: string
  publishedAt: string
}

const emptyValues: NoteFormState = {
  title: '',
  subtitle: '',
  body: '',
  publishedAt: '',
}

const toDateTimeLocal = (value: string | null) => {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const iso = date.toISOString()
  return iso.slice(0, 16)
}

const NoteForm = ({
  initialValues,
  onSubmit,
  isSubmitting,
  submitLabel,
  secondaryAction,
}: NoteFormProps) => {
  const initialState = useMemo<NoteFormState>(() => {
    if (!initialValues) {
      return { ...emptyValues }
    }

    return {
      title: initialValues.title,
      subtitle: initialValues.subtitle,
      body: initialValues.body,
      publishedAt: toDateTimeLocal(initialValues.publishedAt),
    }
  }, [initialValues])

  const [values, setValues] = useState<NoteFormState>(initialState)
  const [error, setError] = useState<string | null>(null)

  // Autosave integration
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
    getLabel: (data) => data.title || 'Untitled Note',
  })

  const handleRestore = (draft: Draft<NoteFormState>) => {
    setValues(draft.data)
    restoreDraft(draft)
  }

  useEffect(() => {
    setValues(initialState)
  }, [initialState])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleBodyChange = (markdown: string) => {
    setValues((prev) => ({ ...prev, body: markdown }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!values.title.trim()) {
      setError('A title is required to save a note.')
      return
    }

    if (!values.body.trim()) {
      setError('Body content is required to save a note.')
      return
    }

    let publishedAt: string | null = null
    if (values.publishedAt) {
      const parsed = new Date(values.publishedAt)
      if (Number.isNaN(parsed.getTime())) {
        setError('Provide a valid publication date and time or leave it blank.')
        return
      }
      publishedAt = parsed.toISOString()
    }

    const payload: NoteInput = {
      title: values.title.trim(),
      subtitle: values.subtitle.trim(),
      body: values.body.trim(),
      publishedAt,
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
        onStartNew={() => {
          startNewDraft()
          // If we are "starting new draft", should we clear values?
          // If we are in "Create" mode, yes.
          // If we are in "Edit" mode, maybe not?
          // For now, let's assume "New Draft" means clear current edits
          // but keep the initial state? Or just unlink from the current draft ID.
          // Let's just unlink.
        }}
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
            placeholder="The craft of note taking"
            className="form__input"
            value={values.title}
            onChange={handleChange}
          />
          <p className="form__helper">A concise headline for the note.</p>
        </div>
        <div className="form__field">
          <label className="form__label" htmlFor="subtitle">
            Subtitle
          </label>
          <input
            id="subtitle"
            name="subtitle"
            type="text"
            placeholder="Essays on mindful writing"
            className="form__input"
            value={values.subtitle}
            onChange={handleChange}
          />
          <p className="form__helper">Optional context that appears beneath the title.</p>
        </div>
        <div className="form__field">
          <label className="form__label" htmlFor="publishedAt">
            Published at
          </label>
          <input
            id="publishedAt"
            name="publishedAt"
            type="datetime-local"
            className="form__input"
            value={values.publishedAt}
            onChange={handleChange}
          />
          <p className="form__helper">
            Leave blank while drafting. Set when the note goes live.
          </p>
        </div>
      </div>

      <div className="form__field">
        <label className="form__label" htmlFor="body">
          Body
        </label>
        <MarkdownEditor
          id="body"
          value={values.body}
          onChange={handleBodyChange}
          placeholder="Capture the full narrative of your thinking. Use Markdown shortcuts for formatting."
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

export default NoteForm
