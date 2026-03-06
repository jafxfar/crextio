'use client'

import { useState, useCallback } from 'react'
import {
  Layers,
  Sparkles,
  Loader2,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EditorStep, FlashCard } from '@/lib/course-editor-types'

// ─── Source builder ───────────────────────────────────────────────────────────
// Collects relevant text/URL from each step to send to the API.

function buildStepSources(steps: EditorStep[]) {
  return steps.map((s) => {
    const source: {
      title: string
      type: string
      text?: string
      url?: string
    } = { title: s.title, type: s.type }

    if (s.type === 'info' && s.data.content) {
      const plain = s.data.content
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim()
        .slice(0, 3000)
      if (plain.length > 0) source.text = plain
    }

    if (s.type === 'file'  && s.data.fileUrl)  source.url = s.data.fileUrl
    if (s.type === 'video' && s.data.videoUrl) source.url = s.data.videoUrl

    // Always include the title as fallback so Gemini has something to work with
    // even when the body hasn't been filled in yet.
    if (!source.text && !source.url) {
      source.text = `Step title: ${s.title}`
    }

    return source
  })
}

// ─── Loading steps ────────────────────────────────────────────────────────────

const LOADING_STEPS = [
  { label: 'Reading step content…',    duration: 1600 },
  { label: 'Analysing key concepts…',  duration: 3000 },
  { label: 'Creating flashcards…',     duration: 2000 },
]

// ─── Props ────────────────────────────────────────────────────────────────────

interface FlashcardGeneratorPanelProps {
  chapterTitle: string
  steps: EditorStep[]
  /** Called when cards are generated or updated */
  onCardsGenerated: (cards: FlashCard[]) => void
  /** Already-saved cards (shows viewer without regenerating) */
  initialCards?: FlashCard[]
}

// ─── Flash card viewer ────────────────────────────────────────────────────────

