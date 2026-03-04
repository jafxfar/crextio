'use client'

import { useState } from 'react'
import {
  Save,
  Eye,
  ArrowLeft,
  Layers,
  Settings2,
  AlertCircle,
  CheckCircle2,
  Clock,
  BookOpen,
  HelpCircle,
  Upload,
  Video,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import type { CourseSettings, EditorModule } from '@/lib/course-editor-types'
import { seedSettings, seedModules } from '@/lib/course-editor-data'
import { CourseSettingsPanel } from './course-settings-panel'
import { CourseOutlinePanel } from './course-outline-panel'

type TabId = 'outline' | 'settings'

export function CourseEditorPage() {
  const [settings, setSettings] = useState<CourseSettings>(seedSettings)
  const [modules, setModules] = useState<EditorModule[]>(seedModules)
  const [activeTab, setActiveTab] = useState<TabId>('outline')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  function patchSettings(partial: Partial<CourseSettings>) {
    setSettings((s) => ({ ...s, ...partial }))
    setSaved(false)
  }

  function handleSave() {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 800)
  }

  // Computed stats
  const totalModules = modules.length
  const totalChapters = modules.reduce((acc, m) => acc + m.chapters.length, 0)
  const totalSteps = modules.reduce(
    (acc, m) => acc + m.chapters.reduce((a2, c) => a2 + c.steps.length, 0),
    0,
  )
  const totalQuestions = modules.reduce(
    (acc, m) =>
      acc +
      m.chapters.reduce(
        (a2, c) => a2 + c.steps.filter((s) => s.type === 'question').length,
        0,
      ),
    0,
  )
  const videoCount = modules.reduce(
    (acc, m) =>
      acc + m.chapters.reduce((a2, c) => a2 + c.steps.filter((s) => s.type === 'video').length, 0),
    0,
  )
  const fileCount = modules.reduce(
    (acc, m) =>
      acc + m.chapters.reduce((a2, c) => a2 + c.steps.filter((s) => s.type === 'file').length, 0),
    0,
  )

  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'outline', label: 'Course Outline', icon: Layers },
    { id: 'settings', label: 'Settings', icon: Settings2 },
  ]

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Editor topbar */}
      <div className="flex-shrink-0 flex items-center justify-between gap-4 pb-5">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/courses"
            className="flex-shrink-0 w-8 h-8 rounded-[10px] bg-secondary hover:bg-accent border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Back to courses"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-[15px] font-bold text-foreground truncate leading-tight">
              {settings.title || 'Untitled Course'}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <StatusDot status={settings.status} />
              {settings.isCompliance && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-md">
                  <AlertCircle className="w-2.5 h-2.5" />
                  Compliance
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] border border-border bg-secondary text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-sm font-semibold transition-all shadow-sm',
              saved
                ? 'bg-emerald-500 text-white'
                : 'bg-nav-pill text-white hover:opacity-90',
              saving && 'opacity-70 cursor-not-allowed',
            )}
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Saved
              </>
            ) : saving ? (
              <>
                <Clock className="w-3.5 h-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                Save Course
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex-shrink-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-5">
        {[
          { icon: Layers, label: 'Modules', value: totalModules, color: 'text-foreground bg-primary/20' },
          { icon: BookOpen, label: 'Chapters', value: totalChapters, color: 'text-foreground bg-secondary' },
          { icon: FileText, label: 'Steps', value: totalSteps, color: 'text-foreground bg-secondary' },
          { icon: HelpCircle, label: 'Questions', value: totalQuestions, color: 'text-amber-700 bg-amber-50' },
          { icon: Video, label: 'Videos', value: videoCount, color: 'text-foreground bg-nav-pill/10' },
          { icon: Upload, label: 'File Steps', value: fileCount, color: 'text-emerald-700 bg-emerald-50' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="bg-card border border-border rounded-xl px-3 py-2.5 flex items-center gap-2.5 shadow-sm"
          >
            <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0', color)}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-base font-bold text-foreground leading-none">{value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 flex gap-1 bg-secondary/60 rounded-xl p-1 w-fit mb-5 border border-border">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-semibold transition-all',
              activeTab === id
                ? 'bg-nav-pill text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {activeTab === 'outline' && (
          <CourseOutlinePanel modules={modules} onChange={setModules} />
        )}
        {activeTab === 'settings' && (
          <CourseSettingsPanel settings={settings} onChange={patchSettings} />
        )}
      </div>
    </div>
  )
}

function StatusDot({ status }: { status: CourseSettings['status'] }) {
  const map = {
    active: { label: 'Active', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    draft: { label: 'Draft', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    archived: { label: 'Archived', cls: 'bg-slate-100 text-slate-500 border-slate-200' },
  }
  const { label, cls } = map[status]
  return (
    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-md border', cls)}>
      {label}
    </span>
  )
}
