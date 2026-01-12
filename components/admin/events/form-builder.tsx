"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, GripVertical } from "lucide-react"
import type { RegistrationField } from "@/lib/types"

interface FormBuilderProps {
    fields: RegistrationField[]
    onChange: (fields: RegistrationField[]) => void
}

export function FormBuilder({ fields, onChange }: FormBuilderProps) {
    const [newField, setNewField] = useState<Partial<RegistrationField>>({
        type: "text",
        label: "",
        required: false,
        placeholder: "",
        options: [],
    })
    const [optionsInput, setOptionsInput] = useState("")

    const handleAddField = () => {
        if (!newField.label) return

        const field: RegistrationField = {
            id: Math.random().toString(36).substring(2, 9),
            type: newField.type as any,
            label: newField.label,
            required: newField.required,
            placeholder: newField.placeholder,
            options: newField.type === "select" || newField.type === "checkbox"
                ? optionsInput.split(",").map(s => s.trim()).filter(Boolean)
                : undefined
        }

        onChange([...fields, field])
        setNewField({
            type: "text",
            label: "",
            required: false,
            placeholder: "",
            options: []
        })
        setOptionsInput("")
    }

    const handleDeleteField = (id: string) => {
        onChange(fields.filter(f => f.id !== id))
    }

    return (
        <div className="space-y-6 border rounded-lg p-4 bg-slate-50">
            <div className="space-y-2">
                <h3 className="font-semibold text-lg">Custom Registration Form</h3>
                <p className="text-sm text-slate-500">
                    Define extra fields for the registration popup. Name and Email are always included.
                </p>
            </div>

            <div className="space-y-4">
                {fields.map((field, index) => (
                    <Card key={field.id} className="relative">
                        <CardContent className="p-4 flex items-start gap-4">
                            <div className="mt-2 text-slate-400">
                                <GripVertical className="w-5 h-5" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-slate-900">{field.label}</span>
                                    {field.required && <span className="text-red-500 text-xs bg-red-50 px-1.5 py-0.5 rounded">Required</span>}
                                    <span className="text-xs text-slate-500 uppercase bg-slate-100 px-1.5 py-0.5 rounded border">
                                        {field.type}
                                    </span>
                                </div>
                                {field.placeholder && <p className="text-sm text-slate-500">Placeholder: {field.placeholder}</p>}
                                {field.options && field.options.length > 0 && (
                                    <p className="text-sm text-slate-500">
                                        Options: {field.options.join(", ")}
                                    </p>
                                )}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteField(field.id)}
                                className="text-slate-400 hover:text-red-500"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-medium text-sm text-slate-900">Add New Field</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Label</Label>
                        <Input
                            value={newField.label}
                            onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                            placeholder="e.g., T-Shirt Size"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                            value={newField.type}
                            onValueChange={(val: any) => setNewField({ ...newField, type: val })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="text">Text Input</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="select">Dropdown</SelectItem>
                                <SelectItem value="checkbox">Checkbox (Multiple)</SelectItem>
                                <SelectItem value="file">File Upload</SelectItem>
                                <SelectItem value="date">Date Picker</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {(newField.type === "select" || newField.type === "checkbox") && (
                    <div className="space-y-2">
                        <Label>Options (comma separated)</Label>
                        <Textarea
                            value={optionsInput}
                            onChange={(e) => setOptionsInput(e.target.value)}
                            placeholder="Small, Medium, Large, XL"
                            rows={2}
                        />
                    </div>
                )}

                {newField.type === "text" && (
                    <div className="space-y-2">
                        <Label>Placeholder</Label>
                        <Input
                            value={newField.placeholder}
                            onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                            placeholder="e.g. Enter your answer"
                        />
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <Checkbox
                        id="req"
                        checked={newField.required}
                        onCheckedChange={(c) => setNewField({ ...newField, required: c as boolean })}
                    />
                    <Label htmlFor="req" className="cursor-pointer">Required Field</Label>
                </div>

                <Button onClick={handleAddField} disabled={!newField.label} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Field
                </Button>
            </div>
        </div>
    )
}
