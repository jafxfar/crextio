'use client'

import { BookOpen } from 'lucide-react'
import type { EditorStep } from '@/lib/course-editor-types'
import { EditorHeader } from '../step-editor-header'
import { RichTextEditor } from '../rich-text-editor'

interface TextStepEditorProps {
  step: EditorStep
  onBack: () => void
  onChange: (s: EditorStep) => void
}

export function TextStepEditor({ step, onBack, onChange }: TextStepEditorProps) {
  return (
    <div className="flex flex-col gap-4">
      <EditorHeader
        step={step}
        onBack={onBack}
        accentIcon={BookOpen}
        accentClass="bg-blue-500/20 text-blue-600"
      />
      <RichTextEditor
        content={step.data.content ?? ''}
        onChange={(html) => onChange({ ...step, data: { ...step.data, content: html } })}
        placeholder="Start writing the content for this step…"
      />
    </div>
  )
}
