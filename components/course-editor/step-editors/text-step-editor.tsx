'use client'

import { BookOpen } from 'lucide-react'
import type { EditorStep } from '@/lib/course-editor-types'
import { EditorHeader } from '../step-editor-header'
import { RichTextEditor } from '../rich-text-editor'
import { AudioGeneratorPanel } from '../audio-generator-panel'

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
        onSave={() => onChange({ ...step })}
      />
      <RichTextEditor
        content={step.data.content ?? ''}
        onChange={(html) => onChange({ ...step, data: { ...step.data, content: html } })}
        placeholder="Start writing the content for this step…"
      />
      <AudioGeneratorPanel
        htmlContent={step.data.content ?? ''}
        onAudioGenerated={(dataUrl) =>
          onChange({ ...step, data: { ...step.data, audioUrl: dataUrl } })
        }
      />
    </div>
  )
}
