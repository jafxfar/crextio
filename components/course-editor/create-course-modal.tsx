'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  X, BookOpen, Loader2, Upload, ImageIcon,
  ChevronRight, ChevronLeft, Check,
  Trophy, Target, Zap, Plus, Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { departments, certificateTemplates, skills } from '@/lib/data'
import { createCourse } from '@/lib/courses-api'

interface CreateCourseModalProps {
  open: boolean
  onClose: () => void
}

type Step = 1 | 2 | 3

interface SkillEntry {
  skillId: string
  xp: number
}

interface FormState {
  // Step 1 — basics
  title: string
  description: string
  departmentIds: string[]
  status: 'draft' | 'active'
  bannerUrl: string
  bannerFile: File | null
  // Step 2 — rules
  maxAttempts: number        // 0 = unlimited
  passingPercentage: number
  certificateTemplateId: string  // '' = none
  // Step 3 — skills
  skillEntries: SkillEntry[]
}

const STEPS: { label: string; icon: React.ReactNode }[] = [
  { label: 'Основное',    icon: <BookOpen className="w-3.5 h-3.5" /> },
  { label: 'Правила',     icon: <Target className="w-3.5 h-3.5" /> },
  { label: 'Навыки и XP', icon: <Zap className="w-3.5 h-3.5" /> },
]

const ATTEMPTS_OPTIONS = [
  { label: 'Без ограничений', value: 0 },
  { label: '1 попытка', value: 1 },
  { label: '2 попытки', value: 2 },
  { label: '3 попытки', value: 3 },
  { label: '5 попыток', value: 5 },
]

