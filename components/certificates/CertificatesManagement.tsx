'use client'

import { useState } from 'react'
import { SectionCard } from '@/components/ui/metric-card'
import {
  Plus, X, Check, Pencil, Trash2, Award,
  Clock, Infinity, Search, Download
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { certificateTemplates, certifications, users, courses, CertificateTemplate } from '@/lib/data'

// ─── Template Form Modal ──────────────────────────────────────────────────────

function TemplateFormModal({
  template,
  onClose,
  onSave,
}: {
  template?: CertificateTemplate
  onClose: () => void
  onSave: (t: Omit<CertificateTemplate, 'id'>) => void
}) {
  const [name, setName] = useState(template?.name ?? '')
  const [description, setDescription] = useState(template?.description ?? '')
  const [hasExpiry, setHasExpiry] = useState(template?.validityDays !== null)
  const [validityDays, setValidityDays] = useState(template?.validityDays ?? 365)

  const valid = name.trim().length > 0 && description.trim().length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">
            {template ? 'Редактировать шаблон' : 'Новый шаблон сертификата'}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Название сертификата</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="например, Сертификат по охране труда"
              className="w-full text-sm px-3 py-2 rounded-[10px] border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Описание</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              placeholder="Краткое описание сертификата..."
              className="w-full text-sm px-3 py-2 rounded-[10px] border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground resize-none"
            />
          </div>

          {/* Validity */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Срок действия</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setHasExpiry(false)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-medium border transition-all',
                  !hasExpiry
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-secondary/50 text-muted-foreground border-border hover:border-foreground/30',
                )}
              >
                <Infinity className="w-3.5 h-3.5" /> Бессрочный
              </button>
              <button
                onClick={() => setHasExpiry(true)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-medium border transition-all',
                  hasExpiry
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-secondary/50 text-muted-foreground border-border hover:border-foreground/30',
                )}
              >
                <Clock className="w-3.5 h-3.5" /> С истечением
              </button>
            </div>

            {hasExpiry && (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  min={1}
                  value={validityDays}
                  onChange={e => setValidityDays(Number(e.target.value))}
                  className="w-24 text-sm px-3 py-2 rounded-[10px] border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <span className="text-xs text-muted-foreground">дней</span>
                {validityDays >= 365 && (
                  <span className="text-xs text-muted-foreground">
                    ({Math.round(validityDays / 365 * 10) / 10}y)
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border bg-secondary/30">
          <button onClick={onClose} className="px-4 py-2 rounded-[10px] text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Отмена
          </button>
          <button
            onClick={() => valid && onSave({ name: name.trim(), description: description.trim(), validityDays: hasExpiry ? validityDays : null })}
            disabled={!valid}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-sm font-medium transition-colors',
              valid
                ? 'bg-foreground text-background hover:bg-foreground/90'
                : 'bg-secondary text-muted-foreground cursor-not-allowed',
            )}
          >
            <Check className="w-3.5 h-3.5" />
            {template ? 'Сохранить' : 'Создать шаблон'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Template Card ────────────────────────────────────────────────────────────

function TemplateCard({
  template,
  issuedCount,
  onEdit,
  onDelete,
}: {
  template: CertificateTemplate
  issuedCount: number
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="group bg-white rounded-2xl border border-border p-4 hover:shadow-[0_4px_16px_rgba(0,0,0,0.07)] transition-all">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-[10px] bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
          <Award className="w-5 h-5 text-amber-500" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground leading-tight">{template.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{template.description}</p>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={onEdit}
            className="w-7 h-7 rounded-[7px] flex items-center justify-center bg-secondary border border-border text-muted-foreground hover:text-foreground hover:bg-white transition-colors"
            aria-label={`Редактировать ${template.name}`}
          >
            <Pencil className="w-3 h-3" />
          </button>
          <button
            onClick={onDelete}
            className="w-7 h-7 rounded-[7px] flex items-center justify-center bg-secondary border border-border text-muted-foreground hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
            aria-label={`Удалить ${template.name}`}
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5">
          {template.validityDays ? (
            <>
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {template.validityDays >= 365
                  ? `${Math.round(template.validityDays / 365 * 10) / 10} г. действия`
                  : `${template.validityDays} д. действия`}
              </span>
            </>
          ) : (
            <>
              <Infinity className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs text-emerald-600 font-medium">Бессрочный</span>
            </>
          )}
        </div>
        <span className="text-xs text-muted-foreground">{issuedCount} выдано</span>
      </div>
    </div>
  )
}

// ─── Issued Certs Table ───────────────────────────────────────────────────────

const STATUS_STYLES = {
  valid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  expiring_soon: 'bg-amber-50 text-amber-700 border-amber-200',
  expired: 'bg-red-50 text-red-600 border-red-200',
  not_earned: 'bg-gray-100 text-gray-500 border-gray-200',
}

const STATUS_LABELS = {
  valid: 'Действующий',
  expiring_soon: 'Истекает скоро',
  expired: 'Истёкший',
  not_earned: 'Не получен',
}

function IssuedCertsTable() {
  const [search, setSearch] = useState('')

  const rows = certifications
    .map(cert => {
      const user = users.find(u => u.id === cert.userId)
      const course = courses.find(c => c.id === cert.courseId)
      return { cert, user, course }
    })
    .filter(({ user, course }) => {
      const q = search.toLowerCase()
      return (
        user?.name.toLowerCase().includes(q) ||
        course?.title.toLowerCase().includes(q)
      )
    })

  return (
    <SectionCard
      title="Выданные сертификаты"
      subtitle={`Выдано сертификатов: ${certifications.length}`}
      noPadding
      action={
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-secondary/60 border border-border rounded-full px-3 py-1.5">
            <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Поиск..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none w-28"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-foreground text-background rounded-[10px] text-xs font-medium hover:bg-foreground/90 transition-colors">
            <Download className="w-3.5 h-3.5" /> Экспорт
          </button>
        </div>
      }
    >
      {/* Header */}
      <div className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1fr] gap-4 px-5 py-2.5 bg-secondary border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
        <span>Сотрудник</span>
        <span>Курс / Сертификат</span>
        <span>Номер серт.</span>
        <span>Истекает</span>
        <span>Статус</span>
      </div>

      <div className="divide-y divide-border">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Award className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-sm font-medium">Сертификаты не найдены</p>
          </div>
        ) : (
          rows.map(({ cert, user, course }) => (
            <div
              key={cert.id}
              className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1fr] gap-4 px-5 py-3.5 items-center hover:bg-secondary/40 transition-colors"
            >
              {/* Employee */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center text-xs font-bold text-foreground shrink-0">
                  {user?.name.split(' ').map(n => n[0]).join('') ?? '?'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{user?.name ?? 'Неизвестно'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email ?? ''}</p>
                </div>
              </div>

              {/* Course */}
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{course?.certificationName ?? course?.title ?? '—'}</p>
                <p className="text-xs text-muted-foreground truncate">{course?.title}</p>
              </div>

              {/* Cert number */}
              <p className="text-xs font-mono text-muted-foreground truncate">{cert.certNumber}</p>

              {/* Expires */}
              <p className="text-xs text-muted-foreground">
                {cert.expiresAt ? new Date(cert.expiresAt).toLocaleDateString('ru-RU', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
              </p>

              {/* Status */}
              <span className={cn('inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border w-fit', STATUS_STYLES[cert.status])}>
                {STATUS_LABELS[cert.status]}
              </span>
            </div>
          ))
        )}
      </div>
    </SectionCard>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CertificatesManagement() {
  const [templates, setTemplates] = useState(certificateTemplates)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CertificateTemplate | null>(null)

  function handleSave(data: Omit<CertificateTemplate, 'id'>) {
    if (editing) {
      setTemplates(prev => prev.map(t => t.id === editing.id ? { ...t, ...data } : t))
    } else {
      setTemplates(prev => [...prev, { id: `ct${Date.now()}`, ...data }])
    }
    setModalOpen(false)
    setEditing(null)
  }

  function handleDelete(id: string) {
    setTemplates(prev => prev.filter(t => t.id !== id))
  }

  return (
    <>
      {(modalOpen || editing) && (
        <TemplateFormModal
          template={editing ?? undefined}
          onClose={() => { setModalOpen(false); setEditing(null) }}
          onSave={handleSave}
        />
      )}

      {/* Templates */}
      <SectionCard
        title="Шаблоны сертификатов"
        subtitle={`Определено шаблонов: ${templates.length}`}
        action={
          <button
            onClick={() => { setEditing(null); setModalOpen(true) }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-foreground text-background rounded-[10px] text-xs font-medium hover:bg-foreground/90 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Новый шаблон
          </button>
        }
      >
        {templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Award className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-sm font-medium">Пока нет шаблонов</p>
            <p className="text-xs mt-1">Создайте первый шаблон сертификата</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {templates.map(t => {
              const issuedCount = certifications.filter(c =>
                courses.find(co => co.id === c.courseId)?.certificationName === t.name,
              ).length
              return (
                <TemplateCard
                  key={t.id}
                  template={t}
                  issuedCount={issuedCount}
                  onEdit={() => setEditing(t)}
                  onDelete={() => handleDelete(t.id)}
                />
              )
            })}
          </div>
        )}
      </SectionCard>

      {/* Issued certificates table */}
      <IssuedCertsTable />
    </>
  )
}
