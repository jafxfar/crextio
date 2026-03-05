'use client'

import { useState, useRef } from 'react'
import { Sparkles, ArrowUp, Loader2, AlertCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Gemini helper (via server route) ────────────────────────────────────────

async function generateContent(prompt: string): Promise<string> {
  const res = await fetch('/api/ai-generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data?.error ?? `HTTP ${res.status}`)
  }

  return data.html ?? ''
}

// ─── Suggestion chips ─────────────────────────────────────────────────────────

const CHIPS = [
  'Explain this concept',
  'Write a summary',
  'Key points list',
  'Real-world example',
  'Write an introduction',
]

// ─── Props ────────────────────────────────────────────────────────────────────

interface AiPromptInputProps {
  onInsert: (html: string) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AiPromptInput({ onInsert }: AiPromptInputProps) {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleGenerate() {
    const trimmed = prompt.trim()
    if (!trimmed || loading) return
    setLoading(true)
    setError(null)
    try {
      const html = await generateContent(trimmed)
      onInsert(html)
      setPrompt('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleGenerate()
  }

  const hasPrompt = prompt.trim().length > 0

  return (
    <div className="border-b border-border bg-violet-50/60 dark:bg-violet-950/20">
      {/* Main input row */}
      <div className="flex items-center gap-2 px-4 py-2.5">
        {/* Icon badge */}
        <div className="shrink-0 w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-violet-600" />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={prompt}
          onChange={(e) => { setPrompt(e.target.value); setError(null) }}
          onKeyDown={handleKeyDown}
          placeholder="Ask AI to generate content… (Press Enter)"
          disabled={loading}
          className={cn(
            'flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-50',
          )}
        />

        {/* Clear */}
        {hasPrompt && !loading && (
          <button
            type="button"
            onClick={() => { setPrompt(''); inputRef.current?.focus() }}
            className="shrink-0 w-5 h-5 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Send */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!hasPrompt || loading}
          className={cn(
            'shrink-0 flex items-center gap-1.5 h-7 px-3 rounded-lg text-[11px] font-semibold transition-all',
            hasPrompt && !loading
              ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm shadow-violet-500/25'
              : 'bg-violet-200/50 text-violet-400 cursor-not-allowed dark:bg-violet-900/30',
          )}
        >
          {loading
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <ArrowUp className="w-3.5 h-3.5" />
          }
          {loading ? 'Generating…' : 'Generate'}
        </button>
      </div>

      {/* Chips row */}
      <div className="flex items-center gap-1.5 px-4 pb-2.5 flex-wrap">
        <span className="text-[10px] text-muted-foreground font-medium mr-1 shrink-0">Try:</span>
        {CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => { setPrompt(chip); inputRef.current?.focus() }}
            disabled={loading}
            className="px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800 text-[10px] font-medium text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/60 transition-all disabled:opacity-40"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Error row */}
      {error && (
        <div className="flex items-start gap-2 px-4 pb-2.5 text-[11px] text-red-600">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          {error}
        </div>
      )}
    </div>
  )
}
