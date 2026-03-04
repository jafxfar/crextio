'use client'

import { useState } from 'react'
import {
  FileText,
  Video,
  HelpCircle,
  Upload,
  X,
  Plus,
  GripVertical,
  Check,
  ListOrdered,
  CheckSquare,
  Circle,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EditorStep, StepType, QuestionType, EditorQuestion, QuestionOption } from '@/lib/course-editor-types'

interface StepEditorProps {
  step: EditorStep
  onChange: (updated: EditorStep) => void
  onDelete: () => void
}

const STEP_TYPES: { value: StepType; label: string; icon: React.ElementType; color: string; bg: string }[] = [
  { value: 'info',     label: 'Info',     icon: FileText,   color: 'text-foreground',    bg: 'bg-secondary border-border' },
  { value: 'video',    label: 'Video',    icon: Video,      color: 'text-foreground',    bg: 'bg-nav-pill/10 border-nav-pill/20' },
  { value: 'question', label: 'Question', icon: HelpCircle, color: 'text-amber-700',     bg: 'bg-amber-50 border-amber-200' },
  { value: 'file',     label: 'File',     icon: Upload,     color: 'text-emerald-700',   bg: 'bg-emerald-50 border-emerald-200' },
]

const QUESTION_TYPES: { value: QuestionType; label: string; icon: React.ElementType; desc: string }[] = [
  { value: 'SINGLE_CHOICE', label: 'Single Choice', icon: Circle, desc: 'One correct answer' },
  { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice', icon: CheckSquare, desc: 'Many correct answers' },
  { value: 'POSITIONING', label: 'Ordering', icon: ListOrdered, desc: 'Arrange in sequence' },
]

function newOption(): QuestionOption {
  return { id: Number(`opt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`), text: '' }
}

export function StepEditor({ step, onChange, onDelete }: StepEditorProps) {
  const [collapsed, setCollapsed] = useState(false)

  const meta = STEP_TYPES.find((t) => t.value === step.type)!

  function patch(partial: Partial<EditorStep>) {
    onChange({ ...step, ...partial })
  }

  function patchQuestion(partial: Partial<EditorQuestion>) {
    onChange({ ...step, data: { ...step.question!, ...partial } })
  }

  function changeType(type: StepType) {
    const base: EditorStep = {
      ...step,
      type,
      videoUrl: undefined,
      videoDurationMin: undefined,
      content: undefined,
      question: undefined,
      fileLabel: undefined,
      fileAccept: undefined,
    }
    if (type === 'question') {
      base.question = {
        id: `q-${Date.now()}`,
        type: 'single',
        prompt: '',
        options: [newOption(), newOption()],
        correctIndices: [],
        points: 10,
      }
    }
    onChange(base)
  }

  return (
    <div className="group relative bg-card border border-border rounded-xl shadow-sm overflow-hidden transition-shadow hover:shadow-md">
      {/* Step header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-secondary/30">
        <GripVertical className="w-4 h-4 text-muted-foreground/40 cursor-grab flex-shrink-0" />
        <div className={cn('flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs font-semibold', meta.bg, meta.color)}>
          <meta.icon className="w-3 h-3" />
          {meta.label}
        </div>
        <input
          className="flex-1 text-sm font-medium bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground min-w-0"
          value={step.title}
          onChange={(e) => patch({ title: e.target.value })}
          placeholder="Step title..."
        />
        <div className="flex items-center gap-1 ml-auto flex-shrink-0">
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="w-7 h-7 rounded-lg bg-secondary hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors text-xs"
            aria-label={collapsed ? 'Expand step' : 'Collapse step'}
          >
            {collapsed ? '▼' : '▲'}
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="w-7 h-7 rounded-lg hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-muted-foreground transition-colors"
            aria-label="Delete step"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-4 space-y-4">
          {/* Type picker */}
          <div className="flex gap-2">
            {STEP_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => changeType(t.value)}
                className={cn(
                  'flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border text-xs font-medium transition-all',
                  step.type === t.value
                    ? cn(t.bg, t.color, 'shadow-sm')
                    : 'bg-secondary/50 border-border text-muted-foreground hover:bg-secondary',
                )}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>

          {/* Type-specific content */}
          {step.type === 'info' && <InfoStepContent step={step} patch={patch} />}
          {step.type === 'video' && <VideoStepContent step={step} patch={patch} />}
          {step.type === 'question' && step.question && (
            <QuestionStepContent question={step.question} patchQuestion={patchQuestion} />
          )}
          {step.type === 'file' && <FileStepContent step={step} patch={patch} />}
        </div>
      )}
    </div>
  )
}

