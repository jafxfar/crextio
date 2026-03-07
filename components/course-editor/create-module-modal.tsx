'use client'

import { useState } from 'react'
import { X, Layers, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EditorModule } from '@/lib/course-editor-types'

interface CreateModuleModalProps {
  open: boolean
  position: number
  onClose: () => void
  onCreate: (module: EditorModule) => void
}

export function CreateModuleModal({ open, position, onClose, onCreate }: CreateModuleModalProps) {
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)

    setTimeout(() => {
      const newModule: EditorModule = {
        id: Date.now(),
        title: title.trim(),
        position,
        maxPoints: 0,
        userPoints: 0,
        chapters: [],
      }
      setLoading(false)
      setTitle('')
      onCreate(newModule)
      onClose()
    }, 400)
  }

  function handleClose() {
    setTitle('')
    onClose()
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
              <Layers className="w-4 h-4 text-foreground" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-foreground leading-tight">Новый модуль</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">Модуль {position}</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-foreground mb-1.5">
              Заголовок <span className="text-red-500">*</span>
            </label>
            <input
              autoFocus
              type="text"
              placeholder="e.g. Ввод-вывод данных"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent border border-border transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={!title.trim() || loading}
              className={cn(
                'flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-nav-pill hover:opacity-90 transition-all shadow-sm',
                (!title.trim() || loading) && 'opacity-60 cursor-not-allowed',
              )}
            >
              {loading ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> загрузка</>
              ) : (
                'Создать модуль'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
