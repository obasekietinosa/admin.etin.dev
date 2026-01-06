import { useState, useEffect, useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export interface Draft<T> {
  id: string
  timestamp: number
  label: string
  data: T
}

interface UseFormDraftsOptions<T> {
  key?: string // Optional: if not provided, uses current path
  data: T
  getLabel: (data: T) => string
}

interface UseFormDraftsResult<T> {
  drafts: Draft<T>[]
  saveDraft: () => void
  restoreDraft: (draft: Draft<T>) => void
  deleteDraft: (draftId: string) => void
  lastSaved: number | null
  startNewDraft: () => void
  currentDraftId: string | null
}

const STORAGE_KEY_PREFIX = 'draft_v1_'

// Helper to generate UUID
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Deep comparison helper (simple)
const isDeepEqual = (a: any, b: any) => {
  return JSON.stringify(a) === JSON.stringify(b)
}

export function useFormDrafts<T>({
  key,
  data,
  getLabel,
}: UseFormDraftsOptions<T>): UseFormDraftsResult<T> {
  const location = useLocation()
  const storageKey = `${STORAGE_KEY_PREFIX}${key || location.pathname}`

  const [drafts, setDrafts] = useState<Draft<T>[]>([])
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<number | null>(null)

  // To avoid saving immediately on mount, and to track changes
  const initialDataRef = useRef<T | null>(null)
  const dataRef = useRef(data)
  dataRef.current = data

  // Initialize initialData on first render
  if (initialDataRef.current === null) {
    initialDataRef.current = JSON.parse(JSON.stringify(data)) // clone
  }

  // Load drafts on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, Draft<T>>
        const draftList = Object.values(parsed).sort((a, b) => b.timestamp - a.timestamp)
        setDrafts(draftList)
      }
    } catch (e) {
      console.error('Failed to load drafts', e)
    }
  }, [storageKey])

  // Save to local storage helper
  const saveToStorage = useCallback((newDrafts: Record<string, Draft<T>>) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newDrafts))
      setDrafts(Object.values(newDrafts).sort((a, b) => b.timestamp - a.timestamp))
    } catch (e) {
      console.error('Failed to save drafts', e)
    }
  }, [storageKey])

  const saveDraft = useCallback(() => {
    const currentData = dataRef.current
    const label = getLabel(currentData)
    const timestamp = Date.now()

    // Check if data is different from initialData if we don't have a current draft ID yet?
    // Actually, if we are editing an existing draft, we save.
    // If we have no draft ID, we only create one if data != initialData.

    // However, initialDataRef is set on mount.
    // If we start a new draft, we should probably reset initialDataRef?
    // But startNewDraft just clears ID.

    // Let's assume: if !currentDraftId and data == initialDataRef.current, don't save.

    if (!currentDraftId && isDeepEqual(currentData, initialDataRef.current)) {
      return
    }

    let draftId = currentDraftId
    if (!draftId) {
      draftId = generateId()
      setCurrentDraftId(draftId)
    }

    const draft: Draft<T> = {
      id: draftId,
      timestamp,
      label: label || 'Untitled',
      data: currentData,
    }

    try {
      const stored = localStorage.getItem(storageKey)
      const existingDrafts: Record<string, Draft<T>> = stored ? JSON.parse(stored) : {}

      existingDrafts[draftId] = draft
      saveToStorage(existingDrafts)
      setLastSaved(timestamp)
    } catch (e) {
      console.error('Failed to save draft', e)
    }
  }, [currentDraftId, getLabel, saveToStorage, storageKey])

  const restoreDraft = useCallback((draft: Draft<T>) => {
    setCurrentDraftId(draft.id)
    // When we restore, we should probably update initialDataRef to be this draft's data?
    // So that we don't immediately save again if no changes?
    // Or just let it save (update timestamp).
    // Updating timestamp is fine.
  }, [])

  const deleteDraft = useCallback((draftId: string) => {
    try {
      const stored = localStorage.getItem(storageKey)
      const existingDrafts: Record<string, Draft<T>> = stored ? JSON.parse(stored) : {}

      if (existingDrafts[draftId]) {
        delete existingDrafts[draftId]
        saveToStorage(existingDrafts)

        if (currentDraftId === draftId) {
          setCurrentDraftId(null)
          setLastSaved(null)
          // Also reset initial data so we don't immediately create a new one?
          initialDataRef.current = JSON.parse(JSON.stringify(dataRef.current))
        }
      }
    } catch (e) {
      console.error('Failed to delete draft', e)
    }
  }, [currentDraftId, saveToStorage, storageKey])

  const startNewDraft = useCallback(() => {
    setCurrentDraftId(null)
    setLastSaved(null)
    // Reset initial data ref to current data so we don't save unless user types MORE.
    initialDataRef.current = JSON.parse(JSON.stringify(dataRef.current))
  }, [])

  // Autosave effect
  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraft()
    }, 2000) // 2 seconds debounce

    return () => clearTimeout(timer)
  }, [data, saveDraft])

  return {
    drafts,
    saveDraft,
    restoreDraft,
    deleteDraft,
    lastSaved,
    startNewDraft,
    currentDraftId
  }
}