export function CreateCourseModal({ open, onClose }: CreateCourseModalProps) {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    departmentIds: [],
    status: 'draft',
    bannerUrl: '',
    bannerFile: null,
    maxAttempts: 3,
    passingPercentage: 70,
    certificateTemplateId: '',
    skillEntries: [],
  })

  // ─── helpers ──────────────────────────────────────────────────────────────

  function toggleDept(id: string) {
    setForm(f => ({
      ...f,
      departmentIds: f.departmentIds.includes(id)
        ? f.departmentIds.filter(d => d !== id)
        : [...f.departmentIds, id],
    }))
  }

  function handleBanner(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setForm(f => ({ ...f, bannerUrl: url, bannerFile: file }))
  }

  function addSkill() {
    const available = skills.filter(s => !form.skillEntries.some(e => e.skillId === s.id))
    if (!available.length) return
    setForm(f => ({
      ...f,
      skillEntries: [...f.skillEntries, { skillId: available[0].id, xp: 50 }],
    }))
  }

  function updateSkillEntry(index: number, patch: Partial<SkillEntry>) {
    setForm(f => {
      const entries = [...f.skillEntries]
      entries[index] = { ...entries[index], ...patch }
      return { ...f, skillEntries: entries }
    })
  }

  function removeSkill(index: number) {
    setForm(f => ({
      ...f,
      skillEntries: f.skillEntries.filter((_, i) => i !== index),
    }))
  }

  // ─── submit ───────────────────────────────────────────────────────────────

  async function handleSubmit() {
    if (!form.title.trim()) return
    setLoading(true)
    try {
      const courseId = await createCourse({
        title: form.title.trim(),
        info: form.description.trim(),
        badgeUrl: form.bannerUrl,
        imageUrl: form.bannerUrl,
        mainSourceUrl: '',
      })

      if (!courseId) {
        throw new Error(`Сервер не вернул id курса`)
      }

      onClose()
      resetForm()
      router.push(`/courses/${courseId}`)
    } catch (err) {
      console.error('[createCourse]', err)
      setSubmitError(err instanceof Error ? err.message : 'Ошибка при создании курса')
      setLoading(false)
    }
  }

  function resetForm() {
    setStep(1)
    setSubmitError(null)
    setForm({
      title: '', description: '', departmentIds: [], status: 'draft',
      bannerUrl: '', bannerFile: null,
      maxAttempts: 3, passingPercentage: 70, certificateTemplateId: '',
      skillEntries: [],
    })
  }

  function handleClose() {
    onClose()
    resetForm()
  }

  // ─── step validity ─────────────────────────────────────────────────────────

  const step1Valid = form.title.trim().length > 0
  const step2Valid = form.passingPercentage >= 10 && form.passingPercentage <= 100
  const canSubmit = step1Valid && step2Valid

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.50)', backdropFilter: 'blur(6px)' }}
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
              <BookOpen className="w-4.5 h-4.5 text-foreground" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-foreground leading-tight">Новый курс</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">Шаг {step} из {STEPS.length} — {STEPS[step - 1].label}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent border border-border transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Step indicator ─────────────────────────────────────────────── */}
        <div className="flex items-center px-6 pt-4 pb-0 shrink-0">
          {STEPS.map((s, i) => {
            const idx = i + 1
            const done = idx < step
            const active = idx === step
            return (
              <div key={s.label} className="flex items-center flex-1">
                <button
                  type="button"
                  onClick={() => { if (done) setStep(idx as Step) }}
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap',
                    active ? 'bg-primary text-primary-foreground'
                      : done ? 'bg-emerald-100 text-emerald-700 cursor-pointer hover:bg-emerald-200'
                        : 'bg-secondary text-muted-foreground cursor-default',
                  )}
                >
                  {done ? <Check className="w-3 h-3" /> : s.icon}
                  {s.label}
                </button>
                {i < STEPS.length - 1 && (
                  <div className={cn('flex-1 h-px mx-1', done ? 'bg-emerald-300' : 'bg-border')} />
                )}
              </div>
            )
          })}
        </div>

        {/* ── Body ───────────────────────────────────────────────────────── */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* ══ STEP 1 — BASICS ══════════════════════════════════════════ */}
          {step === 1 && (
            <>
              {/* Banner upload */}
              <div>
                <label className="block text-[12px] font-semibold text-foreground mb-1.5">
                  Баннер курса
                </label>
                <div
                  className={cn(
                    'relative w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer overflow-hidden transition-colors',
                    form.bannerUrl
                      ? 'border-transparent'
                      : 'border-border hover:border-primary/50 bg-secondary/60',
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {form.bannerUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.bannerUrl} alt="Banner preview" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-medium flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5" /> Изменить изображение
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-border/60 flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <p className="text-[12px] text-muted-foreground">
                        Нажмите для загрузки баннера <span className="text-foreground/40 font-medium">· PNG, JPG, WEBP</span>
                      </p>
                    </>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleBanner} />
              </div>

              {/* Title */}
              <div>
                <label className="block text-[12px] font-semibold text-foreground mb-1.5">
                  Название курса <span className="text-red-500">*</span>
                </label>
                <input
                  autoFocus
                  type="text"
                  placeholder="например, Безопасность оборудования"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[12px] font-semibold text-foreground mb-1.5">Описание</label>
                <textarea
                  rows={3}
                  placeholder="Краткое описание содержания курса…"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
                />
              </div>

              {/* Departments */}
              <div>
                <label className="block text-[12px] font-semibold text-foreground mb-2">Отделы</label>
                <div className="flex flex-wrap gap-2">
                  {departments.map(d => {
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
                <label className="block text-[12px] font-semibold text-foreground mb-2">Начальный статус</label>
                <div className="flex gap-2">
                  {(['draft', 'active'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, status: s }))}
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
            </>
          )}

          {/* ══ STEP 2 — RULES ════════════════════════════════════════════ */}
          {step === 2 && (
            <>
              {/* Max attempts */}
              <div>
                <label className="block text-[12px] font-semibold text-foreground mb-1.5">Максимум попыток</label>
                <p className="text-[11px] text-muted-foreground mb-2.5">
                  Сколько раз обучающийся может пересдать курс до блокировки.
                </p>
                <div className="flex flex-wrap gap-2">
                  {ATTEMPTS_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, maxAttempts: opt.value }))}
                      className={cn(
                        'px-3.5 py-2 rounded-xl text-[12px] font-semibold border transition-all',
                        form.maxAttempts === opt.value
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                          : 'bg-secondary text-muted-foreground border-border hover:text-foreground hover:border-foreground/30',
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Passing percentage */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[12px] font-semibold text-foreground">Порог прохождения</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={10}
                      max={100}
                      value={form.passingPercentage}
                      onChange={e => setForm(f => ({ ...f, passingPercentage: Math.min(100, Math.max(10, Number(e.target.value))) }))}
                      className="w-14 bg-secondary border border-border rounded-lg px-2 py-1 text-sm font-bold text-foreground text-center outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                    />
                    <span className="text-sm text-muted-foreground font-medium">%</span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground mb-3">
                  Обучающийся должен набрать не менее этого процента для прохождения. Например, 7/10 правильных = 70%.
                </p>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={form.passingPercentage}
                  onChange={e => setForm(f => ({ ...f, passingPercentage: Number(e.target.value) }))}
                  className="w-full accent-primary h-1.5 rounded-full cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>10%</span><span>50%</span><span>100%</span>
                </div>
                <div className={cn(
                  'mt-3 rounded-xl border px-4 py-3 text-[12px]',
                  form.passingPercentage <= 60
                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                    : form.passingPercentage >= 90
                      ? 'bg-red-50 border-red-200 text-red-700'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-700',
                )}>
                  <span className="font-bold">Пример: </span>
                  10 вопросов → нужно минимум <span className="font-bold">{Math.ceil(10 * form.passingPercentage / 100)}</span> правильных для прохождения при {form.passingPercentage}%
                </div>
              </div>

              {/* Certificate selection */}
              <div>
                <label className="block text-[12px] font-semibold text-foreground mb-1.5">
                  <Trophy className="w-3.5 h-3.5 inline mr-1 mb-0.5" />
                  Сертификат по завершении
                </label>
                <p className="text-[11px] text-muted-foreground mb-2.5">
                  Выберите сертификат из системы. Оставьте без выбора, если сертификат не нужен.
                </p>
                <div className="space-y-2">
                  <label className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all',
                    form.certificateTemplateId === '' ? 'border-primary bg-primary/5' : 'border-border hover:border-foreground/20',
                  )}>
                    <input type="radio" name="cert" value="" checked={form.certificateTemplateId === ''} onChange={() => setForm(f => ({ ...f, certificateTemplateId: '' }))} className="accent-primary" />
                    <div>
                      <p className="text-[12px] font-semibold text-foreground">Без сертификата</p>
                      <p className="text-[11px] text-muted-foreground">Только завершение курса</p>
                    </div>
                  </label>
                  {certificateTemplates.map(ct => (
                    <label
                      key={ct.id}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all',
                        form.certificateTemplateId === ct.id ? 'border-primary bg-primary/5' : 'border-border hover:border-foreground/20',
                      )}
                    >
                      <input type="radio" name="cert" value={ct.id} checked={form.certificateTemplateId === ct.id} onChange={() => setForm(f => ({ ...f, certificateTemplateId: ct.id }))} className="accent-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-foreground">{ct.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{ct.description}</p>
                      </div>
                      {ct.validityDays ? (
                        <span className="text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shrink-0">{ct.validityDays}д. действия</span>
                      ) : (
                        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">Бессрочный</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ══ STEP 3 — SKILLS & XP ══════════════════════════════════════ */}
          {step === 3 && (
            <>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[12px] font-semibold text-foreground">Навыки при завершении</label>
                  <button
                    type="button"
                    onClick={addSkill}
                    disabled={form.skillEntries.length >= skills.length}
                    className={cn(
                      'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all',
                      form.skillEntries.length >= skills.length
                        ? 'opacity-40 cursor-not-allowed border-border text-muted-foreground'
                        : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
                    )}
                  >
                    <Plus className="w-3 h-3" /> Добавить навык
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground mb-4">
                  Выберите навыки, по которым обучающиеся получат XP после завершения курса.
                </p>

                {form.skillEntries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 rounded-xl border border-dashed border-border bg-secondary/40 gap-3">
                    <div className="w-10 h-10 rounded-full bg-border/60 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-[12px] text-muted-foreground text-center max-w-50">
                      Навыки не добавлены. Нажмите <span className="font-semibold text-foreground">Добавить навык</span> для начала.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {form.skillEntries.map((entry, i) => {
                      const usedIds = form.skillEntries.filter((_, idx) => idx !== i).map(e => e.skillId)
                      const availableSkills = skills.filter(s => !usedIds.includes(s.id))
                      const currentSkill = skills.find(s => s.id === entry.skillId)
                      return (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-secondary/40">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-lg leading-none shrink-0">{currentSkill?.icon ?? '🎯'}</span>
                            <select
                              value={entry.skillId}
                              onChange={e => updateSkillEntry(i, { skillId: e.target.value })}
                              className="flex-1 min-w-0 bg-card border border-border rounded-lg px-2 py-1.5 text-[12px] font-medium text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                            >
                              {availableSkills.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <input
                              type="number"
                              min={1}
                              max={500}
                              value={entry.xp}
                              onChange={e => updateSkillEntry(i, { xp: Math.min(500, Math.max(1, Number(e.target.value))) })}
                              className="w-16 bg-card border border-border rounded-lg px-2 py-1.5 text-[12px] font-bold text-foreground text-center outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                            />
                            <span className="text-[11px] text-muted-foreground font-medium">XP</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSkill(i)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 border border-border transition-colors shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}

                {form.skillEntries.length > 0 && (
                  <div className="mt-4 rounded-xl bg-primary/5 border border-primary/15 px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-[12px] font-semibold text-foreground">
                        {form.skillEntries.length} навык{form.skillEntries.length === 1 ? '' : form.skillEntries.length < 5 ? 'а' : 'ов'} выбрано
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Обучающийся получит <span className="font-bold text-primary">{form.skillEntries.reduce((s, e) => s + e.xp, 0)} XP</span> за завершение
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {form.skillEntries.map((e, i) => {
                        const s = skills.find(sk => sk.id === e.skillId)
                        return <span key={i} className="text-base leading-none">{s?.icon}</span>
                      })}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-2 px-6 py-4 border-t border-border shrink-0">
          {submitError && (
            <p className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {submitError}
            </p>
          )}
          <div className="flex items-center justify-between gap-2">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(s => (s - 1) as Step)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent border border-border transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Назад
            </button>
          ) : (
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent border border-border transition-colors"
            >
              Отмена
            </button>
          )}

          {step < STEPS.length ? (
            <button
              type="button"
              disabled={step === 1 && !step1Valid}
              onClick={() => setStep(s => (s + 1) as Step)}
              className={cn(
                'flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-nav-pill hover:opacity-90 transition-all shadow-sm',
                step === 1 && !step1Valid && 'opacity-50 cursor-not-allowed',
              )}
            >
              Продолжить <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={!canSubmit || loading}
              onClick={handleSubmit}
              className={cn(
                'flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-nav-pill hover:opacity-90 transition-all shadow-sm',
                (!canSubmit || loading) && 'opacity-60 cursor-not-allowed',
              )}
            >
              {loading ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Создание…</>
              ) : (
                <><Check className="w-4 h-4" /> Создать курс</>
              )}
            </button>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}

