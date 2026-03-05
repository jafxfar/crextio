'use client'

import { useState } from 'react'
import {
  HelpCircle, Plus, Trash2, GripVertical,
  Check, Circle, CheckSquare, ListOrdered,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type {
  EditorStep,
  EditorQuestion,
  QuestionType,
  ChoiceOption,
  OrderingOption,
  QuestionPayload,
} from '@/lib/course-editor-types'
import { EditorHeader } from '../step-editor-header'

// ─── Constants ────────────────────────────────────────────────────────────────

const Q_TYPES: {
  value: QuestionType
  label: string
  icon: React.ElementType
  desc: string
  accent: string
}[] = [
  {
    value: 'SINGLE_CHOICE',
    label: 'Single Choice',
    icon: Circle,
    desc: 'Exactly one correct answer',
    accent: 'bg-blue-500/15 text-blue-600 border-blue-200',
  },
  {
    value: 'MULTIPLE_CHOICE',
    label: 'Multiple Choice',
    icon: CheckSquare,
    desc: 'One or more correct answers',
    accent: 'bg-violet-500/15 text-violet-600 border-violet-200',
  },
  {
    value: 'POSITIONING',
    label: 'Ordering',
    icon: ListOrdered,
    desc: 'Arrange items in correct sequence',
    accent: 'bg-amber-500/15 text-amber-600 border-amber-200',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

let _optId = Date.now()
function nextId() { return ++_optId }

function defaultPayload(type: QuestionType): QuestionPayload {
  if (type === 'POSITIONING') {
    return {
      type: 'POSITIONING',
      options: [
        { id: nextId(), text: '', correctOrder: 1 },
        { id: nextId(), text: '', correctOrder: 2 },
        { id: nextId(), text: '', correctOrder: 3 },
      ],
    }
  }
  return {
    type,
    options: [
      { id: nextId(), text: '', isCorrect: false },
      { id: nextId(), text: '', isCorrect: false },
    ],
  } as QuestionPayload
}

function newQuestion(): EditorQuestion {
  return {
    id: nextId(),
    moduleId: 0,
    type: 'SINGLE_CHOICE',
    questionText: '',
    points: 10,
    payload: defaultPayload('SINGLE_CHOICE'),
  }
}

// ─── Top-level: 1 step = 1 question ──────────────────────────────────────────

interface QuizStepEditorProps {
  step: EditorStep
  onBack: () => void
  onChange: (s: EditorStep) => void
}

export function QuizStepEditor({ step, onBack, onChange }: QuizStepEditorProps) {
  // Always exactly one question
  const question: EditorQuestion = step.data.questions?.[0] ?? newQuestion()

  function setQuestion(updated: EditorQuestion) {
    onChange({
      ...step,
      points: updated.points,
      data: { ...step.data, questions: [updated] },
    })
  }

  function changeType(type: QuestionType) {
    setQuestion({ ...question, type, payload: defaultPayload(type) })
  }

  function patch(partial: Partial<EditorQuestion>) {
    setQuestion({ ...question, ...partial })
  }

  const qType = Q_TYPES.find((t) => t.value === question.type)!

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <EditorHeader
        step={{ ...step, points: question.points }}
        onBack={onBack}
        accentIcon={HelpCircle}
        accentClass="bg-amber-500/20 text-amber-600"
        onSave={() => onChange({ ...step, points: question.points, data: { ...step.data, questions: [question] } })}
      />

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        {/* Section: question type */}
        <div className="px-5 py-4 border-b border-border">
          <p className={labelCls + ' mb-2'}>Question Type</p>
          <div className="grid grid-cols-3 gap-2">
            {Q_TYPES.map((qt) => {
              const QtIcon = qt.icon
              const active = question.type === qt.value
              return (
                <button
                  key={qt.value}
                  type="button"
                  onClick={() => changeType(qt.value)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 text-center transition-all',
                    active
                      ? cn('border-current', qt.accent)
                      : 'border-border bg-secondary/40 text-muted-foreground hover:bg-secondary hover:border-foreground/20',
                  )}
                >
                  <QtIcon className="w-4 h-4" />
                  <span className="text-[11px] font-bold leading-tight">{qt.label}</span>
                  <span className="text-[9px] opacity-70 leading-snug">{qt.desc}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Section: question text */}
        <div className="px-5 py-4 border-b border-border space-y-2">
          <p className={labelCls}>Question Text</p>
          <textarea
            rows={3}
            className={cn(inputCls, 'resize-y min-h-16')}
            value={question.questionText}
            onChange={(e) => patch({ questionText: e.target.value })}
            placeholder="Type your question here…"
          />
        </div>

        {/* Section: options */}
        <div className="px-5 py-4 border-b border-border">
          {question.payload.type === 'SINGLE_CHOICE' && (
            <ChoiceOptionsEditor
              options={question.payload.options}
              mode="single"
              onChange={(opts) => patch({ payload: { type: 'SINGLE_CHOICE', options: opts } })}
            />
          )}
          {question.payload.type === 'MULTIPLE_CHOICE' && (
            <ChoiceOptionsEditor
              options={question.payload.options}
              mode="multiple"
              onChange={(opts) => patch({ payload: { type: 'MULTIPLE_CHOICE', options: opts } })}
            />
          )}
          {question.payload.type === 'POSITIONING' && (
            <OrderingOptionsEditor
              options={question.payload.options}
              onChange={(opts) => patch({ payload: { type: 'POSITIONING', options: opts } })}
            />
          )}
        </div>

        {/* Section: points + result note */}
        <div className="px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            Results shown after course completion
          </div>

          <div className="flex items-center gap-2">
            <span className={labelCls}>Points</span>
            <button
              type="button"
              onClick={() => patch({ points: Math.max(0, question.points - 5) })}
              className="w-7 h-7 rounded-lg border border-border bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all font-bold text-sm"
            >
              −
            </button>
            <input
              type="number"
              min={0}
              max={1000}
              value={question.points}
              onChange={(e) => patch({ points: Math.max(0, Number(e.target.value)) })}
              className="w-16 text-center px-2 py-1.5 rounded-xl border border-border bg-background text-[13px] font-bold text-foreground outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
            <button
              type="button"
              onClick={() => patch({ points: question.points + 5 })}
              className="w-7 h-7 rounded-lg border border-border bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all font-bold text-sm"
            >
              +
            </button>
            <span className="text-[12px] text-muted-foreground">pts</span>
          </div>
        </div>
      </div>

      {/* Type badge below */}
      <div className={cn(
        'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[12px] font-semibold w-fit',
        qType.accent,
      )}>
        <qType.icon className="w-3.5 h-3.5" />
        {qType.label}
        <span className="font-normal opacity-70">— 1 step, 1 question</span>
      </div>
    </div>
  )
}

// ─── Choice options editor (SINGLE / MULTIPLE) ────────────────────────────────

function ChoiceOptionsEditor({
  options,
  mode,
  onChange,
}: {
  options: ChoiceOption[]
  mode: 'single' | 'multiple'
  onChange: (opts: ChoiceOption[]) => void
}) {
  function addOption() {
    onChange([...options, { id: nextId(), text: '', isCorrect: false }])
  }

  function removeOption(idx: number) {
    onChange(options.filter((_, i) => i !== idx))
  }

  function updateText(idx: number, text: string) {
    onChange(options.map((o, i) => (i === idx ? { ...o, text } : o)))
  }

  function toggleCorrect(idx: number) {
    if (mode === 'single') {
      onChange(options.map((o, i) => ({ ...o, isCorrect: i === idx })))
    } else {
      onChange(options.map((o, i) => (i === idx ? { ...o, isCorrect: !o.isCorrect } : o)))
    }
  }

  const correctCount = options.filter((o) => o.isCorrect).length

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className={labelCls}>
          {mode === 'single' ? 'Options · click radio to mark correct' : 'Options · check all correct answers'}
        </p>
        {mode === 'multiple' && correctCount === 0 && (
          <span className="text-[10px] text-amber-600 font-semibold">No correct answer selected</span>
        )}
      </div>

      <div className="space-y-2">
        {options.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx)
          return (
            <div
              key={opt.id}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all',
                opt.isCorrect
                  ? 'border-emerald-300 bg-emerald-50'
                  : 'border-border bg-secondary/30 hover:bg-secondary/60',
              )}
            >
              <span className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 select-none',
                opt.isCorrect ? 'bg-emerald-500 text-white' : 'bg-secondary text-muted-foreground',
              )}>
                {letter}
              </span>

              <input
                className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground outline-none min-w-0"
                value={opt.text}
                onChange={(e) => updateText(idx, e.target.value)}
                placeholder={`Option ${letter}`}
              />

              <button
                type="button"
                onClick={() => toggleCorrect(idx)}
                className={cn(
                  'shrink-0 flex items-center justify-center transition-all',
                  mode === 'single'
                    ? cn('w-4 h-4 rounded-full border-2', opt.isCorrect ? 'border-emerald-500 bg-emerald-500' : 'border-border bg-background hover:border-emerald-300')
                    : cn('w-4 h-4 rounded border-2',      opt.isCorrect ? 'border-emerald-500 bg-emerald-500' : 'border-border bg-background hover:border-emerald-300'),
                )}
                aria-label={opt.isCorrect ? 'Unmark correct' : 'Mark correct'}
              >
                {opt.isCorrect && <Check className="w-2.5 h-2.5 text-white" />}
              </button>

              <button
                type="button"
                onClick={() => removeOption(idx)}
                disabled={options.length <= 2}
                className="shrink-0 w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-red-500 disabled:opacity-20 transition-colors"
                aria-label="Remove option"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={addOption}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-border text-[12px] text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-secondary transition-all"
      >
        <Plus className="w-3.5 h-3.5" /> Add option
      </button>
    </div>
  )
}

