import { useState } from 'react'
import { Draft } from '../hooks/useFormDrafts'

interface DraftManagerProps<T> {
  drafts: Draft<T>[]
  currentDraftId: string | null
  lastSaved: number | null
  onRestore: (draft: Draft<T>) => void
  onDelete: (draftId: string) => void
  onStartNew: () => void
  onSaveNow: () => void
}

const formatDate = (ts: number) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(ts))
}

export function DraftManager<T>({
  drafts,
  currentDraftId,
  lastSaved,
  onRestore,
  onDelete,
  onStartNew,
  onSaveNow
}: DraftManagerProps<T>) {
  const [isOpen, setIsOpen] = useState(false)

  // Use onSaveNow in a hidden way or explicit way if needed,
  // or just remove it if we rely on autosave?
  // But let's add a "Save Now" button for manual saving.

  const activeDraft = drafts.find(d => d.id === currentDraftId)

  return (
    <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3 rounded-sm border border-border bg-surface/80 px-3.5 py-2.5 text-xs">
      <div className="flex items-center gap-2 font-mono text-muted">
        <span
          className={`h-2 w-2 rounded-full ${
            lastSaved ? 'bg-patina-light' : 'bg-bronze/60'
          }`}
          aria-hidden="true"
        />
        {lastSaved ? (
          <span>Saved {formatDate(lastSaved)}</span>
        ) : (
          <span>Not saved yet</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onSaveNow}
          className="font-mono text-xs uppercase tracking-wider text-muted underline decoration-border underline-offset-4 transition hover:text-bronze-light"
          title="Force save draft"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex min-h-[34px] items-center gap-1.5 rounded-sm border border-border bg-card px-2.5 py-1 font-mono text-xs font-medium text-bronze-light transition hover:border-bronze"
        >
          <span>{activeDraft ? 'Current Draft' : 'Unsaved Draft'}</span>
          {drafts.length > 0 && <span>({drafts.length})</span>}
          <span className="text-[10px] text-bronze" aria-hidden="true">
            ▼
          </span>
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 top-full z-20 mt-1.5 max-h-80 w-full min-w-[16rem] max-w-xs overflow-y-auto rounded-sm border border-border bg-card shadow-soft-xl sm:w-80">
              <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card px-3 py-2.5">
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                  Saved Drafts
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onStartNew()
                    setIsOpen(false)
                  }}
                  className="rounded-sm border border-bronze/50 bg-bronze/15 px-2.5 py-1 font-mono text-[11px] font-medium text-bronze-light transition hover:bg-bronze/25"
                >
                  + New Draft
                </button>
              </div>

              {drafts.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted">
                  No saved drafts
                </div>
              ) : (
                <ul className="divide-y divide-border-inner">
                  {drafts.map((draft) => (
                    <li
                      key={draft.id}
                      className={`p-3 transition hover:bg-surface ${
                        draft.id === currentDraftId ? 'bg-bronze/10' : ''
                      }`}
                    >
                      <div className="mb-1.5 flex items-start justify-between gap-2">
                        <span
                          className="flex-1 truncate font-medium text-foreground"
                          title={draft.label}
                        >
                          {draft.label || 'Untitled'}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete(draft.id)
                          }}
                          className="px-1 text-xs text-coral-light transition hover:text-coral"
                          title="Delete draft"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] text-muted">
                          {formatDate(draft.timestamp)}
                        </span>
                        {draft.id !== currentDraftId && (
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                confirm(
                                  'Restore this draft? Current unsaved changes might be lost.',
                                )
                              ) {
                                onRestore(draft)
                                setIsOpen(false)
                              }
                            }}
                            className="font-mono text-xs font-medium text-bronze-light hover:underline"
                          >
                            Restore
                          </button>
                        )}
                        {draft.id === currentDraftId && (
                          <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-patina-light">
                            Active
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
