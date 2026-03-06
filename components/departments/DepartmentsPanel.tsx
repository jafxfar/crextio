'use client'

import { useState } from 'react'
import { SectionCard } from '@/components/ui/metric-card'
import { Plus, Pencil, Trash2, X, Check, Users, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { departments as initialDepartments, Department, users, departmentStats } from '@/lib/data'

const PRESET_COLORS = [
  '#1E40AF', '#0891B2', '#059669', '#D97706',
  '#DC2626', '#7C3AED', '#DB2777', '#0D9488',
  '#EA580C', '#4F46E5',
]

function DepartmentFormModal({
  department,
  onClose,
  onSave,
}: {
  department?: Department
  onClose: () => void
  onSave: (d: Omit<Department, 'id'>) => void
}) {
  const [name, setName] = useState(department?.name ?? '')
  const [headcount, setHeadcount] = useState(department?.headcount ?? 0)
  const [color, setColor] = useState(department?.color ?? PRESET_COLORS[0])

  const valid = name.trim().length > 0 && headcount >= 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">
            {department ? 'Редактировать отдел' : 'Добавить отдел'}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Название отдела</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="например, Разработка"
              className="w-full text-sm px-3 py-2 rounded-[10px] border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
            />
          </div>

          {/* Headcount */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Численность</label>
            <input
              type="number"
              min={0}
              value={headcount}
              onChange={e => setHeadcount(Number(e.target.value))}
              className="w-full text-sm px-3 py-2 rounded-[10px] border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Color */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Цвет</label>
            <div className="flex items-center gap-2 flex-wrap">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={cn(
                    'w-8 h-8 rounded-full transition-all border-2',
                    color === c ? 'border-foreground scale-110 shadow-md' : 'border-transparent',
                  )}
                  aria-label={`Select color ${c}`}
                />
              ))}
              {/* Custom */}
              <label className="w-8 h-8 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-foreground/40 transition-colors overflow-hidden">
                <input
                  type="color"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="opacity-0 absolute w-1 h-1"
                />
                <span className="text-[10px] text-muted-foreground">+</span>
              </label>
            </div>

            {/* Preview */}
            <div className="flex items-center gap-2 mt-2 p-3 rounded-[10px] border border-border bg-secondary/30">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: color }}>
                {name ? name.slice(0, 2).toUpperCase() : 'DE'}
              </div>
              <span className="text-sm font-medium text-foreground">{name || 'Название отдела'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border bg-secondary/30">
          <button onClick={onClose} className="px-4 py-2 rounded-[10px] text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Отмена
          </button>
          <button
            onClick={() => valid && onSave({ name: name.trim(), headcount, color })}
            disabled={!valid}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-sm font-medium transition-colors',
              valid
                ? 'bg-foreground text-background hover:bg-foreground/90'
                : 'bg-secondary text-muted-foreground cursor-not-allowed',
            )}
          >
            <Check className="w-3.5 h-3.5" />
            {department ? 'Сохранить' : 'Добавить отдел'}
          </button>
        </div>
      </div>
    </div>
  )
}

function DepartmentCard({
  department,
  onEdit,
  onDelete,
}: {
  department: Department
  onEdit: () => void
  onDelete: () => void
}) {
  const stat = departmentStats.find(s => s.department.id === department.id)
  const memberCount = users.filter(u => u.departmentId === department.id).length
  const compliance = stat?.complianceRate ?? null

  return (
    <div className="group relative bg-white rounded-2xl border border-border p-5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all overflow-hidden">
      {/* Color accent bar */}
      {/* <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
        style={{ backgroundColor: department.color }}
      /> */}

      <div className="flex items-start justify-between mt-1">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-base font-bold shadow-sm"
            style={{ backgroundColor: department.color }}
          >
            {department.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground leading-tight">{department.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{department.headcount} чел.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="w-7 h-7 rounded-[7px] flex items-center justify-center bg-secondary border border-border text-muted-foreground hover:text-foreground hover:bg-white transition-colors"
            aria-label={`Редактировать ${department.name}`}
          >
            <Pencil className="w-3 h-3" />
          </button>
          <button
            onClick={onDelete}
            className="w-7 h-7 rounded-[7px] flex items-center justify-center bg-secondary border border-border text-muted-foreground hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
            aria-label={`Удалить ${department.name}`}
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-secondary/40 rounded-[10px] p-2.5 flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <div>
            <p className="text-xs font-bold text-foreground">{memberCount}</p>
            <p className="text-[10px] text-muted-foreground">Участники</p>
          </div>
        </div>
        <div className="bg-secondary/40 rounded-[10px] p-2.5 flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <div>
            <p className="text-xs font-bold text-foreground">
              {compliance !== null ? `${compliance}%` : '—'}
            </p>
            <p className="text-[10px] text-muted-foreground">Соответствие</p>
          </div>
        </div>
      </div>

      {/* Compliance bar */}
      {compliance !== null && (
        <div className="mt-3">
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${compliance}%`, backgroundColor: department.color }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export function DepartmentsPanel() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Department | null>(null)

  function handleSave(data: Omit<Department, 'id'>) {
    if (editing) {
      setDepartments(prev => prev.map(d => d.id === editing.id ? { ...d, ...data } : d))
    } else {
      setDepartments(prev => [...prev, { id: `d${Date.now()}`, ...data }])
    }
    setModalOpen(false)
    setEditing(null)
  }

  function handleDelete(id: string) {
    setDepartments(prev => prev.filter(d => d.id !== id))
  }

  return (
    <>
      {(modalOpen || editing) && (
        <DepartmentFormModal
          department={editing ?? undefined}
          onClose={() => { setModalOpen(false); setEditing(null) }}
          onSave={handleSave}
        />
      )}

      <SectionCard
        title="Отделы"
        subtitle={`${departments.length} отделов · ${departments.reduce((s, d) => s + d.headcount, 0)} сотрудников`}
        action={
          <button
            onClick={() => { setEditing(null); setModalOpen(true) }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-foreground text-background rounded-[10px] text-xs font-medium hover:bg-foreground/90 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Добавить отдел
          </button>
        }
      >
        {departments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <span className="text-3xl mb-2">🏢</span>
            <p className="text-sm font-medium">Пока нет отделов</p>
            <p className="text-xs mt-1">Добавьте первый отдел, чтобы начать</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-none">
            {departments.map(dept => (
              <DepartmentCard
                key={dept.id}
                department={dept}
                onEdit={() => setEditing(dept)}
                onDelete={() => handleDelete(dept.id)}
              />
            ))}
          </div>
        )}
      </SectionCard>
    </>
  )
}
