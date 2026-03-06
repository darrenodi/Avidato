'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Code from '@tiptap/extension-code'
import Placeholder from '@tiptap/extension-placeholder'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { useState, useCallback } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const lowlight = createLowlight(common)

// Toolbar icon components
const BoldIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
const ItalicIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
const UnderlineIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
const StrikeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H8"/><line x1="4" y1="12" x2="20" y2="12"/></svg>
const CodeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
const AlignLeftIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
const AlignCenterIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
const AlignRightIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>
const BulletListIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor"/><circle cx="4" cy="12" r="1.5" fill="currentColor"/><circle cx="4" cy="18" r="1.5" fill="currentColor"/></svg>
const OrderedListIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="10" y1="6" x2="20" y2="6"/><line x1="10" y1="12" x2="20" y2="12"/><line x1="10" y1="18" x2="20" y2="18"/><text x="2" y="8" fontSize="8" fill="currentColor" stroke="none" fontWeight="bold">1</text><text x="2" y="14" fontSize="8" fill="currentColor" stroke="none" fontWeight="bold">2</text><text x="2" y="20" fontSize="8" fill="currentColor" stroke="none" fontWeight="bold">3</text></svg>
const QuoteIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>
const LinkIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
const ImageIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
const UndoIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
const RedoIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
const HorizontalRuleIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"/></svg>

