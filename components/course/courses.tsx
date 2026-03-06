'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'
import { courses } from '@/lib/data'
import { BookOpen, Search, PlusCircle, } from 'lucide-react'

import { CourseCard } from "@/components/course/CourseCard";
import { CreateCourseModal } from '@/components/course-editor/create-course-modal'

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
          { label: 'Всего', value: stats.total, dark: true },
          { label: 'Активные', value: stats.active },
          { label: 'Соответствие', value: stats.compliance },
          { label: 'Черновики', value: stats.draft },
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
              {{'all': 'Все', 'compliance': 'Соответствие', 'active': 'Активные', 'draft': 'Черновики'}[f] ?? f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-card rounded-full border border-border px-4 py-2 flex-1 sm:w-52 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
            <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              placeholder="Поиск курсов..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1 min-w-0"
            />
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-nav-pill text-white rounded-full text-[12px] font-medium hover:opacity-90 transition-opacity flex-shrink-0">
            <PlusCircle className="w-3.5 h-3.5" /> Новый курс
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
            <p className="text-sm text-muted-foreground">Курсы не найдены</p>
          </div>
        )}
      </div>

      {/* Create Course Modal */}
      <CreateCourseModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  )
}
