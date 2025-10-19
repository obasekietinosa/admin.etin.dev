import type { ComponentPropsWithoutRef } from 'react'
import { isLikelyImageUrl } from '../utils/images'

interface CompanyIconProps extends ComponentPropsWithoutRef<'img'> {
  icon?: string | null
  name: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClassMap: Record<NonNullable<CompanyIconProps['size']>, string> = {
  sm: 'company-icon--sm',
  md: 'company-icon--md',
  lg: 'company-icon--lg',
}

const CompanyIcon = ({
  icon,
  name,
  size = 'md',
  className = '',
  ...props
}: CompanyIconProps) => {
  if (!isLikelyImageUrl(icon)) {
    return null
  }

  const sizeClass = sizeClassMap[size] ?? sizeClassMap.md
  const classes = ['company-icon', sizeClass, className].filter(Boolean).join(' ')

  return (
    <img
      src={icon.trim()}
      alt={`Logo for ${name}`}
      className={classes}
      {...props}
    />
  )
}

export default CompanyIcon
