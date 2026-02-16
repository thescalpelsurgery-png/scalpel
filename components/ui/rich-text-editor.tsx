"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import LinkExtension from '@tiptap/extension-link'
import { Button } from "@/components/ui/button"
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Link as LinkIcon,
    Unlink
} from "lucide-react"

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            LinkExtension.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline cursor-pointer',
                },
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 prose prose-sm max-w-none',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    if (!editor) {
        return null
    }

    const setLink = () => {
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
    }

    return (
        <div className="border rounded-md overflow-hidden bg-white">
            <div className="border-b bg-slate-50 p-1 flex flex-wrap gap-1">
                <Button
                    variant={editor.isActive('bold') ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    type="button"
                    title="Bold"
                >
                    <Bold className="h-4 w-4" />
                </Button>

                <Button
                    variant={editor.isActive('italic') ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    type="button"
                    title="Italic"
                >
                    <Italic className="h-4 w-4" />
                </Button>

                <Button
                    variant={editor.isActive('underline') ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    type="button"
                    title="Underline"
                >
                    <UnderlineIcon className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-slate-200 mx-1 self-center" />

                <Button
                    variant={editor.isActive('bulletList') ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    type="button"
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </Button>

                <Button
                    variant={editor.isActive('orderedList') ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    type="button"
                    title="Ordered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-slate-200 mx-1 self-center" />

                <Button
                    variant={editor.isActive('link') ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={setLink}
                    type="button"
                    title="Link"
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>

                {editor.isActive('link') && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => editor.chain().focus().unsetLink().run()}
                        type="button"
                        title="Unlink"
                    >
                        <Unlink className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <EditorContent editor={editor} />
        </div>
    )
}
