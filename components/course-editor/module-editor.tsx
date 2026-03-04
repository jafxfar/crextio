'use client'

import { useState } from 'react'
import { Layers, ChevronDown, ChevronRight, Plus, Trash2, GripVertical, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EditorModule, EditorChapter } from '@/lib/course-editor-types'
import { ChapterEditor } from './chapter-editor'

interface ModuleEditorProps {
  module: EditorModule
  index: number
  onChange: (updated: EditorModule) => void
  onDelete: () => void
  dragHandleProps: {
    draggable: boolean
    onDragStart: () => void
    onDragEnd: () => void
  }
  isDragging: boolean
  isDragOver: boolean
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
}

function newChapter(position: number): EditorChapter {
  return {
    id: Number(`ch-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`),
    title: 'New Chapter',
    position,
    maxPoints: 0,
    steps: [],
  }
}

export function ModuleEditor({
  module,
  index,
  onChange,
  onDelete,
  dragHandleProps,
  isDragging,
  isDragOver,
  onDragOver,
  onDrop,
}: ModuleEditorProps) {
  const [open, setOpen] = useState(true)

  function patch(partial: Partial<EditorModule>) {
    onChange({ ...module, ...partial })
  }

  function addChapter() {
    patch({ chapters: [...module?.chapters, newChapter(module?.chapters.length + 1)] })
  }

  function updateChapter(idx: number, updated: EditorChapter) {
    patch({ chapters: module.chapters.map((c, i) => (i === idx ? updated : c)) })
  }

  function deleteChapter(idx: number) {
    patch({ chapters: module.chapters.filter((_, i) => i !== idx) })
  }

  const totalSteps = module.chapters.reduce((acc, ch) => acc + ch.steps.length, 0)
  const totalQuestions = module.chapters.reduce(
    (acc, ch) => acc + ch.steps.filter((s) => s.type === 'question').length,
    0,
  )

  return (
    <div
      className={cn(
        'rounded-2xl border bg-card shadow-sm overflow-hidden transition-all duration-150',
        isDragging ? 'opacity-40 scale-[0.98]' : '',
        isDragOver ? 'ring-2 ring-primary/50 border-primary/50' : 'border-border',
      )}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Module header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-secondary/40">
        {/* Drag handle */}
        <div
          {...dragHandleProps}
          className="flex-shrink-0 cursor-grab active:cursor-grabbing p-1 -ml-1 rounded hover:bg-secondary transition-colors"
          title="Drag to reorder module"
        >
          <GripVertical className="w-5 h-5 text-muted-foreground/40" />
        </div>

        {/* Module number badge */}
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-nav-pill flex items-center justify-center shadow-sm">
          <span className="text-xs font-bold text-white">{index + 1}</span>
        </div>

        <div className="flex-1 min-w-0">
          <input
            className="w-full text-[15px] font-semibold bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            value={module.title}
            onChange={(e) => patch({ title: e.target.value })}
            placeholder="Module title..."
          />
          {/* <input
            className="w-full text-xs bg-transparent outline-none text-muted-foreground placeholder:text-muted-foreground/60 mt-0.5"
            value={module.description}
            onChange={(e) => patch({ description: e.target.value })}
            placeholder="Module description (optional)..."
          /> */}
        </div>

        {/* Stats */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground bg-secondary rounded-full px-2.5 py-1">
            <BookOpen className="w-3 h-3" />
            {module.chapters.length} ch
          </span>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground bg-secondary rounded-full px-2.5 py-1">
            {totalSteps} steps
          </span>
          {totalQuestions > 0 && (
            <span className="text-[11px] text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-2.5 py-1">
              {totalQuestions} Q
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={onDelete}
            className="w-7 h-7 rounded-lg hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-muted-foreground/50 transition-colors"
            aria-label="Delete module"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="w-7 h-7 rounded-lg bg-secondary hover:bg-accent flex items-center justify-center text-muted-foreground transition-colors"
            aria-label={open ? 'Collapse module' : 'Expand module'}
          >
            {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="p-5 space-y-3">
          {module.chapters.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground border border-dashed border-border rounded-xl bg-secondary/20">
              No chapters yet — add one below.
            </div>
          )}

          {module.chapters.map((chapter, idx) => (
            <ChapterEditor
              key={chapter.id}
              chapter={chapter}
              onChange={(updated) => updateChapter(idx, updated)}
              onDelete={() => deleteChapter(idx)}
            />
          ))}

          <button
            type="button"
            onClick={addChapter}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/60 hover:bg-secondary transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Chapter
          </button>
        </div>
      )}
    </div>
  )
}
