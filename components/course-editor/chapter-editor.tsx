'use client'

import { useState } from 'react'
import { BookOpen, ChevronDown, ChevronRight, Plus, Trash2, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EditorChapter, EditorStep, StepType } from '@/lib/course-editor-types'
import { StepEditor } from './step-editor'

interface ChapterEditorProps {
  chapter: EditorChapter
  onChange: (updated: EditorChapter) => void
  onDelete: () => void
}

function newStep(order: number): EditorStep {
  return {
    id: Number(`step-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`),
    title: 'New Step',
    type: 'info',
    position: order,
    points: 0,
    isAnswered: false,
    userPoints: 0,
    data: {
      content: '',
    },
  }
}

export function ChapterEditor({ chapter, onChange, onDelete }: ChapterEditorProps) {
  const [open, setOpen] = useState(true)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)

  function patchChapter(partial: Partial<EditorChapter>) {
    onChange({ ...chapter, ...partial })
  }

  function addStep(type: StepType = 'info') {
    const step = newStep(chapter.steps.length + 1)
    step.type = type
    if (type === 'question') {
      step.title = 'New Question'
      step.data.questions = {
        id: `q-${Date.now()}`,
        type: 'single',
        prompt: '',
        options: [
          { id: `o-${Date.now()}-1`, text: '' },
          { id: `o-${Date.now()}-2`, text: '' },
        ],
        correctIndices: [],
        points: 10,
      }
    }
    patchChapter({ steps: [...chapter.steps, step] })
  }

  function updateStep(idx: number, updated: EditorStep) {
    const steps = chapter.steps.map((s, i) => (i === idx ? updated : s))
    patchChapter({ steps })
  }

  function deleteStep(idx: number) {
    patchChapter({ steps: chapter.steps.filter((_, i) => i !== idx) })
  }

  // DnD for steps
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
    const steps = [...chapter.steps]
    const [moved] = steps.splice(dragIdx, 1)
    steps.splice(idx, 0, moved)
    patchChapter({ steps: steps.map((s, i) => ({ ...s, order: i + 1 })) })
    setDragIdx(null)
    setDragOverIdx(null)
  }
  function handleDragEnd() {
    setDragIdx(null)
    setDragOverIdx(null)
  }

  const stepCount = chapter.steps.length
  const questionCount = chapter.steps.filter((s) => s.type === 'question').length

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      {/* Chapter header */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none hover:bg-secondary/40 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <GripVertical className="w-4 h-4 text-muted-foreground/30 cursor-grab flex-shrink-0" onClick={(e) => e.stopPropagation()} />
        <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-3.5 h-3.5 text-foreground" />
        </div>
        <input
          className="flex-1 text-sm font-semibold bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0"
          value={chapter.title}
          onChange={(e) => {
            e.stopPropagation()
            patchChapter({ title: e.target.value })
          }}
          onClick={(e) => e.stopPropagation()}
          placeholder="Chapter title..."
        />
        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
          <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            {stepCount} step{stepCount !== 1 ? 's' : ''}
          </span>
          {questionCount > 0 && (
            <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
              {questionCount} Q
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="w-6 h-6 rounded-lg hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-muted-foreground/50 transition-colors"
            aria-label="Delete chapter"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {open ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-border bg-secondary/10">
          {chapter.steps.length === 0 && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No steps yet. Add your first step below.
            </div>
          )}

          {chapter.steps.map((step, idx) => (
            <div
              key={step.id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              className={cn(
                'transition-all duration-150 mt-3',
                dragIdx === idx ? 'opacity-40 scale-[0.99]' : '',
                dragOverIdx === idx && dragIdx !== idx ? 'ring-2 ring-primary/40 rounded-xl' : '',
              )}
            >
              <StepEditor
                step={step}
                onChange={(updated) => updateStep(idx, updated)}
                onDelete={() => deleteStep(idx)}
              />
            </div>
          ))}

          {/* Add step buttons */}
          <div className="pt-1 flex flex-wrap gap-2">
            {(['info', 'video', 'question', 'file'] as StepType[]).map((type) => {
              const labels: Record<StepType, string> = { info: '+ Info', video: '+ Video', question: '+ Question', file: '+ File' }
              const colors: Record<StepType, string> = {
                info: 'text-foreground border-border hover:bg-secondary',
                video: 'text-foreground border-border hover:bg-secondary',
                question: 'text-amber-700 border-amber-200 hover:bg-amber-50',
                file: 'text-emerald-700 border-emerald-200 hover:bg-emerald-50',
              }
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => addStep(type)}
                  className={cn(
                    'px-3 py-1.5 rounded-[10px] border text-xs font-semibold transition-colors',
                    colors[type],
                  )}
                >
                  {labels[type]}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
