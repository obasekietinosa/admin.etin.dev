import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  TextFormatType,
} from 'lexical'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
} from 'lucide-react'
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingTagType,
} from '@lexical/rich-text'
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list'
import { $setBlocksType } from '@lexical/selection'
import { TOGGLE_LINK_COMMAND } from '@lexical/link'
import { uploadAsset } from '../api/assets'
import { $createImageNode } from './nodes/ImageNode'

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [isCode, setIsCode] = useState(false)

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))
      setIsStrikethrough(selection.hasFormat('strikethrough'))
      setIsCode(selection.hasFormat('code'))
    }
  }, [])

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar()
      })
    })
  }, [editor, updateToolbar])

  const formatText = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format)
  }

  const formatHeading = (headingSize: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize))
      }
    })
  }

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode())
      }
    })
  }

  const insertLink = () => {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://')
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const asset = await uploadAsset({ file })
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          const imageNode = $createImageNode({
            src: asset.url,
            altText: file.name,
          })
          selection.insertNodes([imageNode])
        }
      })
    } catch (e) {
      console.error(e)
      // TODO: Handle error nicely
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const ToolbarButton = ({
    onClick,
    isActive,
    children,
    title,
  }: {
    onClick: () => void
    isActive?: boolean
    children: React.ReactNode
    title: string
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-1.5 rounded transition-colors ${
        isActive
          ? 'bg-blue-600/80 text-white'
          : 'text-slate-400 hover:bg-white/10 hover:text-slate-200'
      }`}
      title={title}
    >
      {children}
    </button>
  )

  const Divider = () => <div className="w-px h-5 bg-white/10 mx-1" />

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-white/10 bg-slate-900/50 p-2 mb-2 rounded-t-2xl">
      <ToolbarButton
        onClick={() => formatText('bold')}
        isActive={isBold}
        title="Bold (Ctrl+B)"
      >
        <Bold size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => formatText('italic')}
        isActive={isItalic}
        title="Italic (Ctrl+I)"
      >
        <Italic size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => formatText('underline')}
        isActive={isUnderline}
        title="Underline (Ctrl+U)"
      >
        <Underline size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => formatText('strikethrough')}
        isActive={isStrikethrough}
        title="Strikethrough"
      >
        <Strikethrough size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => formatText('code')}
        isActive={isCode}
        title="Inline Code"
      >
        <Code size={16} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        onClick={() => formatHeading('h1')}
        title="Heading 1"
      >
        <Heading1 size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => formatHeading('h2')}
        title="Heading 2"
      >
        <Heading2 size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => formatHeading('h3')}
        title="Heading 3"
      >
        <Heading3 size={16} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
        title="Bullet List"
      >
        <List size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
        title="Numbered List"
      >
        <ListOrdered size={16} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        onClick={formatQuote}
        title="Quote"
      >
        <Quote size={16} />
      </ToolbarButton>

      <ToolbarButton
          onClick={insertLink}
          title="Insert Link"
      >
          <LinkIcon size={16} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => fileInputRef.current?.click()}
        title="Insert Image"
      >
        <ImageIcon size={16} />
      </ToolbarButton>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        style={{ display: 'none' }}
        accept="image/*"
      />
    </div>
  )
}

export default ToolbarPlugin