// ─── Info Step ────────────────────────────────────────────────────────────────

function InfoStepContent({ step, patch }: { step: EditorStep; patch: (p: Partial<EditorStep>) => void }) {
  return (
    <div className="space-y-2">
      <label className={labelCls}>Content</label>
      <textarea
        className={cn(inputCls, 'min-h-[120px] resize-y')}
        value={step.content ?? ''}
        onChange={(e) => patch({ content: e.target.value })}
        placeholder="Write the informational content for this step..."
      />
    </div>
  )
}

// ─── Video Step ───────────────────────────────────────────────────────────────

function VideoStepContent({ step, patch }: { step: EditorStep; patch: (p: Partial<EditorStep>) => void }) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <label className={labelCls}>Video URL</label>
        <input
          className={inputCls}
          value={step.videoUrl ?? ''}
          onChange={(e) => patch({ videoUrl: e.target.value })}
          placeholder="https://example.com/video.mp4 or embed URL"
        />
      </div>
      <div className="space-y-2">
        <label className={labelCls}>Duration (minutes)</label>
        <input
          type="number"
          min={0}
          className={cn(inputCls, 'w-32')}
          value={step.videoDurationMin ?? ''}
          onChange={(e) => patch({ videoDurationMin: Number(e.target.value) })}
          placeholder="0"
        />
      </div>
      {step.videoUrl && (
        <div className="flex items-center gap-2 p-2.5 bg-violet-50 border border-violet-100 rounded-xl text-xs text-violet-700">
          <Video className="w-3.5 h-3.5 flex-shrink-0" />
          Preview available when course is published
        </div>
      )}
    </div>
  )
}

// ─── File Step ────────────────────────────────────────────────────────────────

function FileStepContent({ step, patch }: { step: EditorStep; patch: (p: Partial<EditorStep>) => void }) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <label className={labelCls}>File Label</label>
        <input
          className={inputCls}
          value={step.fileLabel ?? ''}
          onChange={(e) => patch({ fileLabel: e.target.value })}
          placeholder="e.g. Safety Checklist PDF"
        />
      </div>
      <div className="space-y-2">
        <label className={labelCls}>Accepted Types</label>
        <input
          className={inputCls}
          value={step.fileAccept ?? ''}
          onChange={(e) => patch({ fileAccept: e.target.value })}
          placeholder=".pdf, .docx, .xlsx"
        />
      </div>
      <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/60">
        <span className="text-sm text-foreground flex-1">Require upload to proceed</span>
        <button
          type="button"
          role="switch"
          aria-checked={step.required ?? false}
          onClick={() => patch({ required: !(step.required ?? false) })}
          className={cn(
            'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
            step.required ? 'bg-primary' : 'bg-muted-foreground/30',
          )}
        >
          <span
            className={cn(
              'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200',
              step.required ? 'translate-x-4' : 'translate-x-0',
            )}
          />
        </button>
      </div>
    </div>
  )
}

// ─── Question Step ────────────────────────────────────────────────────────────

