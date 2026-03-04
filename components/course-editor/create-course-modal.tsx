'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, BookOpen, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { departments } from '@/lib/data'

interface CreateCourseModalProps {
  open: boolean
  onClose: () => void
}

export function CreateCourseModal({ open, onClose }: CreateCourseModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    departmentIds: [] as string[],
    status: 'draft' as 'draft' | 'active',
  })

  function toggleDept(id: string) {
    setForm((f) => ({
      ...f,
      departmentIds: f.departmentIds.includes(id)
        ? f.departmentIds.filter((d) => d !== id)
        : [...f.departmentIds, id],
    }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return

    setLoading(true)

    // Simulate API call — in a real app you'd POST and get back the new id
    setTimeout(() => {
      // Generate a temporary id based on timestamp
      const newId = `c-${Date.now()}`
      setLoading(false)
      onClose()
      router.push(`/courses/${newId}?title=${encodeURIComponent(form.title.trim())}`)
    }, 700)
  }

  if (!open) return null

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
              <BookOpen className="w-4.5 h-4.5 text-foreground" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-foreground leading-tight">New Course</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">Fill in the basics to get started</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent border border-border transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

          {/* Title */}
          <div>
            <label className="block text-[12px] font-semibold text-foreground mb-1.5">
              Course Title <span className="text-red-500">*</span>
            </label>
            <input
              autoFocus
              type="text"
              placeholder="e.g. Machine Safety & Lockout/Tagout"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[12px] font-semibold text-foreground mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Brief overview of what this course covers…"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
            />
          </div>

          {/* Departments */}
          <div>
            <label className="block text-[12px] font-semibold text-foreground mb-2">
              Departments
            </label>
            <div className="flex flex-wrap gap-2">
              {departments.map((d) => {
                const selected = form.departmentIds.includes(d.id)
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleDept(d.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all',
                      selected
                        ? 'bg-nav-pill text-white border-nav-pill shadow-sm'
                        : 'bg-secondary text-muted-foreground border-border hover:text-foreground hover:border-foreground/30',
                    )}
                  >
                    {d.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[12px] font-semibold text-foreground mb-2">
              Initial Status
            </label>
            <div className="flex gap-2">
              {(['draft', 'active'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, status: s }))}
                  className={cn(
                    'flex-1 py-2 rounded-xl text-[12px] font-semibold border transition-all',
                    form.status === s
                      ? s === 'draft'
                        ? 'bg-amber-50 text-amber-700 border-amber-300'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-secondary text-muted-foreground border-border hover:text-foreground',
                  )}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent border border-border transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!form.title.trim() || loading}
              className={cn(
                'flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-nav-pill hover:opacity-90 transition-all shadow-sm',
                (!form.title.trim() || loading) && 'opacity-60 cursor-not-allowed',
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Creating…
                </>
              ) : (
                'Create Course'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
