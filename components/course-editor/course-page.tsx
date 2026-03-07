'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  BookOpen,
  Layers,
  Settings2,
  PlusCircle,
  ChevronDown,
  ChevronRight,
  Trash2,
  GraduationCap,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TopNav } from '@/components/shell/sidebar'
import type { EditorModule, EditorChapter } from '@/lib/course-editor-types'
import { CreateModuleModal } from './create-module-modal'
import { CreateChapterModal } from './create-chapter-modal'
import { StepsPanel } from './steps-panel'
import { getCourse } from '@/lib/courses-api'

interface CoursePageProps {
  courseId: string
  initialTitle: string
}

// ─── Selection state ──────────────────────────────────────────────────────────

interface Selection {
  moduleId: number
  chapterId: number
}

// ─── Sidebar: single module row with its chapters ─────────────────────────────

function SidebarModule({
  module,
  moduleIndex,
  selection,
  onSelect,
  onDelete,
  onChapterCreate,
}: {
  module: EditorModule
  moduleIndex: number
  selection: Selection | null
  onSelect: (s: Selection) => void
  onDelete: (id: number) => void
  onChapterCreate: (moduleId: number, chapter: EditorChapter) => void
}) {
  const [open, setOpen] = useState(true)
  const [chapterModalOpen, setChapterModalOpen] = useState(false)

  return (
    <div className="flex flex-col">
      {/* Module row */}
      <div className="flex items-center gap-1.5 group px-1">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 flex-1 min-w-0 px-2 py-2 rounded-xl hover:bg-accent/60 transition-colors text-left"
        >
          {open
            ? <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
            : <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
          }
          <div className="w-5 h-5 rounded-md bg-nav-pill flex items-center justify-center shrink-0">
            <Layers className="w-3 h-3 text-white" />
          </div>
          <span className="text-[12px] font-bold text-foreground truncate flex-1">
            {moduleIndex}.&nbsp;{module.title}
          </span>
        </button>

        {/* Add chapter + delete — shown on hover */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            type="button"
            onClick={() => setChapterModalOpen(true)}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
            title="Add chapter"
          >
            <PlusCircle className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(module.id)}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all"
            title="Delete module"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Chapter rows */}
      {open && (
        <div className="ml-6 flex flex-col gap-0.5 mt-0.5 mb-1">
          {module.chapters.map((chapter, idx) => {
            const isActive =
              selection?.moduleId === module.id && selection?.chapterId === chapter.id
            return (
              <button
                key={chapter.id}
                type="button"
                onClick={() => onSelect({ moduleId: module.id, chapterId: chapter.id })}
                className={cn(
                  'flex items-center gap-2 w-full px-2.5 py-1.5 rounded-xl text-left transition-all text-[12px]',
                  isActive
                    ? 'bg-nav-pill text-white font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/60 font-medium',
                )}
              >
                <span className={cn(
                  'shrink-0 tabular-nums text-[10px] w-7',
                  isActive ? 'text-white/60' : 'text-muted-foreground/60',
                )}>
                  {moduleIndex}.{idx + 1}
                </span>
                <span className="truncate flex-1 leading-snug">{chapter.title}</span>
                {chapter.steps.length > 0 && (
                  <span className={cn(
                    'text-[10px] shrink-0',
                    isActive ? 'text-white/50' : 'text-muted-foreground/50',
                  )}>
                    {chapter.steps.length}
                  </span>
                )}
              </button>
            )
          })}

          {/* Add chapter button */}
          <button
            type="button"
            onClick={() => setChapterModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-medium text-muted-foreground/50 hover:text-muted-foreground hover:bg-accent/40 transition-colors"
          >
            <PlusCircle className="w-3 h-3" />
            Добавить главу
          </button>
        </div>
      )}

      <CreateChapterModal
        open={chapterModalOpen}
        moduleTitle={module.title}
        position={module.chapters.length + 1}
        onClose={() => setChapterModalOpen(false)}
        onCreate={(chapter) => {
          onChapterCreate(module.id, chapter)
          onSelect({ moduleId: module.id, chapterId: chapter.id })
        }}
      />
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function CoursePage({ courseId, initialTitle }: CoursePageProps) {
  const [title, setTitle] = useState(initialTitle)
  const [activeSection, setActiveSection] = useState<'modules' | 'settings'>('modules')
  const [modules, setModules] = useState<EditorModule[]>([])
  const [selection, setSelection] = useState<Selection | null>(null)
  const [moduleModalOpen, setModuleModalOpen] = useState(false)
  const [quickChapterModuleId, setQuickChapterModuleId] = useState<number | null>(null)

  // ── Load course title from API ──────────────────────────────────────────
  useEffect(() => {
    getCourse(Number(courseId))
      .then((course) => {
        if (course?.title) setTitle(course.title)
      })
      .catch(() => {/* keep initialTitle */})
  }, [courseId])

  function handleModuleCreate(m: EditorModule) {
    setModules((prev) => [...prev, m])
  }

  function handleModuleDelete(id: number) {
    setModules((prev) => {
      const next = prev.filter((m) => m.id !== id)
      // clear selection if it belonged to deleted module
      if (selection?.moduleId === id) setSelection(null)
      return next
    })
  }

  function handleChapterCreate(moduleId: number, chapter: EditorChapter) {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId ? { ...m, chapters: [...m.chapters, chapter] } : m,
      ),
    )
  }

  function handleStepsChange(moduleId: number, chapterId: number, steps: EditorChapter['steps']) {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              chapters: m.chapters.map((c) =>
                c.id === chapterId ? { ...c, steps } : c,
              ),
            }
          : m,
      ),
    )
  }

  function handleChapterChange(moduleId: number, updated: EditorChapter) {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? { ...m, chapters: m.chapters.map((c) => (c.id === updated.id ? updated : c)) }
          : m,
      ),
    )
  }

  // Resolve currently selected chapter
  const selectedModule = modules.find((m) => m.id === selection?.moduleId) ?? null
  const selectedChapter =
    selectedModule?.chapters.find((c) => c.id === selection?.chapterId) ?? null

  return (
    <div className="min-h-screen w-full" style={{ background: 'linear-gradient(150deg, #e3e4e6 30%, #daf064 100%)' }}>
      <TopNav />

      <div className="flex max-w-350 mx-auto px-6 py-8 gap-6 items-start">

        {/* ══════════════ SIDEBAR ══════════════ */}
        <aside className="w-64 shrink-0 flex flex-col gap-3 sticky top-24">

          {/* Course name card */}
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <Link
              href="/courses"
              className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground font-medium transition-colors mb-3"
            >
              <ArrowLeft className="w-3 h-3" />
              All Courses
            </Link>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                <BookOpen className="w-4 h-4 text-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                  Course
                </p>
                <h2 className="text-[13px] font-bold text-foreground leading-snug line-clamp-3">
                  {title}
                </h2>
              </div>
            </div>
          </div>

          {/* Modules tree */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            {/* Tree header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Structure
              </span>
              <button
                type="button"
                onClick={() => setModuleModalOpen(true)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-nav-pill text-white text-[10px] font-semibold hover:opacity-90 transition-opacity"
              >
                <PlusCircle className="w-3 h-3" />
                Модуль
              </button>
            </div>

            {/* Tree body */}
            <div className="px-2 py-2 flex flex-col gap-1 max-h-[55vh] overflow-y-auto">
              {modules.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <GraduationCap className="w-7 h-7 text-muted-foreground/30 mb-2" />
                  <p className="text-[11px] text-muted-foreground">Модулей пока нет</p>
                  <button
                    type="button"
                    onClick={() => setModuleModalOpen(true)}
                    className="mt-2 text-[11px] text-foreground font-semibold hover:underline"
                  >
                    Добавить первый модуль
                  </button>
                </div>
              ) : (
                modules.map((module, idx) => (
                  <SidebarModule
                    key={module.id}
                    module={module}
                    moduleIndex={module.position}
                    selection={selection}
                    onSelect={setSelection}
                    onDelete={handleModuleDelete}
                    onChapterCreate={handleChapterCreate}
                  />
                ))
              )}
            </div>
          </div>

          {/* Nav */}
          <nav className="bg-card border border-border rounded-2xl p-2 shadow-sm flex flex-col gap-1">
            {([
              { id: 'modules', label: 'Модули', icon: Layers },
              { id: 'settings', label: 'Настройки', icon: Settings2 },
            ] as const).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveSection(id)}
                className={cn(
                  'flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all text-left',
                  activeSection === id
                    ? 'bg-nav-pill text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* ══════════════ MAIN AREA ══════════════ */}
        <main className="flex-1 min-w-0">
          {activeSection === 'settings' ? (
            <SettingsPlaceholder />
          ) : selectedChapter && selectedModule ? (
            <StepsPanel
              chapter={selectedChapter}
              moduleTitle={selectedModule.title}
              moduleIndex={selectedModule.position}
              onChange={(steps: EditorChapter['steps']) =>
                handleStepsChange(selectedModule.id, selectedChapter.id, steps)
              }
              onChapterChange={(updated) =>
                handleChapterChange(selectedModule.id, updated)
              }
            />
          ) : (
            /* No chapter selected */
            <div className="bg-card border border-dashed border-border rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 text-foreground/40" />
              </div>
              <h3 className="text-[15px] font-bold text-foreground mb-1.5">
                {modules.length === 0 ? 'Модулей пока нет' : 'Выберите главу'}
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                {modules.length === 0
                  ? 'Добавьте свой первый модуль, используя боковую панель, чтобы начать создание курса.Add your first module using the sidebar to start building the course.'
                  : 'Щелкните по главе на боковой панели, чтобы просмотреть и отредактировать ее этапы.'}
              </p>
              {modules.length === 0 && (
                <button
                  type="button"
                  onClick={() => setModuleModalOpen(true)}
                  className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-nav-pill text-white rounded-xl text-[13px] font-semibold hover:opacity-90 transition-all shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  Добавить Первый модуль
                </button>
              )}
              {modules.length > 0 && (
                <div className="mt-5 flex flex-col items-center gap-2">
                  <p className="text-[11px] text-muted-foreground font-medium">Или создайте главу в модуле:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {modules.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setQuickChapterModuleId(m.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-secondary hover:bg-accent hover:border-primary/40 text-[12px] font-medium text-foreground transition-all"
                      >
                        <PlusCircle className="w-3.5 h-3.5 text-[#ddff00]" />
                        {m.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Module creation modal */}
      <CreateModuleModal
        open={moduleModalOpen}
        position={modules.length + 1}
        onClose={() => setModuleModalOpen(false)}
        onCreate={handleModuleCreate}
      />

      {/* Quick chapter creation from empty-state */}
      {quickChapterModuleId !== null && (() => {
        const targetModule = modules.find((m) => m.id === quickChapterModuleId)
        if (!targetModule) return null
        return (
          <CreateChapterModal
            open
            moduleTitle={targetModule.title}
            position={targetModule.chapters.length + 1}
            onClose={() => setQuickChapterModuleId(null)}
            onCreate={(chapter) => {
              handleChapterCreate(quickChapterModuleId, chapter)
              setSelection({ moduleId: quickChapterModuleId, chapterId: chapter.id })
              setQuickChapterModuleId(null)
            }}
          />
        )
      })()}
    </div>
  )
}

// ─── Settings placeholder ─────────────────────────────────────────────────────

function SettingsPlaceholder() {
  return (
    <div className="bg-card border border-border rounded-2xl p-10 flex flex-col items-center justify-center text-center shadow-sm">
      <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-4">
        <Settings2 className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="text-[15px] font-bold text-foreground mb-1.5">Course Settings</h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        Passing score, certification, due dates and more — coming soon.
      </p>
    </div>
  )
}
