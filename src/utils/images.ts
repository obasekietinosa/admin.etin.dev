export const isLikelyImageUrl = (value?: string | null): value is string => {
  if (!value) {
    return false
  }

  const trimmed = value.trim()

  if (trimmed.length === 0) {
    return false
  }

  return (
    /^https?:\/\//i.test(trimmed) ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  )
}
