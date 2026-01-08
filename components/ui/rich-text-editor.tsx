"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, List, Heading2, Heading3, ListOrdered, Quote, Code, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
    placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline',
                },
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'tiptap p-6',
            },
        },
    })

    // Synchronize content updates from parent (e.g. when loading a draft)
    useEffect(() => {
        if (editor && content && editor.getHTML() !== content) {
            editor.commands.setContent(content)
        }
    }, [content, editor])

    const setLink = useCallback(() => {
        if (!editor) return

        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        if (url === null) {
            return
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }, [editor])

    if (!editor) {
        return null
    }

    return (
        <div className="border rounded-md overflow-hidden bg-white">
            <div className="border-b bg-slate-50 p-1 flex gap-1 flex-wrap">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={cn(editor.isActive('bold') && 'bg-slate-200')}
                    title="Bold"
                >
                    <Bold className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={cn(editor.isActive('italic') && 'bg-slate-200')}
                    title="Italic"
                >
                    <Italic className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={cn(editor.isActive('underline') && 'bg-slate-200')}
                    title="Underline"
                >
                    <UnderlineIcon className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={cn(editor.isActive('strike') && 'bg-slate-200')}
                    title="Strikethrough"
                >
                    <Strikethrough className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-slate-300 mx-1 self-center" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={cn(editor.isActive('heading', { level: 2 }) && 'bg-slate-200')}
                    title="Heading 2"
                >
                    <Heading2 className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={cn(editor.isActive('heading', { level: 3 }) && 'bg-slate-200')}
                    title="Heading 3"
                >
                    <Heading3 className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-slate-300 mx-1 self-center" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={cn(editor.isActive('bulletList') && 'bg-slate-200')}
                    title="Bullet List"
                >
                    <List className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={cn(editor.isActive('orderedList') && 'bg-slate-200')}
                    title="Ordered List"
                >
                    <ListOrdered className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-slate-300 mx-1 self-center" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={cn(editor.isActive('blockquote') && 'bg-slate-200')}
                    title="Blockquote"
                >
                    <Quote className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={cn(editor.isActive('code') && 'bg-slate-200')}
                    title="Inline Code"
                >
                    <Code className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={setLink}
                    className={cn(editor.isActive('link') && 'bg-slate-200')}
                    title="Add Link"
                >
                    <LinkIcon className="w-4 h-4" />
                </Button>
            </div>
            <EditorContent editor={editor} />
        </div>
    )
}

