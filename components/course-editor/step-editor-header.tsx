'use client'

import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EditorStep } from '@/lib/course-editor-types'

interface EditorHeaderProps {
  step: EditorStep
  onBack: () => void
  accentIcon: React.ElementType
  accentClass: string
}

export function EditorHeader({ step, onBack, accentIcon: Icon, accentClass }: EditorHeaderProps) {
  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5 bg-foreground">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-background/60 hover:text-background text-[12px] font-medium transition-colors shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Steps
        </button>

        <span className="text-background/30">/</span>

        <div className={cn('w-5 h-5 rounded-md flex items-center justify-center shrink-0', accentClass)}>
          <Icon className="w-3 h-3" />
        </div>

        <span className="text-[13px] font-bold text-background truncate flex-1">
          {step.title}
        </span>

        {step.points > 0 && (
          <span className="text-[11px] font-semibold text-background/50 bg-background/10 px-2.5 py-1 rounded-lg shrink-0">
            {step.points} pts
          </span>
        )}
      </div>
    </div>
  )
}
