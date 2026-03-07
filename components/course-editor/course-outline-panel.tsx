'use client'

import { useState } from 'react'
import { Plus, Layers } from 'lucide-react'
import type { EditorModule } from '@/lib/course-editor-types'
import { ModuleEditor } from './module-editor'

interface CourseOutlinePanelProps {
  modules: EditorModule[]
  onChange: (modules: EditorModule[]) => void
}

function newModule(order: number): EditorModule {
  return {
    id: 1 + Math.floor(Math.random() * 100000),
    title: 'New Module',
    position: order,
    chapters: [],
  }
}

export function CourseOutlinePanel({ modules, onChange }: CourseOutlinePanelProps) {
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)

  function addModule() {
    onChange([...modules, newModule(modules.length + 1)])
  }

  function updateModule(idx: number, updated: EditorModule) {
    onChange(modules.map((m, i) => (i === idx ? updated : m)))
  }

  function deleteModule(idx: number) {
    onChange(modules.filter((_, i) => i !== idx))
  }

  // DnD handlers
  function handleDragStart(idx: number) {
    setDragIdx(idx)
  }
  function handleDragEnd() {
    setDragIdx(null)
    setDragOverIdx(null)
  }
  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault()
    setDragOverIdx(idx)
  }
  function handleDrop(e: React.DragEvent, idx: number) {
    e.preventDefault()
    if (dragIdx === null || dragIdx === idx) return
    const mods = [...modules]
    const [moved] = mods.splice(dragIdx, 1)
    mods.splice(idx, 0, moved)
    onChange(mods.map((m, i) => ({ ...m, order: i + 1 })))
    setDragIdx(null)
    setDragOverIdx(null)
  }

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-foreground" />
          <h2 className="text-sm font-semibold text-foreground">
            Course Outline
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {modules.length} module{modules.length !== 1 ? 's' : ''}
            </span>
          </h2>
        </div>
        <span className="text-[10px] text-muted-foreground bg-secondary border border-border px-2 py-1 rounded-lg">
          Drag modules to reorder
        </span>
      </div>

      {modules.length === 0 && (
        <div className="py-16 flex flex-col items-center justify-center gap-3 text-center border border-dashed border-border rounded-2xl bg-secondary/20">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
            <Layers className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Модулей пока нет</p>
            <p className="text-xs text-muted-foreground mt-1">Добавьте свой первый модуль, чтобы начать создание курса</p>
          </div>
          <button
            type="button"
            onClick={addModule}
            className="mt-1 flex items-center gap-2 px-4 py-2 rounded-[10px] bg-nav-pill text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Module
          </button>
        </div>
      )}

      {/* Module list */}
      <div className="space-y-3">
        {modules.map((mod, idx) => (
          <ModuleEditor
            key={mod.id}
            module={mod}
            index={idx}
            onChange={(updated) => updateModule(idx, updated)}
            onDelete={() => deleteModule(idx)}
            dragHandleProps={{
              draggable: true,
              onDragStart: () => handleDragStart(idx),
              onDragEnd: handleDragEnd,
            }}
            isDragging={dragIdx === idx}
            isDragOver={dragOverIdx === idx && dragIdx !== idx}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDrop={(e) => handleDrop(e, idx)}
          />
        ))}
      </div>

      {modules.length > 0 && (
        <button
          type="button"
          onClick={addModule}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary/60 hover:bg-secondary transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Module
        </button>
      )}
    </div>
  )
}
