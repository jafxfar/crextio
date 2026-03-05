'use client'

import { GripVertical, Trash2, CheckCircle2, Circle, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EditorStep } from '@/lib/course-editor-types'
import { getMeta } from './step-types'

export function StepRow({ step, index, onOpen, onDelete }: {
  step: EditorStep
  index: number
  onOpen: () => void
  onDelete: () => void
}) {
  const meta = getMeta(step.type)
  const Icon = meta.icon

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 bg-card rounded-2xl border border-border shadow-sm group hover:border-foreground/20 transition-all cursor-pointer"
      onClick={onOpen}
    >
      <GripVertical
        className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground/60 shrink-0 cursor-grab"
        onClick={(e) => e.stopPropagation()}
      />

      <span className="w-5 text-center text-[11px] font-bold text-muted-foreground/50 shrink-0 tabular-nums">
        {index + 1}
      </span>

      <div className={cn('w-7 h-7 rounded-xl flex items-center justify-center shrink-0', meta.color)}>
        <Icon className="w-3.5 h-3.5" />
      </div>

      <div className="flex flex-col min-w-0 flex-1 gap-0.5">
        <span className="text-[13px] font-semibold text-foreground truncate leading-tight">
          {step.title}
        </span>
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide leading-none">
          {meta.label}
        </span>
      </div>

      {step.points > 0 && (
        <span className="shrink-0 text-[11px] font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded-lg">
          {step.userPoints}/{step.points} pts
        </span>
      )}

      {step.isAnswered
        ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
        : <Circle className="w-4 h-4 text-muted-foreground/30 shrink-0" />
      }

      <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground shrink-0 transition-colors" />

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onDelete() }}
        className="w-7 h-7 rounded-xl flex items-center justify-center text-muted-foreground/30 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 shrink-0"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
