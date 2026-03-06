'use client'

import { useState } from 'react'
import { SectionCard } from '@/components/ui/metric-card'
import { Search, Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { skills as initialSkills, Skill } from '@/lib/data'
import { SkillCategoryBadge } from './SkillCategoryBadge'

const CATEGORIES = ['Безопасность', 'Качество', 'Операции', 'Оборудование', 'Аналитика', 'Гибкие навыки']

const ICONS = ['⚙️', '⚡', '🔥', '✅', '📉', '📊', '🏗️', '🦺', '🚨', '📋', '🔬', '👥', '🛡️', '🔧', '📦', '💡']

function SkillFormModal({
  skill,
  onClose,
  onSave,
}: {
  skill?: Skill
  onClose: () => void
  onSave: (s: Omit<Skill, 'id'>) => void
}) {
  const [name, setName] = useState(skill?.name ?? '')
  const [icon, setIcon] = useState(skill?.icon ?? '⚙️')
  const [category, setCategory] = useState(skill?.category ?? CATEGORIES[0])

  const valid = name.trim().length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">{skill ? 'Редактировать навык' : 'Добавить навык'}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Название навыка</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="например, Безопасность оборудования"
              className="w-full text-sm px-3 py-2 rounded-[10px] border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
            />
          </div>

          {/* Icon picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Иконка</label>
            <div className="grid grid-cols-8 gap-1.5">
              {ICONS.map(em => (
                <button
                  key={em}
                  onClick={() => setIcon(em)}
                  className={cn(
                    'w-9 h-9 rounded-[8px] text-base flex items-center justify-center border transition-all',
                    icon === em
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                      : 'border-border bg-secondary/50 hover:bg-secondary',
                  )}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Категория</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium border transition-all',
                    category === cat
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-secondary/50 text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground',
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border bg-secondary/30">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-[10px] text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={() => valid && onSave({ name: name.trim(), icon, category })}
            disabled={!valid}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-sm font-medium transition-colors',
              valid
                ? 'bg-foreground text-background hover:bg-foreground/90'
                : 'bg-secondary text-muted-foreground cursor-not-allowed',
            )}
          >
            <Check className="w-3.5 h-3.5" />
            {skill ? 'Сохранить' : 'Добавить навык'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function SkillsPanel() {
  const [skills, setSkills] = useState<Skill[]>(initialSkills)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Skill | null>(null)

  const categories = Array.from(new Set(skills.map(s => s.category)))

  const filtered = skills.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCategory ? s.category === filterCategory : true
    return matchSearch && matchCat
  })

  function handleSave(data: Omit<Skill, 'id'>) {
    if (editing) {
      setSkills(prev => prev.map(s => s.id === editing.id ? { ...s, ...data } : s))
    } else {
      setSkills(prev => [...prev, { id: `sk${Date.now()}`, ...data }])
    }
    setModalOpen(false)
    setEditing(null)
  }

  function handleDelete(id: string) {
    setSkills(prev => prev.filter(s => s.id !== id))
  }

  return (
    <>
      {(modalOpen || editing) && (
        <SkillFormModal
          skill={editing ?? undefined}
          onClose={() => { setModalOpen(false); setEditing(null) }}
          onSave={handleSave}
        />
      )}

      <SectionCard
        title="Библиотека навыков"
        subtitle={`${skills.length} навыков · ${categories.length} категорий`}
        noPadding
        action={
          <button
            onClick={() => { setEditing(null); setModalOpen(true) }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-foreground text-background rounded-[10px] text-xs font-medium hover:bg-foreground/90 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Добавить навык
          </button>
        }
      >
        {/* Filters */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-border flex-wrap">
          <div className="flex items-center gap-1.5 bg-secondary/60 border border-border rounded-full px-3 py-1.5">
            <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Поиск навыков..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none w-32"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setFilterCategory(null)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium border transition-all',
                filterCategory === null
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-secondary/50 text-muted-foreground border-border hover:border-foreground/30',
              )}
            >
              Все
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat === filterCategory ? null : cat)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium border transition-all',
                  filterCategory === cat
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-secondary/50 text-muted-foreground border-border hover:border-foreground/30',
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-5">
          {filtered.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
              <span className="text-3xl mb-2">🔍</span>
              <p className="text-sm font-medium">Навыки не найдены</p>
              <p className="text-xs mt-1">Попробуйте изменить поисковый запрос или фильтры</p>
            </div>
          ) : (
            filtered.map(skill => (
              <div
                key={skill.id}
                className="group flex items-center gap-3 p-3.5 rounded-xl border border-border bg-secondary/30 hover:bg-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all"
              >
                <div className="w-10 h-10 rounded-[10px] bg-white border border-border flex items-center justify-center text-xl shrink-0 shadow-sm">
                  {skill.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground truncate">{skill.name}</p>
                  <SkillCategoryBadge category={skill.category} />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => setEditing(skill)}
                    className="w-7 h-7 rounded-[7px] flex items-center justify-center bg-secondary border border-border text-muted-foreground hover:text-foreground hover:bg-white transition-colors"
                    aria-label={`Редактировать ${skill.name}`}
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="w-7 h-7 rounded-[7px] flex items-center justify-center bg-secondary border border-border text-muted-foreground hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
                    aria-label={`Удалить ${skill.name}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </SectionCard>
    </>
  )
}
