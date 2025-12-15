'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Heading1, Heading2, Quote, Undo, Redo } from 'lucide-react'

interface EditorProps {
    value: string
    onChange: (content: string) => void
    label?: string
}

export default function Editor({ value, onChange, label }: EditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-[#6E8C82] hover:underline',
                },
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] px-4 py-3',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        immediatelyRender: false,
    })

    if (!editor) {
        return null
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        // cancelled
        if (url === null) {
            return
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        // update
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}
            <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#6E8C82] focus-within:border-transparent transition-all">
                {/* Toolbar */}
                <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1">
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        disabled={!editor.can().chain().focus().toggleBold().run()}
                        className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('bold') ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
                        title="Bold"
                        type="button"
                    >
                        <Bold size={18} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        disabled={!editor.can().chain().focus().toggleItalic().run()}
                        className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('italic') ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
                        title="Italic"
                        type="button"
                    >
                        <Italic size={18} />
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
                        title="Heading 2"
                        type="button"
                    >
                        <Heading1 size={18} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
                        title="Heading 3"
                        type="button"
                    >
                        <Heading2 size={18} />
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('bulletList') ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
                        title="Bullet List"
                        type="button"
                    >
                        <List size={18} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('orderedList') ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
                        title="Ordered List"
                        type="button"
                    >
                        <ListOrdered size={18} />
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
                    <button
                        onClick={setLink}
                        className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('link') ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
                        title="Link"
                        type="button"
                    >
                        <LinkIcon size={18} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('blockquote') ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
                        title="Quote"
                        type="button"
                    >
                        <Quote size={18} />
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
                    <button
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().chain().focus().undo().run()}
                        className="p-2 rounded hover:bg-gray-200 text-gray-600 disabled:opacity-50 transition-colors"
                        title="Undo"
                        type="button"
                    >
                        <Undo size={18} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().chain().focus().redo().run()}
                        className="p-2 rounded hover:bg-gray-200 text-gray-600 disabled:opacity-50 transition-colors"
                        title="Redo"
                        type="button"
                    >
                        <Redo size={18} />
                    </button>
                </div>

                {/* Editor Content */}
                <EditorContent editor={editor} className="bg-white min-h-[200px]" />
            </div>
        </div>
    )
}