function QuestionStepContent({
  question,
  patchQuestion,
}: {
  question: EditorQuestion
  patchQuestion: (p: Partial<EditorQuestion>) => void
}) {
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)

  function addOption() {
    patchQuestion({ options: [...question.options, newOption()] })
  }

  function removeOption(idx: number) {
    const opts = question.options.filter((_, i) => i !== idx)
    const corrects = question.correctIndices
      .filter((c) => c !== idx)
      .map((c) => (c > idx ? c - 1 : c))
    patchQuestion({ options: opts, correctIndices: corrects })
  }

  function updateOption(idx: number, text: string) {
    const opts = question.options.map((o, i) => (i === idx ? { ...o, text } : o))
    patchQuestion({ options: opts })
  }

  function toggleCorrect(idx: number) {
    if (question.type === 'single') {
      patchQuestion({ correctIndices: [idx] })
    } else if (question.type === 'multiple') {
      const already = question.correctIndices.includes(idx)
      patchQuestion({
        correctIndices: already
          ? question.correctIndices.filter((c) => c !== idx)
          : [...question.correctIndices, idx],
      })
    }
  }

  // Drag-and-drop for ordering question options
  function handleDragStart(idx: number) {
    setDragIdx(idx)
  }
  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault()
    setDragOverIdx(idx)
  }
  function handleDrop(e: React.DragEvent, idx: number) {
    e.preventDefault()
    if (dragIdx === null || dragIdx === idx) return
    const opts = [...question.options]
    const [moved] = opts.splice(dragIdx, 1)
    opts.splice(idx, 0, moved)
    patchQuestion({ options: opts, correctIndices: [] })
    setDragIdx(null)
    setDragOverIdx(null)
  }
  function handleDragEnd() {
    setDragIdx(null)
    setDragOverIdx(null)
  }

  return (
    <div className="space-y-4">
      {/* Question type */}
      <div className="space-y-2">
        <label className={labelCls}>Question Type</label>
        <div className="grid grid-cols-3 gap-2">
          {QUESTION_TYPES.map((qt) => (
            <button
              key={qt.value}
              type="button"
              onClick={() => patchQuestion({ type: qt.value, correctIndices: [] })}
              className={cn(
                'flex flex-col items-center gap-1 p-2.5 rounded-xl border text-center transition-all',
                question.type === qt.value
                  ? 'bg-primary/20 border-primary/40 text-foreground'
                  : 'bg-secondary/50 border-border text-muted-foreground hover:bg-secondary',
              )}
            >
              <qt.icon className="w-4 h-4" />
              <span className="text-xs font-semibold">{qt.label}</span>
              <span className="text-[10px] opacity-70">{qt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Prompt */}
      <div className="space-y-2">
        <label className={labelCls}>Question Prompt</label>
        <textarea
          className={cn(inputCls, 'min-h-[72px] resize-y')}
          value={question.prompt}
          onChange={(e) => patchQuestion({ prompt: e.target.value })}
          placeholder="Type the question text here..."
        />
      </div>

      {/* Options */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={labelCls}>
            {question.type === 'ordering' ? 'Items (drag to set correct order)' : 'Answer Options'}
          </label>
          <span className="text-[10px] text-muted-foreground">
            {question.type === 'single' && 'Click to mark correct'}
            {question.type === 'multiple' && 'Check all correct answers'}
            {question.type === 'ordering' && 'Drag to define order'}
          </span>
        </div>

        <div className="space-y-2">
          {question.options.map((opt, idx) => {
            const isCorrect = question.correctIndices.includes(idx)
            const isDragging = dragIdx === idx
            const isDragOver = dragOverIdx === idx

            return (
              <div
                key={opt.id}
                draggable={question.type === 'ordering'}
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={handleDragEnd}
                className={cn(
                  'flex items-center gap-2.5 p-2.5 rounded-xl border transition-all',
                  isDragging ? 'opacity-40' : '',
                  isDragOver && question.type === 'ordering'
                    ? 'border-primary bg-primary/10 shadow-sm'
                    : isCorrect && question.type !== 'ordering'
                    ? 'border-emerald-300 bg-emerald-50'
                    : 'border-border bg-secondary/30',
                )}
              >
                {question.type === 'ordering' && (
                  <GripVertical className="w-4 h-4 text-muted-foreground/50 cursor-grab flex-shrink-0" />
                )}

                {/* Index badge */}
                <span
                  className={cn(
                    'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                    isCorrect && question.type !== 'ordering'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-secondary text-muted-foreground',
                  )}
                >
                  {String.fromCharCode(65 + idx)}
                </span>

                <input
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0"
                  value={opt.text}
                  onChange={(e) => updateOption(idx, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                />

                {question.type !== 'ordering' && (
                  <button
                    type="button"
                    onClick={() => toggleCorrect(idx)}
                    className={cn(
                      'flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-colors border',
                      isCorrect
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-border bg-background hover:border-emerald-300',
                    )}
                    aria-label="Mark as correct"
                  >
                    {isCorrect && <Check className="w-3 h-3" />}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => removeOption(idx)}
                  className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"
                  aria-label="Remove option"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )
          })}
        </div>

        <button
          type="button"
          onClick={addOption}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/60 hover:bg-secondary transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Add option
        </button>
      </div>

      {/* Points */}
      <div className="flex items-center gap-3">
        <label className={labelCls}>Points</label>
        <input
          type="number"
          min={0}
          className={cn(inputCls, 'w-24')}
          value={question.points}
          onChange={(e) => patchQuestion({ points: Number(e.target.value) })}
        />
        <span className="text-xs text-muted-foreground">pts per correct answer</span>
      </div>
    </div>
  )
}

const labelCls = 'text-xs font-semibold text-muted-foreground uppercase tracking-wide'
const inputCls =
  'w-full px-3 py-2 rounded-[10px] border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow'
