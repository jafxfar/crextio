'use client'

import { useState } from 'react'
import {
  BookOpen,
  Video,
  HelpCircle,
  FileUp,
  PlusCircle,
  GripVertical,
  Trash2,
  CheckCircle2,
  Circle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EditorChapter, EditorStep } from '@/lib/course-editor-types'

// ─── Step type meta ───────────────────────────────────────────────────────────

const stepMeta = {
  info: { label: 'Info', icon: BookOpen, color: 'bg-blue-500/15 text-blue-600' },
  video: { label: 'Video', icon: Video, color: 'bg-purple-500/15 text-purple-600' },
  question: { label: 'question', icon: HelpCircle, color: 'bg-amber-500/15 text-amber-600' },
  file: { label: 'File', icon: FileUp, color: 'bg-green-500/15 text-green-600' },
} as const

// ─── Step row ─────────────────────────────────────────────────────────────────

function StepRow({
  step,
  index,
  onDelete,
}: {
  step: EditorStep
  index: number
  onDelete: () => void
}) {
  const meta = stepMeta[step.type] ?? stepMeta.info
  const Icon = meta.icon

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-card rounded-2xl border border-border shadow-sm group hover:border-foreground/20 transition-all">
      {/* Drag handle */}
      <GripVertical className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground/60 shrink-0 cursor-grab" />

      {/* Position number */}
      <span className="w-5 text-center text-[11px] font-bold text-muted-foreground/50 shrink-0 tabular-nums">
        {index + 1}
      </span>

      {/* Type icon */}
      <div className={cn('w-7 h-7 rounded-xl flex items-center justify-center shrink-0', meta.color)}>
        <Icon className="w-3.5 h-3.5" />
      </div>

      {/* Title + type badge */}
      <div className="flex flex-col min-w-0 flex-1 gap-0.5">
        <span className="text-[13px] font-semibold text-foreground truncate leading-tight">
          {step.title}
        </span>
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide leading-none">
          {meta.label}
        </span>
      </div>

      {/* Points */}
      {step.points > 0 && (
        <span className="shrink-0 text-[11px] font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded-lg">
          {step.userPoints}/{step.points} pts
        </span>
      )}

      {/* Answered indicator */}
      {step.isAnswered ? (
        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
      ) : (
        <Circle className="w-4 h-4 text-muted-foreground/30 shrink-0" />
      )}

      {/* Delete */}
      <button
        type="button"
        onClick={onDelete}
        className="w-7 h-7 rounded-xl flex items-center justify-center text-muted-foreground/30 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 shrink-0"
        title="Delete step"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

// ─── Add step modal (inline, simple) ─────────────────────────────────────────

const STEP_TYPES: Array<{ type: EditorStep['type']; label: string; icon: React.ElementType; desc: string }> = [
  { type: 'info', label: 'Info', icon: BookOpen, desc: 'Rich text / article content' },
  { type: 'video', label: 'Video', icon: Video, desc: 'Embed or upload a video' },
  { type: 'question', label: 'question', icon: HelpCircle, desc: 'Multiple choice questions' },
  { type: 'file', label: 'File', icon: FileUp, desc: 'Downloadable resource' },
]

function AddStepModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean
  onClose: () => void
  onCreate: (step: EditorStep) => void
}) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<EditorStep['type']>('info')
  const [points, setPoints] = useState(0)

  if (!open) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    const step: EditorStep = {
      id: Date.now(),
      title: title.trim(),
      type,
      position: 0, // caller can set proper index
      points,
      isAnswered: false,
      userPoints: 0,
      data: {},
    }
    onCreate(step)
    setTitle('')
    setType('info')
    setPoints(0)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-[15px] font-bold text-foreground">Add Step</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">Choose a step type and give it a title.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 flex flex-col gap-5">
            {/* Type selector */}
            <div className="grid grid-cols-2 gap-2">
              {STEP_TYPES.map(({ type: t, label, icon: Icon, desc }) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={cn(
                    'flex flex-col gap-1 p-3 rounded-xl border-2 text-left transition-all',
                    type === t
                      ? 'border-foreground bg-foreground/5'
                      : 'border-border hover:border-foreground/30 hover:bg-accent/40',
                  )}
                >
                  <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center mb-0.5', stepMeta[t].color)}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[12px] font-bold text-foreground">{label}</span>
                  <span className="text-[10px] text-muted-foreground leading-snug">{desc}</span>
                </button>
              ))}
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-foreground">Title</label>
              <input
                autoFocus
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter step title…"
                className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>

            {/* Points */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-foreground">Points</label>
              <input
                type="number"
                min={0}
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-secondary/30">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2 rounded-xl bg-foreground text-background text-[13px] font-semibold hover:opacity-80 disabled:opacity-40 transition-all"
            >
              Add Step
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Steps panel (main area) ──────────────────────────────────────────────────

interface StepsPanelProps {
  chapter: EditorChapter
  moduleTitle: string
  moduleIndex: number
  onChange: (steps: EditorStep[]) => void
}

export function StepsPanel({ chapter, moduleTitle, moduleIndex, onChange }: StepsPanelProps) {
  const [addOpen, setAddOpen] = useState(false)

  function handleStepCreate(step: EditorStep) {
    const withPosition = { ...step, position: chapter.steps.length + 1 }
    onChange([...chapter.steps, withPosition])
  }

  function handleStepDelete(id: number) {
    onChange(chapter.steps.filter((s) => s.id !== id))
  }

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      {/* Chapter header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-foreground">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-semibold text-background/50 uppercase tracking-wider">
            {moduleIndex}. {moduleTitle}
          </span>
          <h2 className="text-[15px] font-bold text-background leading-tight">
            {chapter.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-background/15 hover:bg-background/25 text-background text-[12px] font-semibold transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Add Step
        </button>
      </div>

      {/* Steps list */}
      <div className="p-5 flex flex-col gap-3">
        {chapter.steps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-3">
              <HelpCircle className="w-6 h-6 text-muted-foreground/40" />
            </div>
            <p className="text-[13px] font-semibold text-foreground mb-1">No steps yet</p>
            <p className="text-[12px] text-muted-foreground mb-4">
              Add your first step to this chapter.
            </p>
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-foreground text-background rounded-xl text-[12px] font-semibold hover:opacity-80 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add First Step
            </button>
          </div>
        ) : (
          chapter.steps.map((step, idx) => (
            <StepRow
              key={step.id}
              step={step}
              index={idx}
              onDelete={() => handleStepDelete(step.id)}
            />
          ))
        )}
      </div>

      <AddStepModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreate={handleStepCreate}
      />
    </div>
  )
}
