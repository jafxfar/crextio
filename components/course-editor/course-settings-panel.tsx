'use client'

import { useState } from 'react'
import {
  Settings2,
  ShieldCheck,
  CalendarDays,
  Award,
  Hash,
  RotateCcw,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CourseSettings } from '@/lib/course-editor-types'
import { departments } from '@/lib/data'

interface CourseSettingsPanelProps {
  settings: CourseSettings
  onChange: (updated: Partial<CourseSettings>) => void
}

const statusOptions: { value: CourseSettings['status']; label: string; color: string }[] = [
  { value: 'active', label: 'Active', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { value: 'draft', label: 'Draft', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { value: 'archived', label: 'Archived', color: 'text-slate-500 bg-slate-100 border-slate-200' },
]

export function CourseSettingsPanel({ settings, onChange }: CourseSettingsPanelProps) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)

  const currentStatus = statusOptions.find((s) => s.value === settings.status)!

  function toggleDepartment(id: string) {
    const next = settings.departmentIds.includes(id)
      ? settings.departmentIds.filter((d) => d !== id)
      : [...settings.departmentIds, id]
    onChange({ departmentIds: next })
  }

  return (
    <div className="space-y-5">
      {/* Course identity */}
      <section className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-4">
        <SectionHeader icon={Settings2} title="Course Identity" />

        <div className="space-y-3">
          <Field label="Course Title">
            <input
              className={inputCls}
              value={settings.title}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="Enter course title"
            />
          </Field>
          <Field label="Description">
            <textarea
              className={cn(inputCls, 'min-h-[88px] resize-y')}
              value={settings.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Brief description of this course..."
            />
          </Field>
          <div className="flex gap-3">
            <Field label="Status" className="flex-1">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowStatusDropdown((v) => !v)}
                  className={cn(
                    'w-full flex items-center justify-between gap-2 px-3 py-2 rounded-[10px] border text-sm font-medium transition-colors',
                    currentStatus.color,
                  )}
                >
                  {currentStatus.label}
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>
                {showStatusDropdown && (
                  <div className="absolute top-full mt-1 left-0 right-0 bg-card border border-border rounded-xl shadow-lg z-20 overflow-hidden">
                    {statusOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          onChange({ status: opt.value })
                          setShowStatusDropdown(false)
                        }}
                        className={cn(
                          'w-full text-left px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary',
                          opt.value === settings.status ? 'bg-secondary' : '',
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Field>
            <Field label="Due Date" className="flex-1">
              <input
                type="date"
                className={inputCls}
                value={settings.dueDate}
                onChange={(e) => onChange({ dueDate: e.target.value })}
              />
            </Field>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/60">
            <div className="flex flex-col flex-1">
              <span className="text-sm font-medium text-foreground">Compliance Course</span>
              <span className="text-xs text-muted-foreground">Marks this as a mandatory compliance training</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.isCompliance}
              onClick={() => onChange({ isCompliance: !settings.isCompliance })}
              className={cn(
                'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none',
                settings.isCompliance ? 'bg-primary' : 'bg-muted-foreground/30',
              )}
            >
              <span
                className={cn(
                  'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                  settings.isCompliance ? 'translate-x-4' : 'translate-x-0',
                )}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Assessment settings */}
      <section className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-4">
        <SectionHeader icon={Hash} title="Assessment Rules" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Passing Score (%)">
            <div className="relative">
              <input
                type="number"
                min={0}
                max={100}
                className={cn(inputCls, 'pr-8')}
                value={settings.passingPercentage}
                onChange={(e) => onChange({ passingPercentage: Number(e.target.value) })}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">%</span>
            </div>
            <PassingScoreBar value={settings.passingPercentage} />
          </Field>
          <Field label="Max Attempts">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onChange({ maxAttempts: Math.max(1, settings.maxAttempts - 1) })}
                className="w-8 h-9 rounded-[10px] border border-border bg-secondary hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                max={10}
                className={cn(inputCls, 'text-center flex-1')}
                value={settings.maxAttempts}
                onChange={(e) => onChange({ maxAttempts: Number(e.target.value) })}
              />
              <button
                type="button"
                onClick={() => onChange({ maxAttempts: Math.min(10, settings.maxAttempts + 1) })}
                className="w-8 h-9 rounded-[10px] border border-border bg-secondary hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                +
              </button>
            </div>
          </Field>
        </div>
        <div className="flex items-center gap-2 p-2.5 bg-secondary border border-border rounded-xl text-xs text-muted-foreground">
          <RotateCcw className="w-3.5 h-3.5 flex-shrink-0" />
          Learners will be locked out after {settings.maxAttempts} failed {settings.maxAttempts === 1 ? 'attempt' : 'attempts'}. Manager reset required.
        </div>
      </section>

      {/* Certification */}
      <section className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-4">
        <SectionHeader icon={Award} title="Certification" />
        <Field label="Certificate Name">
          <input
            className={inputCls}
            value={settings.certificationName}
            onChange={(e) => onChange({ certificationName: e.target.value })}
            placeholder="e.g. LOTO Certified — leave blank for none"
          />
        </Field>
        <Field label="Validity Period">
          <div className="flex gap-2 items-center">
            <button
              type="button"
              onClick={() => onChange({ certificationValidityDays: null })}
              className={cn(
                'px-3 py-2 rounded-[10px] border text-xs font-medium transition-colors',
                  settings.certificationValidityDays === null
                    ? 'bg-nav-pill text-white border-nav-pill'
                    : 'bg-secondary text-muted-foreground border-border hover:bg-accent',
              )}
            >
              Never expires
            </button>
            {[365, 730, 1095].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => onChange({ certificationValidityDays: days })}
                className={cn(
                  'px-3 py-2 rounded-[10px] border text-xs font-medium transition-colors',
                  settings.certificationValidityDays === days
                    ? 'bg-nav-pill text-white border-nav-pill'
                    : 'bg-secondary text-muted-foreground border-border hover:bg-accent',
                )}
              >
                {days === 365 ? '1 yr' : days === 730 ? '2 yr' : '3 yr'}
              </button>
            ))}
          </div>
        </Field>
      </section>

      {/* Departments */}
      <section className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-4">
        <SectionHeader icon={ShieldCheck} title="Assigned Departments" />
        <div className="grid grid-cols-2 gap-2">
          {departments.map((dept) => {
            const isSelected = settings.departmentIds.includes(dept.id)
            return (
              <button
                key={dept.id}
                type="button"
                onClick={() => toggleDepartment(dept.id)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all',
                  isSelected
                    ? 'bg-primary/20 border-primary/40 text-foreground shadow-sm'
                    : 'bg-secondary/50 border-border text-muted-foreground hover:bg-secondary',
                )}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 ring-2 ring-white"
                  style={{ background: dept.color }}
                />
                <span className="text-xs font-medium truncate">{dept.name}</span>
                <span className="ml-auto text-[10px] text-muted-foreground">{dept.headcount}</span>
                {isSelected && (
                  <svg className="w-3.5 h-3.5 text-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          {settings.departmentIds.length === 0
            ? 'No departments selected — course will not be assigned.'
            : `Assigned to ${settings.departmentIds.length} department${settings.departmentIds.length !== 1 ? 's' : ''}.`}
        </p>
      </section>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2.5 pb-1 border-b border-border">
      <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 text-foreground" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
    </div>
  )
}

function Field({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}

function PassingScoreBar({ value }: { value: number }) {
  const color =
    value >= 80 ? 'bg-emerald-500' : value >= 60 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div className="mt-1.5 h-1.5 rounded-full bg-secondary overflow-hidden">
      <div
        className={cn('h-full rounded-full transition-all duration-300', color)}
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  )
}

const inputCls =
  'w-full px-3 py-2 rounded-[10px] border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow'
