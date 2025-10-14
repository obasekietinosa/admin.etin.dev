import { ChangeEvent, FormEvent, ReactNode, useEffect, useMemo, useState } from 'react'
import type { TagInput } from '../../api/tags'

export interface TagFormInitialValues {
  name: string
  slug: string
  icon: string
  theme: string
}

interface TagFormProps {
  initialValues?: TagFormInitialValues
  onSubmit: (values: TagInput) => void
  isSubmitting: boolean
  submitLabel: string
  secondaryAction?: ReactNode
}

type TagFormState = TagFormInitialValues

const emptyValues: TagFormState = {
  name: '',
  slug: '',
  icon: '',
  theme: '',
}

const TagForm = ({
  initialValues,
  onSubmit,
  isSubmitting,
  submitLabel,
  secondaryAction,
}: TagFormProps) => {
  const initialState = useMemo<TagFormState>(() => {
    if (!initialValues) {
      return { ...emptyValues }
    }

    return {
      name: initialValues.name,
      slug: initialValues.slug,
      icon: initialValues.icon,
      theme: initialValues.theme,
    }
  }, [initialValues])

  const [values, setValues] = useState<TagFormState>(initialState)
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedName = values.name.trim()
    if (!trimmedName) {
      setError('Name is required to save a tag.')
      return
    }

    const trimmedSlug = values.slug.trim()
    if (!trimmedSlug) {
      setError('Slug is required to save a tag.')
      return
    }

    const trimmedIcon = values.icon.trim()
    const trimmedTheme = values.theme.trim()

    const payload: TagInput = {
      name: trimmedName,
      slug: trimmedSlug,
      icon: trimmedIcon ? trimmedIcon : null,
      theme: trimmedTheme ? trimmedTheme : null,
    }

    setError(null)
    onSubmit(payload)
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
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
            placeholder="Design systems"
            className="form__input"
            value={values.name}
            onChange={handleChange}
          />
          <p className="form__helper">Human readable label displayed on etin.dev.</p>
        </div>
        <div className="form__field">
          <label className="form__label" htmlFor="slug">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            placeholder="design-systems"
            className="form__input"
            value={values.slug}
            onChange={handleChange}
          />
          <p className="form__helper">URL-friendly identifier used for linking and grouping.</p>
        </div>
      </div>

      <div className="form__grid">
        <div className="form__field">
          <label className="form__label" htmlFor="icon">
            Icon
          </label>
          <input
            id="icon"
            name="icon"
            type="text"
            placeholder="✨"
            className="form__input"
            value={values.icon}
            onChange={handleChange}
          />
          <p className="form__helper">Optional emoji or short label to pair with the tag.</p>
        </div>
        <div className="form__field">
          <label className="form__label" htmlFor="theme">
            Theme
          </label>
          <input
            id="theme"
            name="theme"
            type="text"
            placeholder="gradient-blue"
            className="form__input"
            value={values.theme}
            onChange={handleChange}
          />
          <p className="form__helper">Optional theme token powering UI accents.</p>
        </div>
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

export default TagForm