function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  title,
  children,
}: {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        isActive
          ? 'bg-brand-primary text-white'
          : disabled
          ? 'text-gray-300 cursor-not-allowed'
          : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
      }`}
    >
      {children}
    </button>
  )
}

function ToolbarDivider() {
  return <div className="w-px h-5 bg-gray-300 mx-0.5" />
}

export default function RichTextEditor({ value, onChange, placeholder = 'Start writing...' }: RichTextEditorProps) {
  const [view, setView] = useState<'visual' | 'code'>('visual')
  const [codeValue, setCodeValue] = useState(value)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Underline,
      Code,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Image.configure({
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
      setCodeValue(html)
    },
    immediatelyRender: false,
  })

  const toggleView = useCallback((newView: 'visual' | 'code') => {
    if (newView === 'code') {
      setCodeValue(editor?.getHTML() || value)
    } else {
      if (editor) {
        editor.commands.setContent(codeValue)
      }
    }
    setView(newView)
  }, [editor, value, codeValue])

  const handleCodeChange = useCallback((html: string) => {
    setCodeValue(html)
    onChange(html)
    if (editor) {
      editor.commands.setContent(html)
    }
  }, [editor, onChange])

  const addImage = useCallback(() => {
    const url = prompt('Enter image URL:')
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const addLink = useCallback(() => {
    if (editor?.isActive('link')) {
      editor.chain().focus().unsetLink().run()
      return
    }
    const url = prompt('Enter URL:')
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run()
    }
  }, [editor])

  if (!editor && view === 'visual') {
    return (
      <div className="border border-gray-200 rounded-xl bg-white animate-pulse">
        <div className="h-10 bg-gray-50 rounded-t-xl border-b border-gray-200" />
        <div className="h-96 p-6" />
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Compact single-row toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200 flex-wrap">
        {/* Block type selector */}
        <select
          value={
            editor?.isActive('heading', { level: 1 }) ? 'h1' :
            editor?.isActive('heading', { level: 2 }) ? 'h2' :
            editor?.isActive('heading', { level: 3 }) ? 'h3' :
            editor?.isActive('heading', { level: 4 }) ? 'h4' :
            'p'
          }
          onChange={(e) => {
            const val = e.target.value
            if (val === 'p') {
              editor?.chain().focus().setParagraph().run()
            } else {
              const level = parseInt(val[1]) as 1 | 2 | 3 | 4
              editor?.chain().focus().toggleHeading({ level }).run()
            }
          }}
          className="h-7 pl-2 pr-6 border border-gray-300 rounded text-xs font-medium bg-white hover:bg-gray-50 cursor-pointer focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
        </select>

        <ToolbarDivider />

        {/* Inline formatting */}
        <ToolbarButton onClick={() => editor?.chain().focus().toggleBold().run()} isActive={editor?.isActive('bold')} title="Bold (Ctrl+B)">
          <BoldIcon />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor?.chain().focus().toggleItalic().run()} isActive={editor?.isActive('italic')} title="Italic (Ctrl+I)">
          <ItalicIcon />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor?.chain().focus().toggleUnderline().run()} isActive={editor?.isActive('underline')} title="Underline (Ctrl+U)">
          <UnderlineIcon />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor?.chain().focus().toggleStrike().run()} isActive={editor?.isActive('strike')} title="Strikethrough">
          <StrikeIcon />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor?.chain().focus().toggleCode().run()} isActive={editor?.isActive('code')} title="Inline Code">
          <CodeIcon />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Alignment */}
        <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign('left').run()} isActive={editor?.isActive({ textAlign: 'left' })} title="Align Left">
          <AlignLeftIcon />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign('center').run()} isActive={editor?.isActive({ textAlign: 'center' })} title="Align Center">
          <AlignCenterIcon />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign('right').run()} isActive={editor?.isActive({ textAlign: 'right' })} title="Align Right">
          <AlignRightIcon />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Lists & blocks */}
        <ToolbarButton onClick={() => editor?.chain().focus().toggleBulletList().run()} isActive={editor?.isActive('bulletList')} title="Bullet List">
          <BulletListIcon />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor?.chain().focus().toggleOrderedList().run()} isActive={editor?.isActive('orderedList')} title="Numbered List">
          <OrderedListIcon />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor?.chain().focus().toggleBlockquote().run()} isActive={editor?.isActive('blockquote')} title="Blockquote">
          <QuoteIcon />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor?.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
          <HorizontalRuleIcon />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Insert */}
        <ToolbarButton onClick={addLink} isActive={editor?.isActive('link')} title="Insert Link">
          <LinkIcon />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} title="Insert Image">
          <ImageIcon />
        </ToolbarButton>

        {/* Right side: undo/redo + code toggle */}
        <div className="ml-auto flex items-center gap-0.5">
          <ToolbarButton onClick={() => editor?.chain().focus().undo().run()} disabled={!editor?.can().undo()} title="Undo">
            <UndoIcon />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor?.chain().focus().redo().run()} disabled={!editor?.can().redo()} title="Redo">
            <RedoIcon />
          </ToolbarButton>
          <ToolbarDivider />
          <button
            type="button"
            onClick={() => toggleView(view === 'visual' ? 'code' : 'visual')}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              view === 'code'
                ? 'bg-gray-800 text-white'
                : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
            }`}
            title="Toggle HTML view"
          >
            {'</>'}
          </button>
        </div>
      </div>

      {/* Editor area */}
      {view === 'visual' ? (
        <div className="bg-white">
          <style>{`
            .tiptap {
              outline: none;
              min-height: 400px;
              padding: 1.5rem;
              word-wrap: break-word;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            .tiptap.is-editor-empty:first-child::before {
              content: attr(data-placeholder);
              float: left;
              color: #9ca3af;
              pointer-events: none;
              height: 0;
            }
            .tiptap > *:first-child { margin-top: 0; }
            .tiptap > *:last-child { margin-bottom: 0; }
            .tiptap p {
              line-height: 1.75;
              margin: 0.75em 0;
              font-size: 1rem;
              color: #1f2937;
            }
            .tiptap p:first-child { margin-top: 0; }
            .tiptap h1 {
              font-size: 2rem;
              font-weight: 800;
              line-height: 1.2;
              margin: 1.5rem 0 0.75rem;
              color: #111827;
            }
            .tiptap h2 {
              font-size: 1.5rem;
              font-weight: 700;
              line-height: 1.3;
              margin: 1.25rem 0 0.5rem;
              color: #1f2937;
            }
            .tiptap h3 {
              font-size: 1.25rem;
              font-weight: 600;
              line-height: 1.4;
              margin: 1rem 0 0.5rem;
              color: #374151;
            }
            .tiptap h4 {
              font-size: 1.1rem;
              font-weight: 600;
              margin: 0.75rem 0 0.5rem;
              color: #4b5563;
            }
            .tiptap strong { font-weight: 700; }
            .tiptap em { font-style: italic; }
            .tiptap u { text-decoration: underline; text-underline-offset: 3px; }
            .tiptap s { text-decoration: line-through; }
            .tiptap code {
              background: #f3f4f6;
              padding: 0.15rem 0.35rem;
              border-radius: 4px;
              font-family: 'SF Mono', 'Fira Code', monospace;
              font-size: 0.875em;
              color: #e11d48;
            }
            .tiptap pre {
              background: #1e293b;
              color: #e2e8f0;
              padding: 1rem 1.25rem;
              border-radius: 8px;
              overflow-x: auto;
              margin: 1rem 0;
              font-size: 0.875rem;
              line-height: 1.6;
            }
            .tiptap pre code {
              background: transparent;
              padding: 0;
              color: inherit;
              font-size: inherit;
            }
            .tiptap a {
              color: #3d74b5;
              text-decoration: underline;
              text-underline-offset: 2px;
              cursor: pointer;
            }
            .tiptap a:hover { color: #2d5a8e; }
            .tiptap ul {
              list-style: disc;
              padding-left: 1.5rem;
              margin: 0.75em 0;
            }
            .tiptap ol {
              list-style: decimal;
              padding-left: 1.5rem;
              margin: 0.75em 0;
            }
            .tiptap li {
              margin: 0.25em 0;
              line-height: 1.75;
            }
            .tiptap li p { margin: 0; }
            .tiptap blockquote {
              border-left: 3px solid #3d74b5;
              padding-left: 1rem;
              margin: 1rem 0;
              color: #4b5563;
              font-style: italic;
            }
            .tiptap img {
              max-width: 100%;
              border-radius: 8px;
              margin: 1rem 0;
            }
            .tiptap hr {
              border: none;
              border-top: 2px solid #e5e7eb;
              margin: 1.5rem 0;
            }
          `}</style>
          <EditorContent editor={editor} />
        </div>
      ) : (
        <div className="bg-gray-900 p-4">
          <textarea
            value={codeValue}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="w-full min-h-[400px] p-4 bg-gray-950 text-green-400 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-1 focus:ring-green-500 border border-gray-700"
            placeholder="Edit HTML directly..."
            spellCheck={false}
          />
        </div>
      )}
    </div>
  )
}