function FlashCardViewer({
  cards,
  onRegenerate,
}: {
  cards: FlashCard[]
  onRegenerate: () => void
}) {
  const [current, setCurrent]   = useState(0)
  const [flipped,  setFlipped]  = useState(false)
  const [done,     setDone]     = useState<Set<number>>(new Set())

  const card = cards[current]

  const goNext = useCallback(() => {
    setFlipped(false)
    setTimeout(() => setCurrent((c) => Math.min(c + 1, cards.length - 1)), 120)
  }, [cards.length])

  const goPrev = useCallback(() => {
    setFlipped(false)
    setTimeout(() => setCurrent((c) => Math.max(c - 1, 0)), 120)
  }, [])

  function toggleDone(idx: number) {
    setDone((d) => {
      const next = new Set(d)
      next.has(idx) ? next.delete(idx) : next.add(idx)
      return next
    })
  }

  return (
    <div className="px-5 pb-5 flex flex-col gap-4">
      {/* Progress */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-0.5">
          {cards.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1 flex-1 rounded-full transition-all duration-300',
                done.has(i)
                  ? 'bg-green-500'
                  : i === current
                  ? 'bg-violet-400'
                  : 'bg-violet-400/15',
              )}
            />
          ))}
        </div>
        <span className="text-[11px] font-semibold text-muted-foreground tabular-nums shrink-0">
          {current + 1} / {cards.length}
        </span>
        {done.size === cards.length && (
          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
        )}
      </div>

      {/* Card */}
      <div
        className="relative cursor-pointer select-none"
        onClick={() => setFlipped((f) => !f)}
        style={{ perspective: '1000px' }}
      >
        <div
          className="relative transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            minHeight: '160px',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center px-6 py-8 bg-violet-500 rounded-2xl text-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <p className="text-[11px] font-semibold text-background/40 uppercase tracking-widest mb-3">
              Question
            </p>
            <p className="text-[16px] font-bold text-background leading-snug">{card?.front}</p>
            <p className="text-[11px] text-background/30 mt-4">Tap to reveal answer</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center px-6 py-8 bg-card border-2 border-foreground/10 rounded-2xl text-center"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              Answer
            </p>
            <p className="text-[14px] text-foreground leading-relaxed">{card?.back}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={goPrev}
          disabled={current === 0}
          className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 transition-all"
          aria-label="Previous card"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => toggleDone(current)}
          className={cn(
            'flex-1 py-2 rounded-xl text-[12px] font-semibold border transition-all',
            done.has(current)
              ? 'bg-green-500/10 border-green-300 text-green-700 dark:text-green-400 dark:border-green-700'
              : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground hover:bg-accent',
          )}
        >
          {done.has(current) ? '✓ Got it' : 'Mark as done'}
        </button>

        <button
          type="button"
          onClick={goNext}
          disabled={current === cards.length - 1}
          className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 transition-all"
          aria-label="Next card"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* All cards grid */}
      <div className="border-t border-border pt-4">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          All cards ({cards.length})
        </p>
        <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1">
          {cards.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => { setCurrent(i); setFlipped(false) }}
              className={cn(
                'flex items-start gap-3 p-3 rounded-xl border text-left transition-all',
                i === current
                  ? 'border-violet-400 bg-violet-50/60 dark:bg-violet-900/20'
                  : done.has(i)
                  ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20'
                  : 'border-border hover:border-foreground/20 hover:bg-accent/50',
              )}
            >
              <span className="shrink-0 w-5 h-5 rounded-md bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-[10px] font-bold text-violet-600 dark:text-violet-400 mt-px">
                {i + 1}
              </span>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[12px] font-semibold text-foreground truncate">{c.front}</span>
                <span className="text-[11px] text-muted-foreground line-clamp-2">{c.back}</span>
              </div>
              {done.has(i) && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 ml-auto mt-px" />}
            </button>
          ))}
        </div>
      </div>

      {/* Regenerate */}
      <button
        type="button"
        onClick={onRegenerate}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-border text-[12px] font-semibold text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-accent transition-all"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Regenerate flashcards
      </button>
    </div>
  )
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export function FlashcardGeneratorPanel({
  chapterTitle,
  steps,
  onCardsGenerated,
  initialCards,
}: FlashcardGeneratorPanelProps) {
  const [cards,       setCards]       = useState<FlashCard[] | null>(initialCards ?? null)
  const [loading,     setLoading]     = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [error,       setError]       = useState<string | null>(null)

  const stepTimers = useState<ReturnType<typeof setTimeout>[]>([])[0]

  // We can generate as long as there's at least one step in the chapter
  const canGenerate = steps.length > 0

  // ── Loading animation ─────────────────────────────────────────────────────

  function startLoadingAnimation() {
    setLoadingStep(0)
    let elapsed = 0
    LOADING_STEPS.forEach((step, i) => {
      if (i === 0) return
      elapsed += LOADING_STEPS[i - 1].duration
      const t = setTimeout(() => setLoadingStep(i), elapsed)
      stepTimers.push(t)
    })
  }

  function clearLoadingAnimation() {
    stepTimers.forEach(clearTimeout)
    stepTimers.length = 0
  }

  // ── Generate ──────────────────────────────────────────────────────────────

  async function handleGenerate() {
    if (!canGenerate || loading) return
    setLoading(true)
    setError(null)
    setCards(null)
    startLoadingAnimation()

    try {
      const sources = buildStepSources(steps)
      const res = await fetch('/api/ai-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterTitle, steps: sources }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`)

      const generated: FlashCard[] = data.cards
      setCards(generated)
      onCardsGenerated(generated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Flashcard generation failed.')
    } finally {
      clearLoadingAnimation()
      setLoading(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-sm">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3.5 bg-violet-500">
        <div className="shrink-0 w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
          <Layers className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-white leading-none">Flashcards</p>
          <p className="text-[11px] text-white/50 mt-0.5">
            {cards
              ? `${cards.length} cards generated from ${steps.length} step${steps.length !== 1 ? 's' : ''}`
              : `Gemini will analyse ${steps.length} step${steps.length !== 1 ? 's' : ''} and create study cards`}
          </p>
        </div>
        {/* Step sources badge */}
        <div className="flex gap-1 shrink-0">
          {steps.slice(0, 5).map((s) => {
            const icons = {
              info:  '📝',
              file:  '📄',
              video: '🎬',
              quiz:  '❓',
            } as Record<string, string>
            return (
              <span
                key={s.id}
                title={s.title}
                className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-[11px]"
              >
                {icons[s.type] ?? '📝'}
              </span>
            )
          })}
          {steps.length > 5 && (
            <span className="text-[10px] text-white/40 self-center ml-1">
              +{steps.length - 5}
            </span>
          )}
        </div>
      </div>

      {/* No steps warning — only when chapter has zero steps */}
      {!canGenerate && (
        <div className="px-5 py-4">
          <div className="flex items-start gap-2 px-3.5 py-3 rounded-xl bg-secondary border border-border text-muted-foreground">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <p className="text-[12px]">
              Add at least one step to this chapter to enable flashcard generation.
            </p>
          </div>
        </div>
      )}

      {/* Generate button */}
      {canGenerate && !cards && !loading && (
        <div className="px-5 py-4">
          <button
            type="button"
            onClick={handleGenerate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-500 text-white text-[13px] font-bold hover:opacity-90 transition-all shadow-sm shadow-violet-500/25"
          >
            <Sparkles className="w-4 h-4" />
            Generate Flashcards
          </button>
          <p className="text-[11px] text-muted-foreground mt-2">
            NotebookLM-style • {steps.length} step{steps.length !== 1 ? 's' : ''} → 6–12 study cards
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="px-5 py-4">
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-secondary border border-border">
            <div className="relative w-8 h-8 shrink-0">
              <Loader2 className="w-8 h-8 text-foreground/20 animate-spin absolute inset-0" />
              <Layers className="w-4 h-4 text-foreground absolute inset-0 m-auto" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-foreground">
                {LOADING_STEPS[loadingStep]?.label}
              </p>
              <div className="flex gap-1 mt-1.5">
                {LOADING_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1 rounded-full flex-1 transition-all duration-500',
                      i <= loadingStep ? 'bg-violet-400' : 'bg-violet-400/20',
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mx-5 mb-4 flex items-start gap-2 px-3.5 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span className="text-[12px] flex-1">{error}</span>
          <button type="button" onClick={() => setError(null)} aria-label="Dismiss">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Viewer */}
      {cards && cards.length > 0 && (
        <FlashCardViewer
          cards={cards}
          onRegenerate={() => { setCards(null); handleGenerate() }}
        />
      )}
    </div>
  )
}
