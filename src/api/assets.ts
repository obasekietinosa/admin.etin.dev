import { apiRequest } from './client'

export interface AssetInput {
  file: File
  altText?: string
}

interface AssetResponse {
  asset: {
    url: string
  }
}

export const uploadAsset = async ({ file, altText }: AssetInput) => {
  const formData = new FormData()
  formData.append('file', file)

  if (altText && altText.trim().length > 0) {
    formData.append('altText', altText.trim())
  }

  const response = await apiRequest<AssetResponse>('/assets', {
    method: 'POST',
    body: formData,
  })

  return response.asset
}