// ─── Ordering options editor (POSITIONING) ────────────────────────────────────

function OrderingOptionsEditor({
  options,
  onChange,
}: {
  options: OrderingOption[]
  onChange: (opts: OrderingOption[]) => void
}) {
  const [dragIdx, setDragIdx]       = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)

  const sorted = [...options].sort((a, b) => a.correctOrder - b.correctOrder)

  function updateText(correctOrder: number, text: string) {
    onChange(options.map((o) => (o.correctOrder === correctOrder ? { ...o, text } : o)))
  }

  function addItem() {
    const maxOrder = options.reduce((m, o) => Math.max(m, o.correctOrder), 0)
    onChange([...options, { id: nextId(), text: '', correctOrder: maxOrder + 1 }])
  }

  function removeItem(correctOrder: number) {
    onChange(
      options
        .filter((o) => o.correctOrder !== correctOrder)
        .map((o, i) => ({ ...o, correctOrder: i + 1 })),
    )
  }

  function handleDragStart(idx: number) { setDragIdx(idx) }
  function handleDragOver(e: React.DragEvent, idx: number) { e.preventDefault(); setDragOverIdx(idx) }
  function handleDrop(e: React.DragEvent, idx: number) {
    e.preventDefault()
    if (dragIdx === null || dragIdx === idx) { setDragIdx(null); setDragOverIdx(null); return }
    const reordered = [...sorted]
    const [moved] = reordered.splice(dragIdx, 1)
    reordered.splice(idx, 0, moved)
    onChange(reordered.map((o, i) => ({ ...o, correctOrder: i + 1 })))
    setDragIdx(null); setDragOverIdx(null)
  }
  function handleDragEnd() { setDragIdx(null); setDragOverIdx(null) }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className={labelCls}>Items — drag to define the correct order</p>
        <span className="text-[10px] text-muted-foreground">Learners will see these shuffled</span>
      </div>

      <div className="space-y-2">
        {sorted.map((opt, idx) => (
          <div
            key={opt.id}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDrop={(e) => handleDrop(e, idx)}
            onDragEnd={handleDragEnd}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all cursor-grab',
              dragIdx === idx ? 'opacity-40' : '',
              dragOverIdx === idx ? 'border-primary bg-primary/10 shadow-sm' : 'border-border bg-secondary/30 hover:bg-secondary/60',
            )}
          >
            <GripVertical className="w-4 h-4 text-muted-foreground/50 shrink-0" />
            <span className="w-6 h-6 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-[11px] font-bold text-amber-700 shrink-0 select-none">
              {opt.correctOrder}
            </span>
            <input
              className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground outline-none min-w-0"
              value={opt.text}
              onChange={(e) => updateText(opt.correctOrder, e.target.value)}
              placeholder={`Item ${opt.correctOrder}`}
            />
            <button
              type="button"
              onClick={() => removeItem(opt.correctOrder)}
              disabled={options.length <= 2}
              className="shrink-0 w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-red-500 disabled:opacity-20 transition-colors"
              aria-label="Remove item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-border text-[12px] text-muted-foreground hover:text-foreground hover:border-amber-400 hover:bg-amber-50/50 transition-all"
      >
        <Plus className="w-3.5 h-3.5" /> Add item
      </button>

      <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-700">
        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        The numbered order above is the <strong>correct answer</strong>. Learners will see items in a random order.
      </div>
    </div>
  )
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const labelCls = 'text-[11px] font-semibold text-muted-foreground uppercase tracking-wide'
const inputCls =
  'w-full px-3 py-2 rounded-[10px] border border-border bg-background text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow'

