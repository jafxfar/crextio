'use client'

import { useState } from 'react'
import {
  PlusCircle,
  GraduationCap,
  Layers,
  Trash2,
  FileText,
  Video,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Grip,
  BookOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EditorModule, EditorChapter, EditorStep } from '@/lib/course-editor-types'
import { CreateModuleModal } from './create-module-modal'
import { CreateChapterModal } from './create-chapter-modal'

// ─── Step type meta ───────────────────────────────────────────────────────────

const stepMeta: Record<string, { icon: React.ElementType; label: string; color: string; bg: string }> = {
  info: { icon: FileText, label: 'Info', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  video: { icon: Video, label: 'Video', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
  question: { icon: HelpCircle, label: 'question', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  file: { icon: FileText, label: 'File', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
}

// ─── Step row ─────────────────────────────────────────────────────────────────

function StepRow({ step }: { step: EditorStep }) {
  const meta = stepMeta[step.type] ?? stepMeta.info
  const Icon = meta.icon
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors cursor-pointer group">
      <Grip className="w-3.5 h-3.5 text-muted-foreground/30 shrink-0 cursor-grab" />
      <div className={cn('w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border', meta.bg)}>
        <Icon className={cn('w-3 h-3', meta.color)} />
      </div>
      <span className="text-[12px] font-medium text-foreground flex-1 truncate">{step.title}</span>
      <div className="flex items-center gap-1.5 shrink-0">
        {step.points > 0 && (
          <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md">
            {step.points} pts
          </span>
        )}
        <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize', meta.bg, meta.color)}>
          {meta.label}
        </span>
      </div>
    </div>
  )
}

// ─── Chapter row (dark header + expandable steps) ─────────────────────────────

function ChapterRow({
  chapter,
  moduleIndex,
  chapterIndex,
  onAddStep,
}: {
  chapter: EditorChapter
  moduleIndex: number
  chapterIndex: number
  onAddStep: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="overflow-hidden rounded-xl border border-white/8">
      {/* Chapter header — same style as module but slightly lighter */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'w-full flex items-center gap-2.5 px-4 py-3 text-left transition-colors',
          open ? 'bg-white/12' : 'bg-white/7 hover:bg-white/10',
        )}
      >
        {/* Chevron */}
        {open
          ? <ChevronDown className="w-3.5 h-3.5 text-white/50 shrink-0" />
          : <ChevronRight className="w-3.5 h-3.5 text-white/30 shrink-0" />
        }

        {/* Number badge */}
        <span className="shrink-0 text-[11px] font-bold text-white/40 tabular-nums w-7">
          {moduleIndex}.{chapterIndex}
        </span>

        {/* Title */}
        <span className="text-[12px] font-semibold text-white/80 flex-1 truncate leading-snug">
          {chapter.title}
        </span>

        {/* Meta pills */}
        <div className="flex items-center gap-2 shrink-0">
          {chapter.steps.length > 0 && (
            <span className="text-[10px] text-white/40 font-medium">
              {chapter.steps.length} step{chapter.steps.length !== 1 ? 's' : ''}
            </span>
          )}
          {chapter?.maxPoints > 0 && (
            <span className="text-[10px] font-semibold text-amber-300 bg-amber-900/40 border border-amber-700/40 px-1.5 py-0.5 rounded-md">
              {chapter.maxPoints} pts
            </span>
          )}
        </div>
      </button>

      {/* Steps area */}
      {open && (
        <div className="bg-card border-t border-white/8 px-4 py-3 flex flex-col gap-2">
          {chapter.steps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center rounded-xl border border-dashed border-border">
              <FileText className="w-6 h-6 text-muted-foreground/30 mb-2" />
              <p className="text-[12px] font-semibold text-foreground mb-1">Шагов пока нет</p>
              <p className="text-[11px] text-muted-foreground mb-2.5 max-w-[220px]">
                Добавьте информацию, видео, вопрос или пошаговый файл, чтобы заполнить эту главу.              </p>
              <button
                type="button"
                onClick={onAddStep}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-nav-pill text-white rounded-lg text-[11px] font-semibold hover:opacity-90 transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Add First Step
              </button>
            </div>
          ) : (
            <>
              {chapter.steps.map((step) => (
                <StepRow key={step.id} step={step} />
              ))}
            </>
          )}

          {/* Добавить шаг button */}
          {chapter.steps.length > 0 && (
            <button
              type="button"
              onClick={onAddStep}
              className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors mt-0.5 px-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Добавить шаг
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Module card ──────────────────────────────────────────────────────────────

function ModuleCard({
  module,
  moduleIndex,
  onDelete,
  onChapterCreate,
}: {
  module: EditorModule
  moduleIndex: number
  onDelete: (id: number) => void
  onChapterCreate: (moduleId: number, chapter: EditorChapter) => void
}) {
  const [open, setOpen] = useState(true)
  const [chapterModalOpen, setChapterModalOpen] = useState(false)

  return (
    <div
      className="rounded-2xl shadow-sm overflow-hidden border border-white/10"
      style={{ background: 'hsl(var(--foreground))' }}
    >
      {/* ── Module header ── */}
      <div className="flex items-center gap-3 px-5 py-3.5">
        <Grip className="w-4 h-4 text-white/20 shrink-0 cursor-grab" />

        {/* Collapse toggle */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2.5 flex-1 min-w-0 text-left"
        >
          {open
            ? <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />
            : <ChevronRight className="w-4 h-4 text-white/40 shrink-0" />
          }
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <Layers className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-[13px] font-bold text-white truncate">
            {moduleIndex}&nbsp;&nbsp;{module.title}
          </span>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-white/30 font-medium">
            {module.chapters.length} ch
          </span>
          <button
            type="button"
            onClick={() => setChapterModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/15"
          >
            <PlusCircle className="w-3 h-3" />
            Chapter
          </button>
          <button
            type="button"
            onClick={() => onDelete(module.id)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-white/10 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Chapter list (vertical, below header) ── */}
      {open && (
        <div className="px-3 pb-3 flex flex-col gap-1.5">
          {module.chapters.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-8 text-center rounded-xl border border-dashed border-white/10"
            >
              <BookOpen className="w-6 h-6 text-white/20 mb-2" />
              <p className="text-[12px] font-semibold text-white/50 mb-1">No chapters yet</p>
              <p className="text-[11px] text-white/30 mb-3">
                Add chapters to organise this module.
              </p>
              <button
                type="button"
                onClick={() => setChapterModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-semibold transition-colors border border-white/15"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Добавить главу
              </button>
            </div>
          ) : (
            <>
              {module.chapters.map((chapter, idx) => (
                <ChapterRow
                  key={chapter.id}
                  chapter={chapter}
                  moduleIndex={moduleIndex}
                  chapterIndex={idx + 1}
                  onAddStep={() => {/* step modal later */ }}
                />
              ))}

              {/* Add chapter row */}
              <button
                type="button"
                onClick={() => setChapterModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors text-[11px] font-medium border border-dashed border-white/10 mt-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Добавить главу
              </button>
            </>
          )}
        </div>
      )}

      {/* Chapter modal */}
      <CreateChapterModal
        open={chapterModalOpen}
        moduleTitle={module.title}
        position={module.chapters.length + 1}
        onClose={() => setChapterModalOpen(false)}
        onCreate={(chapter) => onChapterCreate(module.id, chapter)}
      />
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

interface ModulesSectionProps {
  courseTitle: string
  modules: EditorModule[]
  onChange: (modules: EditorModule[]) => void
}

export function ModulesSection({ courseTitle, modules, onChange }: ModulesSectionProps) {
  const [moduleModalOpen, setModuleModalOpen] = useState(false)

  function handleModuleCreate(newModule: EditorModule) {
    onChange([...modules, newModule])
  }

  function handleModuleDelete(id: number) {
    onChange(modules.filter((m) => m.id !== id))
  }

  function handleChapterCreate(moduleId: number, chapter: EditorChapter) {
    onChange(
      modules.map((m) =>
        m.id === moduleId
          ? { ...m, chapters: [...m.chapters, chapter] }
          : m,
      ),
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Modules</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Course structure for{' '}
            <span className="font-medium text-foreground">{courseTitle}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModuleModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-nav-pill text-white rounded-xl text-[13px] font-semibold hover:opacity-90 transition-all shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Add Module
        </button>
      </div>

      {/* Module list */}
      {modules.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <GraduationCap className="w-7 h-7 text-foreground/60" />
          </div>
          <h3 className="text-[15px] font-bold text-foreground mb-1.5">Модулей пока нет</h3>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            Добавьте свой первый модуль, чтобы начать создание курса.
          </p>
          <button
            type="button"
            onClick={() => setModuleModalOpen(true)}
            className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-nav-pill text-white rounded-xl text-[13px] font-semibold hover:opacity-90 transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Добавить Первый модуль
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              moduleIndex={module.position}
              onDelete={handleModuleDelete}
              onChapterCreate={handleChapterCreate}
            />
          ))}
        </div>
      )}

      {/* Module modal */}
      <CreateModuleModal
        open={moduleModalOpen}
        position={modules.length + 1}
        onClose={() => setModuleModalOpen(false)}
        onCreate={handleModuleCreate}
      />
    </div>
  )
}
