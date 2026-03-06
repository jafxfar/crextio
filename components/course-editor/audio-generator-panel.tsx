'use client'

import { useState, useRef, useCallback } from 'react'
import {
  Headphones,
  Loader2,
  Play,
  Pause,
  Download,
  AlertCircle,
  X,
  Volume2,
  ChevronDown,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Voice options ────────────────────────────────────────────────────────────

interface VoiceOption {
  name: string
  label: string
  languageCode: string
  flag: string
}

const VOICE_OPTIONS: VoiceOption[] = [
  { name: 'en-US-Neural2-F',  label: 'English (Female)',   languageCode: 'en-US', flag: '🇺🇸' },
  { name: 'en-US-Neural2-D',  label: 'English (Male)',     languageCode: 'en-US', flag: '🇺🇸' },
  { name: 'en-GB-Neural2-C',  label: 'British (Female)',   languageCode: 'en-GB', flag: '🇬🇧' },
  { name: 'en-GB-Neural2-B',  label: 'British (Male)',     languageCode: 'en-GB', flag: '🇬🇧' },
  { name: 'ru-RU-Wavenet-C',  label: 'Русский (Женский)',  languageCode: 'ru-RU', flag: '🇷🇺' },
  { name: 'ru-RU-Wavenet-B',  label: 'Русский (Мужской)', languageCode: 'ru-RU', flag: '🇷🇺' },
  { name: 'kk-KZ-Standard-A', label: 'Қазақша',           languageCode: 'kk-KZ', flag: '🇰🇿' },
  { name: 'de-DE-Neural2-F',  label: 'Deutsch (Weiblich)', languageCode: 'de-DE', flag: '🇩🇪' },
  { name: 'fr-FR-Neural2-E',  label: 'Français (Femme)',   languageCode: 'fr-FR', flag: '🇫🇷' },
  { name: 'es-ES-Neural2-A',  label: 'Español (Mujer)',    languageCode: 'es-ES', flag: '🇪🇸' },
]

// ─── Loading steps ────────────────────────────────────────────────────────────

const LOADING_STEPS = [
  { label: 'Analysing source…',     duration: 1800 },
  { label: 'Generating narration…', duration: 3500 },
  { label: 'Converting to audio…',  duration: 2500 },
]

// ─── API helper ───────────────────────────────────────────────────────────────

async function requestAudio(params: {
  html?: string
  url?: string
  voice: VoiceOption
}): Promise<string> {
  const body: Record<string, string> = {
    voice: params.voice.name,
    languageCode: params.voice.languageCode,
  }
  if (params.url)  body.url  = params.url
  if (params.html) body.html = params.html

  const res = await fetch('/api/ai-audio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`)
  return `data:${data.mimeType ?? 'audio/wav'};base64,${data.audio}`
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface AudioGeneratorPanelProps {
  /**
   * HTML content from a Text step — mutually exclusive with `sourceUrl`.
   * The panel will send this as the narration source.
   */
  htmlContent?: string
  /**
   * URL from a File step — mutually exclusive with `htmlContent`.
   * Gemini will fetch & narrate the content at this URL.
   */
  sourceUrl?: string
  /** Called when audio is successfully generated */
  onAudioGenerated?: (dataUrl: string) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AudioGeneratorPanel({
  htmlContent,
  sourceUrl,
  onAudioGenerated,
}: AudioGeneratorPanelProps) {

  // ── Derived source availability ──────────────────────────────────────────
  const hasHtml = (htmlContent ?? '').replace(/<[^>]+>/g, '').trim().length > 0
  const hasUrl  = (sourceUrl ?? '').trim().length > 0
  const canGenerate = !!(hasHtml || hasUrl)

  // ── State ────────────────────────────────────────────────────────────────
  const [loading,       setLoading]       = useState(false)
  const [loadingStep,   setLoadingStep]   = useState(0)
  const [error,         setError]         = useState<string | null>(null)
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(VOICE_OPTIONS[0])
  const [voiceOpen,     setVoiceOpen]     = useState(false)
  const [audioSrc,      setAudioSrc]      = useState<string | null>(null)
  const [isPlaying,     setIsPlaying]     = useState(false)
  const [progress,      setProgress]      = useState(0)
  const [duration,      setDuration]      = useState(0)

  const audioRef    = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const stepTimers  = useRef<ReturnType<typeof setTimeout>[]>([])

  // ── Loading animation ────────────────────────────────────────────────────

  function startLoadingAnimation() {
    setLoadingStep(0)
    let elapsed = 0
    LOADING_STEPS.forEach((_, i) => {
      if (i === 0) return
      elapsed += LOADING_STEPS[i - 1].duration
      const t = setTimeout(() => setLoadingStep(i), elapsed)
      stepTimers.current.push(t)
    })
  }

  function clearLoadingAnimation() {
    stepTimers.current.forEach(clearTimeout)
    stepTimers.current = []
  }

  // ── Playback helpers ─────────────────────────────────────────────────────

  const stopProgress = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  const startProgress = useCallback(() => {
    stopProgress()
    intervalRef.current = setInterval(() => {
      const audio = audioRef.current
      if (!audio) return
      setProgress(audio.currentTime)
    }, 200)
  }, [stopProgress])

  function formatTime(sec: number) {
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  // ── Generate ─────────────────────────────────────────────────────────────

  async function handleGenerate() {
    if (!canGenerate || loading) return
    setLoading(true)
    setError(null)
    setAudioSrc(null)
    setIsPlaying(false)
    setProgress(0)
    setDuration(0)
    stopProgress()
    startLoadingAnimation()

    try {
      const dataUrl = await requestAudio({
        html:  hasHtml ? htmlContent : undefined,
        url:   hasUrl  ? sourceUrl   : undefined,
        voice: selectedVoice,
      })
      setAudioSrc(dataUrl)
      onAudioGenerated?.(dataUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Audio generation failed.')
    } finally {
      clearLoadingAnimation()
      setLoading(false)
    }
  }

  // ── Playback ─────────────────────────────────────────────────────────────

  function handlePlayPause() {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) { audio.pause(); stopProgress(); setIsPlaying(false) }
    else           { audio.play();  startProgress(); setIsPlaying(true)  }
  }

  function handleEnded() { stopProgress(); setIsPlaying(false); setProgress(0) }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current
    if (!audio) return
    const t = Number(e.target.value)
    audio.currentTime = t
    setProgress(t)
  }

  function handleDownload() {
    if (!audioSrc) return
    const a = document.createElement('a')
    a.href = audioSrc
    a.download = 'audio-narration.wav'
    a.click()
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-sm">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3.5 bg-violet-500">
        <div className="shrink-0 w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
          <Volume2 className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-white leading-none">Audio Narration</p>
          <p className="text-[11px] text-white/50 mt-0.5">
            {hasUrl
              ? 'Gemini will read the file and narrate it as a podcast'
              : 'Gemini will narrate the step content as a podcast'}
          </p>
        </div>

        {/* Voice selector */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setVoiceOpen((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/10 text-[12px] font-medium text-white hover:bg-white/20 transition-colors"
          >
            <span>{selectedVoice.flag}</span>
            <span className="hidden sm:inline">{selectedVoice.label}</span>
            <ChevronDown className={cn('w-3 h-3 text-white/50 transition-transform', voiceOpen && 'rotate-180')} />
          </button>

          {voiceOpen && (
            <div className="absolute top-full right-0 mt-1 z-50 bg-popover border border-border rounded-xl shadow-lg overflow-hidden min-w-50">
              {VOICE_OPTIONS.map((v) => (
                <button
                  key={v.name}
                  type="button"
                  onClick={() => { setSelectedVoice(v); setVoiceOpen(false); setAudioSrc(null) }}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 text-[12px] text-left hover:bg-accent transition-colors',
                    selectedVoice.name === v.name && 'bg-accent font-semibold text-foreground',
                  )}
                >
                  <span>{v.flag}</span>
                  <span>{v.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Generate button — shown when source exists and audio not yet generated */}
      {canGenerate && !audioSrc && !loading && (
        <div className="px-5 py-4">
          <button
            type="button"
            onClick={handleGenerate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-500 text-white text-[13px] font-bold hover:opacity-90 transition-all shadow-sm shadow-violet-500/25"
          >
            <Sparkles className="w-4 h-4" />
            Generate Audio Narration
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="px-5 py-4">
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-secondary border border-border">
            <div className="relative w-8 h-8 shrink-0">
              <Loader2 className="w-8 h-8 text-foreground/20 animate-spin absolute inset-0" />
              <Headphones className="w-4 h-4 text-foreground absolute inset-0 m-auto" />
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
                      i <= loadingStep ? 'bg-violet-500' : 'bg-violet-500/20',
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

      {/* Player */}
      {audioSrc && (
        <>
          <audio
            ref={audioRef}
            src={audioSrc}
            onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
            onEnded={handleEnded}
            preload="auto"
          />

          <div className="mx-5 mb-5 rounded-xl bg-violet-500 overflow-hidden">
            {/* Decorative waveform */}
            <div className="flex items-end gap-0.5 px-5 pt-4 pb-2 h-14">
              {Array.from({ length: 48 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex-1 rounded-full transition-all',
                    isPlaying ? 'bg-white/40 animate-pulse' : 'bg-white/20',
                  )}
                  style={{
                    height: `${20 + Math.sin(i * 0.7) * 14 + Math.sin(i * 1.3) * 10}%`,
                    animationDelay: `${(i % 8) * 80}ms`,
                  }}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 px-4 pb-4">
              <button
                type="button"
                onClick={handlePlayPause}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform shrink-0"
              >
                {isPlaying
                  ? <Pause className="w-4 h-4 text-foreground" />
                  : <Play className="w-4 h-4 text-foreground translate-x-px" />
                }
              </button>

              <div className="flex-1 flex flex-col gap-1">
                <input
                  type="range"
                  min={0}
                  max={duration || 1}
                  step={0.1}
                  value={progress}
                  onChange={handleSeek}
                  aria-label="Seek"
                  className="w-full h-1 rounded-full accent-white cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-white/50">
                  <span>{formatTime(progress)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                aria-label="Download MP3"
                title="Download MP3"
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 px-4 py-2.5 flex items-center justify-between">
              <p className="text-[10px] text-white/40">
                {selectedVoice.flag} {selectedVoice.label} · WAV · Gemini TTS
              </p>
              <button
                type="button"
                onClick={() => { setAudioSrc(null); setIsPlaying(false) }}
                className="text-[11px] font-medium text-white/40 hover:text-white/80 transition-colors"
              >
                Regenerate
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

