'use client'

import { useState } from 'react'
import { X, Loader2, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createEmployee, type EmployeeRole, type CreateEmployeeRequest } from '@/lib/users-api'
import { departments } from '@/lib/data'

interface CreateUserModalProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

interface FormState {
  name: string
  email: string
  password: string
  department_id: number
  role: EmployeeRole
}

const ROLE_OPTIONS: { value: EmployeeRole; label: string }[] = [
  { value: 'employee', label: 'Сотрудник' },
  { value: 'manager', label: 'Менеджер' },
  { value: 'admin', label: 'Администратор' },
]

const INITIAL_FORM: FormState = {
  name: '',
  email: '',
  password: '',
  department_id: 0,
  role: 'employee',
}

export function CreateUserModal({ open, onClose, onCreated }: CreateUserModalProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  function handleChange(field: keyof FormState, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (error) setError(null)
  }

  function handleClose() {
    setForm(INITIAL_FORM)
    setError(null)
    onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    setLoading(true)
    setError(null)

    const payload: CreateEmployeeRequest = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      department_id: Number(form.department_id) || 0,
      role: form.role,
    }

    try {
      await createEmployee(payload)
      handleClose()
      onCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при создании пользователя')
    } finally {
      setLoading(false)
    }
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleClose}
    >
      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl shadow-black/10 border border-border"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-foreground text-background">
              <UserPlus className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-foreground leading-tight">Новый пользователь</h2>
              <p className="text-xs text-muted-foreground">Заполните данные сотрудника</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-colors rounded-lg p-1"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Name */}
          <Field label="Полное имя">
            <input
              type="text"
              required
              placeholder="Иванов Иван Иванович"
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              className={inputClass}
            />
          </Field>

          {/* Email */}
          <Field label="Эл. почта">
            <input
              type="email"
              required
              placeholder="ivanov@company.ru"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              className={inputClass}
            />
          </Field>

          {/* Password */}
          <Field label="Пароль">
            <input
              type="password"
              required
              minLength={6}
              placeholder="Минимум 6 символов"
              value={form.password}
              onChange={e => handleChange('password', e.target.value)}
              className={inputClass}
            />
          </Field>

          {/* Department + Role side by side */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Отдел">
              <select
                required
                value={form.department_id}
                onChange={e => handleChange('department_id', e.target.value)}
                className={cn(inputClass, 'cursor-pointer')}
              >
                <option value="" disabled>Выберите...</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Роль">
              <select
                value={form.role}
                onChange={e => handleChange('role', e.target.value as EmployeeRole)}
                className={cn(inputClass, 'cursor-pointer')}
              >
                {ROLE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Error */}
          {error && (
            <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-xl border border-border bg-secondary text-sm font-medium text-foreground py-2.5 hover:bg-secondary/70 transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className={cn(
                'flex-1 rounded-xl bg-foreground text-background text-sm font-semibold py-2.5 transition-all',
                'hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed',
                'flex items-center justify-center gap-2',
              )}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Создание...</>
              ) : (
                'Создать'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputClass = cn(
  'w-full rounded-xl border border-border bg-secondary/40 px-3.5 py-2.5 text-sm text-foreground',
  'placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 transition',
)

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  )
}
