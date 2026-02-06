import { useEffect, useMemo, useRef } from 'react'
import {
  LexicalComposer,
  type InitialConfigType,
} from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
} from '@lexical/markdown'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListItemNode, ListNode } from '@lexical/list'
import { LinkNode } from '@lexical/link'
import { CodeNode } from '@lexical/code'
import { editorTheme } from './MarkdownEditor'
import { EDITOR_TRANSFORMERS } from './markdownTransformers'
import { ImageNode } from './nodes/ImageNode'

interface MarkdownRendererProps {
  children: string
}

const MarkdownInitializer = ({ value }: { value: string }) => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    const currentMarkdown = editor
      .getEditorState()
      .read(() => $convertToMarkdownString(EDITOR_TRANSFORMERS))

    if (currentMarkdown === value) {
      return
    }

    editor.update(() => {
      $convertFromMarkdownString(value, EDITOR_TRANSFORMERS)
    })
  }, [editor, value])

  return null
}

export const MarkdownRenderer = ({ children }: MarkdownRendererProps) => {
  const initialMarkdown = useRef(children)
  const initialConfig = useMemo<InitialConfigType>(
    () => ({
      namespace: 'MarkdownRenderer',
      onError(error: Error) {
        throw error
      },
      theme: editorTheme,
      editable: false,
      editorState() {
        $convertFromMarkdownString(initialMarkdown.current, EDITOR_TRANSFORMERS)
      },
      nodes: [
        HeadingNode,
        QuoteNode,
        ListNode,
        ListItemNode,
        LinkNode,
        CodeNode,
        ImageNode,
      ],
    }),
    [],
  )

  return (
    <div className="markdown-editor markdown-renderer">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="markdown-editor__container">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="markdown-editor__content" />
            }
            placeholder={null}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <ListPlugin />
          <LinkPlugin />
          <MarkdownInitializer value={children} />
        </div>
      </LexicalComposer>
    </div>
  )
}
