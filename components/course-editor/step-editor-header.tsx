'use client'

import { ArrowLeft, Check } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { EditorStep } from '@/lib/course-editor-types'
import { useSave } from '@/hooks/use-save'

interface EditorHeaderProps {
  step: EditorStep
  onBack: () => void
  accentIcon: React.ElementType
  accentClass: string
  onSave?: () => void
}

export function EditorHeader({ step, onBack, accentIcon: Icon, accentClass, onSave }: EditorHeaderProps) {
  const { saveState, triggerSave } = useSave()
  const isSaving = saveState === 'saving'
  const isSaved  = saveState === 'saved'

  function handleSave() {
    onSave?.()
    triggerSave()
  }

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5 bg-nav-pill">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-white/60 hover:text-white text-[12px] font-medium transition-colors shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Steps
        </button>

        <span className="text-white/30">/</span>

        <div className={cn('w-5 h-5 rounded-md flex items-center justify-center shrink-0', accentClass)}>
          <Icon className="w-3 h-3" />
        </div>

        <span className="text-[13px] font-bold text-white truncate flex-1">
          {step.title}
        </span>

        {step.points > 0 && (
          <span className="text-[11px] font-semibold text-white/50 bg-white/10 px-2.5 py-1 rounded-lg shrink-0">
            {step.points} pts
          </span>
        )}

        {/* ── Save button ── */}
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          aria-label="Save step"
          className={cn(
            'flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[12px] font-semibold transition-all shrink-0 select-none',
            isSaved
              ? 'bg-green-500/20 text-green-400'
              : 'bg-white/15 hover:bg-white/25 text-white disabled:opacity-60',
          )}
        >
          {isSaving ? (
            <>
              <Image
                src="/logo.svg"
                alt="Saving…"
                width={14}
                height={14}
                className="animate-save-logo"
                key={String(isSaving)}
              />
              Saving…
            </>
          ) : isSaved ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Saved
            </>
          ) : (
            'Save'
          )}
        </button>
      </div>
    </div>
  )
}
