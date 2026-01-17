"use client"

import { useState } from "react"
import { EventSection, EventSectionType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    Type,
    List,
    Heading as HeadingIcon,
    Table as TableIcon,
    Image as ImageIcon,
    GalleryHorizontalEnd,
    LayoutGrid,
    Users,
    Trash2,
    MoveUp,
    MoveDown,
    Plus,
    Loader2,
    X
} from "lucide-react"

interface ContentBuilderProps {
    sections: EventSection[]
    onChange: (sections: EventSection[]) => void
    onUpload: (file: File) => Promise<string>
}

export function ContentBuilder({ sections, onChange, onUpload }: ContentBuilderProps) {
    const [activeSectionId, setActiveSectionId] = useState<string | null>(null)

    const addSection = (type: EventSectionType) => {
        const newSection: EventSection = {
            id: Math.random().toString(36).substring(2, 9),
            type,
            content: getDefaultContent(type)
        }
        onChange([...sections, newSection])
        setActiveSectionId(newSection.id)
    }

    const updateSection = (id: string, content: any) => {
        onChange(sections.map(s => s.id === id ? { ...s, content } : s))
    }

    const removeSection = (id: string) => {
        onChange(sections.filter(s => s.id !== id))
        if (activeSectionId === id) setActiveSectionId(null)
    }

    const moveSection = (index: number, direction: "up" | "down") => {
        if (
            (direction === "up" && index === 0) ||
            (direction === "down" && index === sections.length - 1)
        ) return

        const newSections = [...sections]
        const targetIndex = direction === "up" ? index - 1 : index + 1
        const temp = newSections[index]
        newSections[index] = newSections[targetIndex]
        newSections[targetIndex] = temp
        onChange(newSections)
    }

    const getDefaultContent = (type: EventSectionType) => {
        switch (type) {
            case "text": return { text: "" }
            case "heading": return { text: "" }
            case "bullets": return { items: [""] }
            case "table": return { columns: ["Column 1", "Column 2"], rows: [["Data 1", "Data 2"]] }
            case "image": return { url: "", alt: "", caption: "" }
            case "slider": return { images: [] }
            case "grid": return { images: [] }
            case "leadership": return { members: [] }
            default: return {}
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => addSection("heading")} className="flex items-center gap-2">
                    <HeadingIcon className="w-4 h-4" /> Heading
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => addSection("text")} className="flex items-center gap-2">
                    <Type className="w-4 h-4" /> Text
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => addSection("bullets")} className="flex items-center gap-2">
                    <List className="w-4 h-4" /> Bullets
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => addSection("image")} className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Image
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => addSection("table")} className="flex items-center gap-2">
                    <TableIcon className="w-4 h-4" /> Table
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => addSection("slider")} className="flex items-center gap-2">
                    <GalleryHorizontalEnd className="w-4 h-4" /> Slider
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => addSection("grid")} className="flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4" /> Grid
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => addSection("leadership")} className="flex items-center gap-2">
                    <Users className="w-4 h-4" /> Leadership
                </Button>
            </div>

            <div className="space-y-4">
                {sections.map((section, index) => (
                    <Card key={section.id} className={`border ${activeSectionId === section.id ? 'border-blue-500 shadow-md' : 'border-slate-200'}`}>
                        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between bg-slate-50 border-b">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm uppercase text-slate-500">{section.type} Section</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button type="button" variant="ghost" size="icon" disabled={index === 0} onClick={() => moveSection(index, "up")}>
                                    <MoveUp className="w-4 h-4" />
                                </Button>
                                <Button type="button" variant="ghost" size="icon" disabled={index === sections.length - 1} onClick={() => moveSection(index, "down")}>
                                    <MoveDown className="w-4 h-4" />
                                </Button>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeSection(section.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            <SectionEditor
                                section={section}
                                onChange={(content) => updateSection(section.id, content)}
                                onUpload={onUpload}
                            />
                        </CardContent>
                    </Card>
                ))}

                {sections.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-lg text-slate-500">
                        <p>No content sections added yet.</p>
                        <p className="text-sm">Click the buttons above to add content to your event.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

// Sub-component for editing specific sections
function SectionEditor({ section, onChange, onUpload }: { section: EventSection, onChange: (c: any) => void, onUpload: (f: File) => Promise<string> }) {
    const { type, content } = section
    const [uploading, setUploading] = useState(false)
    const [urlInput, setUrlInput] = useState("")

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
        if (e.target.files?.[0]) {
            setUploading(true)
            try {
                const url = await onUpload(e.target.files[0])
                callback(url)
            } catch (err) {
                console.error("Upload failed", err)
            } finally {
                setUploading(false)
            }
        }
    }

    switch (type) {
        case "heading":
            return (
                <div className="space-y-2">
                    <Label>Heading Text (H2)</Label>
                    <Input
                        value={content.text || ""}
                        onChange={(e) => onChange({ ...content, text: e.target.value })}
                        placeholder="Enter heading..."
                    />
                </div>
            )

        case "text":
            return (
                <div className="space-y-2">
                    <Label>Paragraph Text</Label>
                    <Textarea
                        value={content.text || ""}
                        onChange={(e) => onChange({ ...content, text: e.target.value })}
                        placeholder="Enter text..."
                        rows={4}
                    />
                </div>
            )

        case "bullets":
            return (
                <div className="space-y-2">
                    <Label>Bullet Points</Label>
                    {(content.items || []).map((item: string, idx: number) => (
                        <div key={idx} className="flex gap-2">
                            <Input
                                value={item}
                                onChange={(e) => {
                                    const newItems = [...(content.items || [])]
                                    newItems[idx] = e.target.value
                                    onChange({ ...content, items: newItems })
                                }}
                                placeholder={`Point ${idx + 1}`}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    const newItems = [...(content.items || [])]
                                    newItems.splice(idx, 1)
                                    onChange({ ...content, items: newItems })
                                }}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onChange({ ...content, items: [...(content.items || []), ""] })}
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add Point
                    </Button>
                </div>
            )

        case "table":
            return (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Columns (Comma separated)</Label>
                        <Input
                            value={(content.columns || []).join(", ")}
                            onChange={(e) => {
                                const cols = e.target.value.split(",").map(c => c.trim())
                                onChange({ ...content, columns: cols })
                            }}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Rows</Label>
                        {(content.rows || []).map((row: string[], rIdx: number) => (
                            <div key={rIdx} className="flex gap-2 items-center">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 flex-1">
                                    {row.map((cell, cIdx) => (
                                        <Input
                                            key={cIdx}
                                            value={cell}
                                            onChange={(e) => {
                                                const newRows = [...(content.rows || [])]
                                                newRows[rIdx][cIdx] = e.target.value
                                                onChange({ ...content, rows: newRows })
                                            }}
                                            placeholder={`Val ${cIdx + 1}`}
                                        />
                                    ))}
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        const newRows = [...(content.rows || [])]
                                        newRows.splice(rIdx, 1)
                                        onChange({ ...content, rows: newRows })
                                    }}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const colCount = (content.columns || []).length || 2
                                onChange({ ...content, rows: [...(content.rows || []), Array(colCount).fill("")] })
                            }}
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add Row
                        </Button>
                    </div>
                </div>
            )

        case "image":
            return (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Image Source</Label>
                        <div className="flex gap-2">
                            <Input
                                value={content.url || ""}
                                onChange={(e) => onChange({ ...content, url: e.target.value })}
                                placeholder="https://..."
                            />
                            <div className="relative">
                                <Button type="button" variant="outline" size="icon" disabled={uploading}>
                                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                </Button>
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept="image/*"
                                    onChange={(e) => handleUpload(e, (url) => onChange({ ...content, url }))}
                                />
                            </div>
                        </div>
                        {content.url && <img src={content.url} alt="Preview" className="w-full aspect-video object-cover rounded border mt-2" />}
                    </div>
                    <div className="space-y-2">
                        <Label>Caption (Optional)</Label>
                        <Input
                            value={content.caption || ""}
                            onChange={(e) => onChange({ ...content, caption: e.target.value })}
                        />
                    </div>
                </div>
            )

        case "slider":
        case "grid":
            return (
                <div className="space-y-4">
                    <Label>{type === "slider" ? "Slider Images (Max 5)" : "Grid Images"}</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {(content.images || []).map((img: string, idx: number) => (
                            <div key={idx} className="relative group">
                                <img src={img} alt={`Image ${idx}`} className="w-full aspect-video object-cover rounded border" />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newImgs = [...(content.images || [])]
                                        newImgs.splice(idx, 1)
                                        onChange({ ...content, images: newImgs })
                                    }}
                                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-50"
                                >
                                    <X className="w-3 h-3 text-red-500" />
                                </button>
                            </div>
                        ))}
                        <div className="h-24 border-2 border-dashed border-slate-200 rounded flex items-center justify-center relative cursor-pointer hover:bg-slate-50">
                            {uploading ? <Loader2 className="w-6 h-6 animate-spin text-slate-400" /> : <Plus className="w-6 h-6 text-slate-400" />}
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept="image/*"
                                disabled={uploading || (type === 'slider' && (content.images || []).length >= 5)}
                                onChange={(e) => handleUpload(e, (url) => {
                                    if (type === 'slider' && (content.images || []).length >= 5) return
                                    onChange({ ...content, images: [...(content.images || []), url] })
                                })}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Input
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="Add image via URL"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                if (!urlInput) return
                                if (type === 'slider' && (content.images || []).length >= 5) return
                                onChange({ ...content, images: [...(content.images || []), urlInput] })
                                setUrlInput("")
                            }}
                            disabled={!urlInput || (type === 'slider' && (content.images || []).length >= 5)}
                        >
                            Add
                        </Button>
                    </div>

                    {type === 'slider' && <p className="text-xs text-slate-500">Max 5 images allowed for slider.</p>}
                </div>
            )

        case "leadership":
            return (
                <div className="space-y-4">
                    <Label>Team Members</Label>
                    {(content.members || []).map((member: any, idx: number) => (
                        <div key={idx} className="border p-4 rounded-lg space-y-3 relative bg-white">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                                onClick={() => {
                                    const newMembers = [...(content.members || [])]
                                    newMembers.splice(idx, 1)
                                    onChange({ ...content, members: newMembers })
                                }}
                            >
                                <X className="w-4 h-4" />
                            </Button>

                            <div className="flex gap-4 items-start">
                                <div className="shrink-0 space-y-2 text-center">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 border overflow-hidden">
                                        {member.image && <img src={member.image} alt={member.name} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="relative">
                                        <Button type="button" size="sm" variant="outline" className="w-full text-xs h-6 px-1">Upload</Button>
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            accept="image/*"
                                            onChange={(e) => handleUpload(e, (url) => {
                                                const newMembers = [...(content.members || [])]
                                                newMembers[idx] = { ...member, image: url }
                                                onChange({ ...content, members: newMembers })
                                            })}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <Input
                                            placeholder="Image URL"
                                            value={member.image || ""}
                                            onChange={(e) => {
                                                const newMembers = [...(content.members || [])]
                                                newMembers[idx] = { ...member, image: e.target.value }
                                                onChange({ ...content, members: newMembers })
                                            }}
                                            className="h-7 text-xs px-2"
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 space-y-2">
                                    <Input
                                        placeholder="Name"
                                        value={member.name || ""}
                                        onChange={(e) => {
                                            const newMembers = [...(content.members || [])]
                                            newMembers[idx].name = e.target.value
                                            onChange({ ...content, members: newMembers })
                                        }}
                                    />
                                    <Input
                                        placeholder="Role / Title"
                                        value={member.role || ""}
                                        onChange={(e) => {
                                            const newMembers = [...(content.members || [])]
                                            newMembers[idx].role = e.target.value
                                            onChange({ ...content, members: newMembers })
                                        }}
                                    />
                                    <Textarea
                                        placeholder="Short Bio / Description"
                                        rows={2}
                                        value={member.bio || ""}
                                        onChange={(e) => {
                                            const newMembers = [...(content.members || [])]
                                            newMembers[idx].bio = e.target.value
                                            onChange({ ...content, members: newMembers })
                                        }}
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input
                                            placeholder="Twitter / X Link"
                                            value={member.links?.x || ""}
                                            onChange={(e) => {
                                                const newMembers = [...(content.members || [])]
                                                newMembers[idx].links = { ...(member.links || {}), x: e.target.value }
                                                onChange({ ...content, members: newMembers })
                                            }}
                                        />
                                        <Input
                                            placeholder="LinkedIn Link"
                                            value={member.links?.linkedin || ""}
                                            onChange={(e) => {
                                                const newMembers = [...(content.members || [])]
                                                newMembers[idx].links = { ...(member.links || {}), linkedin: e.target.value }
                                                onChange({ ...content, members: newMembers })
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onChange({ ...content, members: [...(content.members || []), { name: "", role: "", links: {} }] })}
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add Member
                    </Button>
                </div>
            )

        default:
            return <div>Unknown section type</div>
    }
}
