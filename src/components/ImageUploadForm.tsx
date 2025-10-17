import { FormEvent, useId, useState } from 'react'

type ImageUploadFormValues = {
  file: File
  altText?: string
}

interface ImageUploadFormProps {
  label: string
  helperText?: string
  submitLabel?: string
  accept?: string
  isSubmitting: boolean
  onSubmit: (values: ImageUploadFormValues) => void
  errorMessage?: string | null
}

const ImageUploadForm = ({
  label,
  helperText,
  submitLabel = 'Upload image',
  accept = 'image/*',
  isSubmitting,
  onSubmit,
  errorMessage,
}: ImageUploadFormProps) => {
  const inputId = useId()
  const altId = useId()
  const [file, setFile] = useState<File | null>(null)
  const [altText, setAltText] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!file) {
      setLocalError('Select an image file to upload.')
      return
    }

    setLocalError(null)
    const cleanedAltText = altText.trim()
    onSubmit({
      file,
      altText: cleanedAltText.length > 0 ? cleanedAltText : undefined,
    })
  }

  return (
    <form className="stack" onSubmit={handleSubmit} noValidate>
      <div className="form__field">
        <label className="form__label" htmlFor={inputId}>
          {label}
        </label>
        <input
          id={inputId}
          name="image"
          type="file"
          accept={accept}
          className="form__input"
          onChange={(event) => {
            const selectedFile = event.target.files?.[0] ?? null
            setFile(selectedFile)
            setLocalError(null)
          }}
          disabled={isSubmitting}
        />
        {helperText && <p className="form__helper">{helperText}</p>}
      </div>

      <div className="form__field">
        <label className="form__label" htmlFor={altId}>
          Alternative text
        </label>
        <input
          id={altId}
          name="altText"
          type="text"
          className="form__input"
          placeholder="Describe the image for accessibility"
          value={altText}
          onChange={(event) => setAltText(event.target.value)}
          disabled={isSubmitting}
        />
        <p className="form__helper">Optional but recommended.</p>
      </div>

      {(localError || errorMessage) && (
        <div className="alert alert--error" role="alert">
          <p>{localError ?? errorMessage}</p>
        </div>
      )}

      <div className="form__actions">
        <button
          type="submit"
          className="button button--secondary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Uploading…' : submitLabel}
        </button>
      </div>
    </form>
  )
}

export default ImageUploadForm
