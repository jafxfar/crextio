'use client'

import { useState } from 'react'
import { courses, departments } from '@/lib/data'
import { CourseBadge, StatusBadge } from '@/components/ui/status-badge'
import {
  BookOpen, Users, Clock, Search,
  ShieldCheck, Award, BarChart2,
  PlusCircle, Pencil, ArrowUpRight,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { CreateCourseModal } from '@/components/course-editor/create-course-modal'

function ProgressBar({ value, color = 'bg-primary' }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
      <div className={cn('h-full rounded-full transition-all duration-500', color)} style={{ width: `${value}%` }} />
    </div>
  )
}

function getDeptNames(deptIds: string[]) {
  return deptIds.map(id => departments.find(d => d.id === id)?.name ?? id).join(', ')
}

function CourseCard({ course }: { course: typeof courses[0] }) {
  const compColor =
    course.completionRate >= 85 ? 'bg-emerald-500' :
    course.completionRate >= 60 ? 'bg-primary' : 'bg-red-400'

  return (
    <div className="bg-card border border-border rounded-[16px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.09)] transition-all duration-200 flex flex-col gap-4 group">

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="w-10 h-10 rounded-[12px] bg-primary/15 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-5 h-5 text-foreground" />
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
          <CourseBadge status={course.status} />
          {course.isCompliance && (
            <StatusBadge variant="info" label="Compliance" />
          )}
        </div>
      </div>

      {/* Title + description */}
      <div>
        <h3 className="text-[14px] font-semibold text-foreground leading-snug group-hover:text-foreground/70 transition-colors">
          {course.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{course.description}</p>
      </div>

      {/* Stat row */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" /> {course.totalEnrolled}
        </span>
        <span className="flex items-center gap-1">
          <BarChart2 className="w-3 h-3" /> Avg {course.avgScore ?? '—'}%
        </span>
        {course.certificationName && (
          <span className="flex items-center gap-1 text-amber-600 font-medium">
            <Award className="w-3 h-3" /> Cert
          </span>
        )}
      </div>

      {/* Completion bar */}
      {course.status === 'active' && course.totalEnrolled > 0 && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-muted-foreground">Completion</span>
            <span className="text-[11px] font-bold text-foreground">{course.completionRate}%</span>
          </div>
          <ProgressBar value={course.completionRate} color={compColor} />
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <p className="text-[11px] text-muted-foreground truncate max-w-[55%]">
          {getDeptNames(course.departmentIds).substring(0, 34)}
          {getDeptNames(course.departmentIds).length > 34 ? '...' : ''}
        </p>
        <div className="flex items-center gap-2 flex-shrink-0">
          {course.dueDate && (
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> {course.dueDate}
            </span>
          )}
          <Link
            href="/courses/edit"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground text-muted-foreground text-[11px] font-medium transition-all border border-border hover:border-primary"
          >
            <Pencil className="w-2.5 h-2.5" /> Edit
          </Link>
        </div>
      </div>
    </div>
  )
}

export function CoursesPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'compliance' | 'active' | 'draft'>('all')
  const [createOpen, setCreateOpen] = useState(false)

  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'all' ? true :
      filter === 'compliance' ? c.isCompliance :
      c.status === filter
    return matchSearch && matchFilter
  })

  const stats = {
    total: courses.length,
    active: courses.filter(c => c.status === 'active').length,
    compliance: courses.filter(c => c.isCompliance).length,
    draft: courses.filter(c => c.status === 'draft').length,
  }

  return (
    <div className="space-y-6">

      {/* Summary pills */}
      <div className="flex items-center gap-3 flex-wrap">
        {[
          { label: 'Total', value: stats.total, dark: true },
          { label: 'Active', value: stats.active },
          { label: 'Compliance', value: stats.compliance },
          { label: 'Draft', value: stats.draft },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{s.label}</span>
            <span className={cn(
              'px-4 py-1.5 rounded-full text-sm font-semibold',
              s.dark ? 'bg-nav-pill text-white' : 'bg-primary text-primary-foreground',
            )}>
              {s.value}
            </span>
          </div>
        ))}
      </div>

      {/* Filter bar + search + action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-card border border-border rounded-full px-2 py-1.5 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
          {(['all', 'compliance', 'active', 'draft'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-1 rounded-full text-[12px] font-medium transition-all',
                filter === f
                  ? 'bg-nav-pill text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-card rounded-full border border-border px-4 py-2 flex-1 sm:w-52 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
            <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1 min-w-0"
            />
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-nav-pill text-white rounded-full text-[12px] font-medium hover:opacity-90 transition-opacity flex-shrink-0">
            <PlusCircle className="w-3.5 h-3.5" /> New Course
          </button>
        </div>
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full bg-card border border-border rounded-[16px] p-12 text-center">
            <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No courses match your filter</p>
          </div>
        )}
      </div>

      {/* Create Course Modal */}
      <CreateCourseModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  )
}
