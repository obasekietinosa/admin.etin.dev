import { useCallback, useEffect, useMemo, useRef } from 'react'
import {
  LexicalComposer,
  type InitialConfigType,
} from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { TRANSFORMERS } from '@lexical/markdown'
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
} from '@lexical/markdown'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import type { EditorState } from 'lexical'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListItemNode, ListNode } from '@lexical/list'
import { LinkNode } from '@lexical/link'
import { CodeNode } from '@lexical/code'
import ToolbarPlugin from './ToolbarPlugin'

interface MarkdownEditorProps {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const editorTheme = {
  paragraph: 'markdown-editor__paragraph',
  heading: {
    h1: 'markdown-editor__heading markdown-editor__heading--h1',
    h2: 'markdown-editor__heading markdown-editor__heading--h2',
    h3: 'markdown-editor__heading markdown-editor__heading--h3',
    h4: 'markdown-editor__heading markdown-editor__heading--h4',
    h5: 'markdown-editor__heading markdown-editor__heading--h5',
    h6: 'markdown-editor__heading markdown-editor__heading--h6',
  },
  list: {
    nested: {
      listitem: 'markdown-editor__list-item--nested',
    },
    ol: 'markdown-editor__list markdown-editor__list--ol',
    ul: 'markdown-editor__list markdown-editor__list--ul',
    listitem: 'markdown-editor__list-item',
  },
  link: 'markdown-editor__link',
  quote: 'markdown-editor__quote',
  text: {
    bold: 'markdown-editor__text--bold',
    italic: 'markdown-editor__text--italic',
    underline: 'markdown-editor__text--underline',
    strikethrough: 'markdown-editor__text--strikethrough',
    code: 'markdown-editor__text--code',
  },
  code: 'markdown-editor__code',
  codeHighlight: {
    keyword: 'markdown-editor__token markdown-editor__token--keyword',
    string: 'markdown-editor__token markdown-editor__token--string',
    comment: 'markdown-editor__token markdown-editor__token--comment',
    function: 'markdown-editor__token markdown-editor__token--function',
    punctuation: 'markdown-editor__token markdown-editor__token--punctuation',
  },
}

const MarkdownInitializer = ({ value }: { value: string }) => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    const currentMarkdown = editor
      .getEditorState()
      .read(() => $convertToMarkdownString(TRANSFORMERS))

    if (currentMarkdown === value) {
      return
    }

    editor.update(() => {
      $convertFromMarkdownString(value, TRANSFORMERS)
    })
  }, [editor, value])

  return null
}

const MarkdownEditor = ({ id, value, onChange, placeholder }: MarkdownEditorProps) => {
  const initialMarkdown = useRef(value)
  const initialConfig = useMemo<InitialConfigType>(
    () => ({
      namespace: 'NoteMarkdownEditor',
      onError(error: Error) {
        throw error
      },
      theme: editorTheme,
      editorState() {
        $convertFromMarkdownString(initialMarkdown.current, TRANSFORMERS)
      },
      nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, CodeNode],
    }),
    [],
  )

  const handleChange = useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        const markdown = $convertToMarkdownString(TRANSFORMERS)
        onChange(markdown)
      })
    },
    [onChange],
  )

  return (
    <div className="markdown-editor">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="markdown-editor__container">
          <ToolbarPlugin />
          <RichTextPlugin
            contentEditable={
              <ContentEditable id={id} className="markdown-editor__content" />
            }
            placeholder={<div className="markdown-editor__placeholder">{placeholder}</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoFocusPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <OnChangePlugin onChange={handleChange} />
          <MarkdownInitializer value={value} />
        </div>
      </LexicalComposer>
    </div>
  )
}

export default MarkdownEditor
