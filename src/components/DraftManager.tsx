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
    <div className="flex items-center gap-4 text-sm mb-4 p-2 bg-gray-50 rounded border border-gray-200">
      <div className="flex-1">
        {lastSaved ? (
          <span className="text-gray-600">Saved {formatDate(lastSaved)}</span>
        ) : (
          <span className="text-gray-400">Not saved yet</span>
        )}
      </div>

      <div className="relative flex items-center gap-2">
        <button
           type="button"
           onClick={onSaveNow}
           className="text-xs text-gray-500 hover:text-gray-700 underline"
           title="Force save draft"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          {activeDraft ? 'Current Draft' : 'Unsaved Draft'}
          {drafts.length > 0 && ` (${drafts.length})`}
          <span className="text-xs">▼</span>
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 top-full mt-1 w-72 bg-white border border-gray-200 shadow-lg rounded-md z-20 max-h-96 overflow-y-auto">
              <div className="p-2 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
                <span className="font-semibold text-gray-700">Drafts</span>
                <button
                  type="button"
                  onClick={() => {
                    onStartNew()
                    setIsOpen(false)
                  }}
                  className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100"
                >
                  + New Draft
                </button>
              </div>

              {drafts.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No saved drafts</div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {drafts.map((draft) => (
                    <li key={draft.id} className={`p-2 hover:bg-gray-50 ${draft.id === currentDraftId ? 'bg-blue-50' : ''}`}>
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-gray-800 truncate flex-1 mr-2" title={draft.label}>
                          {draft.label || 'Untitled'}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete(draft.id)
                          }}
                          className="text-red-500 hover:text-red-700 text-xs"
                          title="Delete draft"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{formatDate(draft.timestamp)}</span>
                        {draft.id !== currentDraftId && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('Restore this draft? Current unsaved changes might be lost.')) {
                                onRestore(draft)
                                setIsOpen(false)
                              }
                            }}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Restore
                          </button>
                        )}
                        {draft.id === currentDraftId && (
                           <span className="text-xs text-blue-600 font-medium">Active</span>
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
