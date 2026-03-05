'use client'

import { useState } from 'react'
import { BookOpen, Video, HelpCircle, FileUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EditorStep } from '@/lib/course-editor-types'
import { getMeta } from './step-types'

const STEP_TYPES: Array<{
  type: EditorStep['type']
  label: string
  icon: React.ElementType
  desc: string
}> = [
  { type: 'info',  label: 'Text',  icon: BookOpen,  desc: 'Rich text / article content' },
  { type: 'video', label: 'Video', icon: Video,      desc: 'Embed or upload a video'    },
  { type: 'quiz',  label: 'Quiz',  icon: HelpCircle, desc: 'Multiple choice questions'  },
  { type: 'file',  label: 'File',  icon: FileUp,     desc: 'Downloadable resource'      },
]

interface AddStepModalProps {
  open: boolean
  onClose: () => void
  onCreate: (step: EditorStep) => void
}

export function AddStepModal({ open, onClose, onCreate }: AddStepModalProps) {
  const [title,  setTitle]  = useState('')
  const [type,   setType]   = useState<EditorStep['type']>('info')
  const [points, setPoints] = useState(0)

  if (!open) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onCreate({
      id: Date.now(),
      title: title.trim(),
      type,
      position: 0,
      points,
      isAnswered: false,
      userPoints: 0,
      data: {},
    })
    setTitle(''); setType('info'); setPoints(0); onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-[15px] font-bold text-foreground">Add Step</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">Choose a step type and give it a title.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 flex flex-col gap-5">
            {/* Type grid */}
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
                  <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center mb-0.5', getMeta(t).color)}>
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
                className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>
          </div>

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
