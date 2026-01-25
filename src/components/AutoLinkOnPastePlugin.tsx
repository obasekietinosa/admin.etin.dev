import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { TOGGLE_LINK_COMMAND } from '@lexical/link'
import {
  COMMAND_PRIORITY_LOW,
  PASTE_COMMAND,
  $getSelection,
  $isRangeSelection,
} from 'lexical'
import { useEffect } from 'react'

const URL_REGEX = /^((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/

const AutoLinkOnPastePlugin = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
      PASTE_COMMAND,
      (event: ClipboardEvent) => {
        const selection = $getSelection()
        if (!$isRangeSelection(selection) || selection.isCollapsed()) {
          return false
        }

        const clipboardData = event.clipboardData
        if (!clipboardData) {
          return false
        }

        const textContent = clipboardData.getData('text/plain')
        if (!textContent || !URL_REGEX.test(textContent.trim())) {
          return false
        }

        // If the selection is not collapsed and the pasted content is a URL,
        // turn the selection into a link.
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, textContent.trim())
        event.preventDefault()
        return true
      },
      COMMAND_PRIORITY_LOW,
    )
  }, [editor])

  return null
}

export default AutoLinkOnPastePlugin
