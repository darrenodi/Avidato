'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Code from '@tiptap/extension-code'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { useState } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

const lowlight = createLowlight(common)

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [view, setView] = useState<'visual' | 'code'>('visual')
  const [codeValue, setCodeValue] = useState(value)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Underline,
      Code,
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

  const toggleView = (newView: 'visual' | 'code') => {
    if (newView === 'code') {
      setCodeValue(editor?.getHTML() || value)
    } else {
      if (editor) {
        editor.commands.setContent(codeValue)
      }
    }
    setView(newView)
  }

  const handleCodeChange = (html: string) => {
    setCodeValue(html)
    onChange(html)
    if (editor) {
      editor.commands.setContent(html)
    }
  }

  if (!editor && view === 'visual') {
    return null
  }

  const addImage = () => {
    const url = prompt('Enter image URL:')
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run()
    }
  }

  const addLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run()
    }
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* View Tabs */}
      <div className="flex border-b border-gray-300 bg-gray-50">
        <button
          onClick={() => toggleView('visual')}
          className={`flex-1 py-2 px-4 font-medium transition ${
            view === 'visual'
              ? 'bg-white text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Visual Editor
        </button>
        <button
          onClick={() => toggleView('code')}
          className={`flex-1 py-2 px-4 font-medium transition ${
            view === 'code'
              ? 'bg-white text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          HTML Code
        </button>
      </div>

      {view === 'visual' ? (
        <>
          {/* Instructions */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 px-4 py-3 text-sm text-blue-900">
            <strong>✍️ Free Text Editor:</strong> Type any content freely. Then select text with your mouse to apply styles using the toolbar below.
          </div>

          {/* Toolbar - Multi-row for better organization */}
          <div className="bg-gray-100 border-b border-gray-300 p-3">
            {/* Row 1: Text Styles */}
            <div className="flex flex-wrap gap-2 mb-2">
              <label className="text-xs font-semibold text-gray-600 flex items-center mr-2">Style:</label>
              <select
                onChange={(e) => {
                  if (e.target.value === 'p') {
                    editor?.chain().focus().setParagraph().run()
                  } else if (e.target.value.startsWith('h')) {
                    const level = parseInt(e.target.value[1]) as 1 | 2 | 3 | 4 | 5 | 6
                    editor?.chain().focus().toggleHeading({ level }).run()
                  }
                  e.target.value = ''
                }}
                className="px-3 py-2 border border-gray-300 rounded bg-white text-sm font-medium hover:bg-gray-50 cursor-pointer focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Normal text</option>
                <option value="h1">Heading 1 (H1)</option>
                <option value="h2">Heading 2 (H2)</option>
                <option value="h3">Heading 3 (H3)</option>
                <option value="h4">Heading 4 (H4)</option>
                <option value="h5">Heading 5 (H5)</option>
                <option value="h6">Heading 6 (H6)</option>
              </select>
            </div>

            {/* Row 2: Text Formatting */}
            <div className="flex flex-wrap gap-1 mb-2">
              <label className="text-xs font-semibold text-gray-600 flex items-center mr-2">Format:</label>
              <button
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`px-3 py-2 rounded font-bold transition ${
                  editor?.isActive('bold')
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
                title="Bold (Ctrl+B)"
              >
                B
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={`px-3 py-2 rounded italic transition ${
                  editor?.isActive('italic')
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
                title="Italic (Ctrl+I)"
              >
                I
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                className={`px-3 py-2 rounded underline transition ${
                  editor?.isActive('underline')
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
                title="Underline (Ctrl+U)"
              >
                U
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                className={`px-3 py-2 rounded transition ${
                  editor?.isActive('strike')
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
                title="Strikethrough"
              >
                <s>S</s>
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleCode().run()}
                className={`px-3 py-2 rounded font-mono transition ${
                  editor?.isActive('code')
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
                title="Inline Code"
              >
                &lt;/&gt;
              </button>
            </div>

            {/* Row 3: Alignment */}
            <div className="flex flex-wrap gap-1 mb-2">
              <label className="text-xs font-semibold text-gray-600 flex items-center mr-2">Align:</label>
              <button
                onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                className={`px-3 py-2 rounded transition ${
                  editor?.isActive({ textAlign: 'left' })
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
                title="Align Left"
              >
                ⬅️
              </button>
              <button
                onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                className={`px-3 py-2 rounded transition ${
                  editor?.isActive({ textAlign: 'center' })
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
                title="Center"
              >
                ⬇️
              </button>
              <button
                onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                className={`px-3 py-2 rounded transition ${
                  editor?.isActive({ textAlign: 'right' })
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
                title="Align Right"
              >
                ➡️
              </button>
              <button
                onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
                className={`px-3 py-2 rounded transition ${
                  editor?.isActive({ textAlign: 'justify' })
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
                title="Justify"
              >
                ≡
              </button>
            </div>

            {/* Row 4: Lists & Blocks */}
            <div className="flex flex-wrap gap-1 mb-2">
              <label className="text-xs font-semibold text-gray-600 flex items-center mr-2">Lists:</label>
              <button
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={`px-3 py-2 rounded transition ${
                  editor?.isActive('bulletList')
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
                title="Bullet List"
              >
                • Bullet
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                className={`px-3 py-2 rounded transition ${
                  editor?.isActive('orderedList')
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
                title="Numbered List"
              >
                1. Ordered
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                className={`px-3 py-2 rounded transition ${
                  editor?.isActive('blockquote')
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
                title="Blockquote"
              >
                &ldquo; Quote
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                className={`px-3 py-2 rounded transition ${
                  editor?.isActive('codeBlock')
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
                title="Code Block"
              >
                {} Code Block
              </button>
            </div>

            {/* Row 5: Media & Links */}
            <div className="flex flex-wrap gap-1">
              <label className="text-xs font-semibold text-gray-600 flex items-center mr-2">Insert:</label>
              <button
                onClick={addLink}
                className={`px-3 py-2 rounded transition ${
                  editor?.isActive('link')
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
                title="Insert Link"
              >
                🔗 Link
              </button>
              <button
                onClick={addImage}
                className="px-3 py-2 rounded bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 transition"
                title="Insert Image"
              >
                🖼️ Image
              </button>
              
              <div className="ml-auto flex gap-1">
                <button
                  onClick={() => editor?.chain().focus().undo().run()}
                  disabled={!editor?.can().undo()}
                  className="px-3 py-2 rounded bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 transition disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Undo"
                >
                  ↶ Undo
                </button>
                <button
                  onClick={() => editor?.chain().focus().redo().run()}
                  disabled={!editor?.can().redo()}
                  className="px-3 py-2 rounded bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 transition disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Redo"
                >
                  ↷ Redo
                </button>
              </div>
            </div>
          </div>

          {/* Editor Content Area with Better Styling */}
          <div className="bg-white p-6 min-h-96 focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-1 space-y-2">
            <style>{`
              .tiptap {
                outline: none;
                word-wrap: break-word;
              }
              
              .tiptap h1 {
                font-size: 2rem;
                font-weight: 800;
                line-height: 1.2;
                margin: 1.5rem 0 1rem 0;
                color: #1f2937;
              }
              
              .tiptap h2 {
                font-size: 1.75rem;
                font-weight: 700;
                line-height: 1.25;
                margin: 1.25rem 0 0.75rem 0;
                color: #374151;
              }
              
              .tiptap h3 {
                font-size: 1.5rem;
                font-weight: 700;
                line-height: 1.3;
                margin: 1rem 0 0.5rem 0;
                color: #4b5563;
              }
              
              .tiptap h4 {
                font-size: 1.25rem;
                font-weight: 600;
                margin: 0.75rem 0 0.5rem 0;
              }
              
              .tiptap h5 {
                font-size: 1.1rem;
                font-weight: 600;
                margin: 0.75rem 0 0.5rem 0;
              }
              
              .tiptap h6 {
                font-size: 1rem;
                font-weight: 600;
                margin: 0.75rem 0 0.5rem 0;
              }
              
              .tiptap p {
                line-height: 1.6;
                margin: 0.5rem 0;
                font-size: 1rem;
                color: #111827;
              }
              
              .tiptap strong {
                font-weight: 700;
                color: #000;
              }
              
              .tiptap em {
                font-style: italic;
                color: #374151;
              }
              
              .tiptap u {
                text-decoration: underline;
                text-decoration-thickness: 2px;
                text-underline-offset: 3px;
              }
              
              .tiptap s {
                text-decoration: line-through;
              }
              
              .tiptap code {
                background-color: #f3f4f6;
                padding: 0.2rem 0.4rem;
                border-radius: 0.25rem;
                font-family: 'Courier New', monospace;
                font-size: 0.9em;
                color: #d73a49;
              }
              
              .tiptap pre {
                background-color: #1f2937;
                color: #e5e7eb;
                padding: 1rem;
                border-radius: 0.5rem;
                overflow-x: auto;
                margin: 1rem 0;
              }
              
              .tiptap pre code {
                background-color: transparent;
                padding: 0;
                color: inherit;
              }
              
              .tiptap a {
                color: #2563eb;
                text-decoration: underline;
                cursor: pointer;
                transition: color 0.2s;
              }
              
              .tiptap a:hover {
                color: #1d4ed8;
              }
              
              .tiptap ul {
                list-style: disc;
                padding-left: 2rem;
                margin: 0.5rem 0;
              }
              
              .tiptap ol {
                list-style: decimal;
                padding-left: 2rem;
                margin: 0.5rem 0;
              }
              
              .tiptap li {
                margin: 0.25rem 0;
                line-height: 1.6;
              }
              
              .tiptap blockquote {
                border-left: 4px solid #d1d5db;
                padding-left: 1rem;
                margin: 1rem 0;
                font-style: italic;
                color: #6b7280;
              }
              
              .tiptap img {
                max-width: 100%;
                border-radius: 0.5rem;
                margin: 1rem 0;
              }
            `}</style>
            <EditorContent 
              editor={editor} 
              className="focus:outline-none"
            />
          </div>
        </>
      ) : (
        <div className="p-4 bg-white">
          <textarea
            value={codeValue}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="w-full h-96 p-3 border border-gray-300 rounded font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Edit HTML directly..."
          />
          <p className="text-xs text-gray-500 mt-2">Paste HTML or edit the raw code. It will sync to the visual editor.</p>
        </div>
      )}
    </div>
  )
}
