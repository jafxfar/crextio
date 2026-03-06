'use client'

import { useState, useEffect } from 'react'
import {
  BookOpen,
  Video,
  HelpCircle,
  FileUp,
  PlusCircle,
  GripVertical,
  Trash2,
  CheckCircle2,
  Circle,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  Play,
  Link as LinkIcon,
  AlertCircle,
  Loader2,
  FileText,
  FileImage,
  FileSpreadsheet,
  FileCode,
  FileArchive,
  File,
  Download,
  Check,
} from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { EditorChapter, EditorStep } from '@/lib/course-editor-types'
import { RichTextEditor } from './rich-text-editor'
import { QuizStepEditor } from './step-editors/quiz-step-editor'
import { AudioGeneratorPanel } from './audio-generator-panel'
import { FlashcardGeneratorPanel } from './flashcard-generator-panel'
import { useSave } from '@/hooks/use-save'

const stepMeta = {
  info:  { label: 'Text',  icon: BookOpen,  color: 'bg-blue-500/15 text-blue-600'   },
  video: { label: 'Video', icon: Video,      color: 'bg-purple-500/15 text-purple-600' },
  quiz:  { label: 'Quiz',  icon: HelpCircle, color: 'bg-amber-500/15 text-amber-600'  },
  file:  { label: 'File',  icon: FileUp,     color: 'bg-green-500/15 text-green-600'  },
} as const

type StepMetaKey = keyof typeof stepMeta

function getMeta(type: string) {
  return stepMeta[type as StepMetaKey] ?? stepMeta.info
}

// ─── Step row ────────────────────────────────────────────────────────────────

function StepRow({ step, index, onOpen, onDelete }: {
  step: EditorStep; index: number; onOpen: () => void; onDelete: () => void
}) {
  const meta = getMeta(step.type)
  const Icon = meta.icon
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 bg-card rounded-2xl border border-border shadow-sm group hover:border-foreground/20 transition-all cursor-pointer"
      onClick={onOpen}
    >
      <GripVertical
        className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground/60 shrink-0 cursor-grab"
        onClick={(e) => e.stopPropagation()}
      />
      <span className="w-5 text-center text-[11px] font-bold text-muted-foreground/50 shrink-0 tabular-nums">
        {index + 1}
      </span>
      <div className={cn('w-7 h-7 rounded-xl flex items-center justify-center shrink-0', meta.color)}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="flex flex-col min-w-0 flex-1 gap-0.5">
        <span className="text-[13px] font-semibold text-foreground truncate leading-tight">{step.title}</span>
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide leading-none">{meta.label}</span>
      </div>
      {step.points > 0 && (
        <span className="shrink-0 text-[11px] font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded-lg">
          {step.userPoints}/{step.points} pts
        </span>
      )}
      {step.isAnswered
        ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
        : <Circle className="w-4 h-4 text-muted-foreground/30 shrink-0" />
      }
      <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground shrink-0 transition-colors" />
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onDelete() }}
        className="w-7 h-7 rounded-xl flex items-center justify-center text-muted-foreground/30 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 shrink-0"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

// ─── Add step modal ───────────────────────────────────────────────────────────

const STEP_TYPES: Array<{ type: EditorStep['type']; label: string; icon: React.ElementType; desc: string }> = [
  { type: 'info',  label: 'Text',  icon: BookOpen,  desc: 'Rich text / article content' },
  { type: 'video', label: 'Video', icon: Video,      desc: 'Embed or upload a video'    },
  { type: 'quiz',  label: 'Quiz',  icon: HelpCircle, desc: 'Multiple choice questions'  },
  { type: 'file',  label: 'File',  icon: FileUp,     desc: 'Downloadable resource'      },
]

function AddStepModal({ open, onClose, onCreate }: {
  open: boolean; onClose: () => void; onCreate: (step: EditorStep) => void
}) {
  const [title,  setTitle]  = useState('')
  const [type,   setType]   = useState<EditorStep['type']>('info')
  const [points, setPoints] = useState(0)

  if (!open) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onCreate({ id: Date.now(), title: title.trim(), type, position: 0, points, isAnswered: false, userPoints: 0, data: {} })
    setTitle(''); setType('info'); setPoints(0); onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-[15px] font-bold text-foreground">Add Step</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">Choose a step type and give it a title.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-2">
              {STEP_TYPES.map(({ type: t, label, icon: Icon, desc }) => (
                <button key={t} type="button" onClick={() => setType(t)}
                  className={cn('flex flex-col gap-1 p-3 rounded-xl border-2 text-left transition-all',
                    type === t ? 'border-foreground bg-foreground/5' : 'border-border hover:border-foreground/30 hover:bg-accent/40')}>
                  <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center mb-0.5', getMeta(t).color)}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[12px] font-bold text-foreground">{label}</span>
                  <span className="text-[10px] text-muted-foreground leading-snug">{desc}</span>
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-foreground">Title</label>
              <input autoFocus type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter step title…"
                className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-foreground">Points</label>
              <input type="number" min={0} value={points} onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-secondary/30">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-xl text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">Cancel</button>
            <button type="submit" disabled={!title.trim()}
              className="px-5 py-2 rounded-xl bg-foreground text-background text-[13px] font-semibold hover:opacity-80 disabled:opacity-40 transition-all">Add Step</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Step editor header (shared) ─────────────────────────────────────────────

function EditorHeader({ step, onBack, accentIcon, accentClass, onSave }: {
  step: EditorStep; onBack: () => void; accentIcon: React.ElementType; accentClass: string; onSave: () => void
}) {
  const { saveState, triggerSave } = useSave()
  const Icon = accentIcon
  const isSaving = saveState === 'saving'
  const isSaved  = saveState === 'saved'

  function handleSave() {
    onSave()
    triggerSave()
  }

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5 bg-foreground">
        <button type="button" onClick={onBack}
          className="flex items-center gap-1.5 text-background/60 hover:text-background text-[12px] font-medium transition-colors shrink-0">
          <ArrowLeft className="w-3.5 h-3.5" /> Steps
        </button>
        <span className="text-background/30">/</span>
        <div className={cn('w-5 h-5 rounded-md flex items-center justify-center shrink-0', accentClass)}>
          <Icon className="w-3 h-3" />
        </div>
        <span className="text-[13px] font-bold text-background truncate flex-1">{step.title}</span>
        {step.points > 0 && (
          <span className="text-[11px] font-semibold text-background/50 bg-background/10 px-2.5 py-1 rounded-lg shrink-0">
            {step.points} pts
          </span>
        )}

        {/* ── Save button ── */}
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          aria-label="Save step"
          className={cn(
            'flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[12px] font-semibold transition-all shrink-0 select-none',
            isSaved
              ? 'bg-green-500/20 text-green-400'
              : 'bg-background/15 hover:bg-background/25 text-background disabled:opacity-60',
          )}
        >
          {isSaving ? (
            <>
              <Image
                src="/logo.svg"
                alt="Saving…"
                width={14}
                height={14}
                className="animate-save-logo"
                key={String(isSaving)}
              />
              Saving…
            </>
          ) : isSaved ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Saved
            </>
          ) : (
            'Save'
          )}
        </button>
      </div>
    </div>
  )
}

// ─── Text step editor ─────────────────────────────────────────────────────────

function TextStepEditor({ step, onBack, onChange }: {
  step: EditorStep; onBack: () => void; onChange: (s: EditorStep) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <EditorHeader step={step} onBack={onBack} accentIcon={BookOpen} accentClass="bg-blue-500/20 text-blue-600"
        onSave={() => onChange({ ...step })} />
      <RichTextEditor
        content={step.data.content ?? ''}
        onChange={(html) => onChange({ ...step, data: { ...step.data, content: html } })}
        placeholder="Start writing the content for this step…"
      />
      <AudioGeneratorPanel
        htmlContent={step.data.content ?? ''}
        onAudioGenerated={(dataUrl) =>
          onChange({ ...step, data: { ...step.data, audioUrl: dataUrl } })
        }
      />
    </div>
  )
}

// ─── Video URL parser ─────────────────────────────────────────────────────────

type VideoPlatform = 'youtube' | 'vimeo' | 'direct' | 'unknown'

interface VideoInfo {
  platform: VideoPlatform
  videoId: string | null
  originalUrl: string
  embedUrl: string | null
  thumbnailUrl: string | null
  title: string | null
}

function parseVideoUrl(rawUrl: string): VideoInfo {
  const url = rawUrl.trim()
  const base: VideoInfo = { platform: 'unknown', videoId: null, originalUrl: url, embedUrl: null, thumbnailUrl: null, title: null }
  if (!url) return base

  // ── YouTube ──────────────────────────────────────────────────────────────
  // https://youtu.be/ID  |  https://youtube.com/watch?v=ID  |  https://youtube.com/shorts/ID
  const ytShort = url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/)
  const ytWatch = url.match(/[?&]v=([A-Za-z0-9_-]{11})/)
  const ytShorts = url.match(/\/shorts\/([A-Za-z0-9_-]{11})/)
  const ytEmbed = url.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{11})/)
  const ytId = (ytShort?.[1] ?? ytWatch?.[1] ?? ytShorts?.[1] ?? ytEmbed?.[1]) ?? null

  if (ytId) {
    return {
      platform: 'youtube',
      videoId: ytId,
      originalUrl: `https://www.youtube.com/watch?v=${ytId}`,
      embedUrl: `https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`,
      title: null,
    }
  }

  // ── Vimeo ─────────────────────────────────────────────────────────────────
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) {
    const vid = vimeo[1]
    return {
      platform: 'vimeo',
      videoId: vid,
      originalUrl: `https://vimeo.com/${vid}`,
      embedUrl: `https://player.vimeo.com/video/${vid}?badge=0&autopause=0`,
      thumbnailUrl: null, // fetched async via oEmbed
      title: null,
    }
  }

  // ── Direct video file ─────────────────────────────────────────────────────
  if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(url)) {
    return { platform: 'direct', videoId: null, originalUrl: url, embedUrl: url, thumbnailUrl: null, title: null }
  }

  return base
}

const PLATFORM_LABELS: Record<VideoPlatform, string> = {
  youtube: 'YouTube',
  vimeo: 'Vimeo',
  direct: 'Direct video',
  unknown: 'Unknown',
}

const PLATFORM_COLORS: Record<VideoPlatform, string> = {
  youtube: 'bg-red-500/15 text-red-600',
  vimeo: 'bg-sky-500/15 text-sky-600',
  direct: 'bg-green-500/15 text-green-600',
  unknown: 'bg-muted text-muted-foreground',
}

// ─── Video thumbnail card ─────────────────────────────────────────────────────

function VideoThumbnailCard({ info }: { info: VideoInfo }) {
  const [thumbError, setThumbError] = useState(false)
  const [vimeoThumb, setVimeoThumb] = useState<string | null>(null)
  const [loadingThumb, setLoadingThumb] = useState(info.platform === 'vimeo')

  // Fetch Vimeo thumbnail via oEmbed (CORS-safe, no key required)
  useEffect(() => {
    if (info.platform !== 'vimeo' || !info.videoId) return
    setLoadingThumb(true)
    fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${info.videoId}&width=640`)
      .then((r) => r.json())
      .then((d) => { setVimeoThumb(d.thumbnail_url ?? null) })
      .catch(() => {})
      .finally(() => setLoadingThumb(false))
  }, [info.platform, info.videoId])

  const thumb = info.platform === 'vimeo' ? vimeoThumb : info.thumbnailUrl
  const hasThumb = !!thumb && !thumbError

  return (
    <a
      href={info.originalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex rounded-2xl overflow-hidden border border-border bg-black aspect-video transition-all hover:border-foreground/30 hover:shadow-xl"
    >
      {/* Thumbnail or fallback */}
      {loadingThumb ? (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
          <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
        </div>
      ) : hasThumb ? (
        <img
          src={thumb!}
          alt="Video thumbnail"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setThumbError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 gap-3">
          <Video className="w-10 h-10 text-white/30" />
          <span className="text-[12px] text-white/30 font-medium">
            {info.platform === 'direct' ? 'Direct video file' : 'Preview unavailable'}
          </span>
        </div>
      )}

      {/* Dark overlay on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all" />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg transition-all group-hover:scale-110 group-hover:bg-white">
          <Play className="w-6 h-6 text-foreground fill-foreground translate-x-0.5" />
        </div>
      </div>

      {/* Platform badge */}
      <div className="absolute top-3 left-3">
        <span className={cn('text-[10px] font-bold px-2 py-1 rounded-lg backdrop-blur-sm', PLATFORM_COLORS[info.platform])}>
          {PLATFORM_LABELS[info.platform]}
        </span>
      </div>

      {/* External link icon */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-7 h-7 rounded-lg bg-white/90 flex items-center justify-center shadow-sm">
          <ExternalLink className="w-3.5 h-3.5 text-foreground" />
        </div>
      </div>
    </a>
  )
}

// ─── Video step editor ────────────────────────────────────────────────────────

function VideoStepEditor({ step, onBack, onChange }: {
  step: EditorStep; onBack: () => void; onChange: (s: EditorStep) => void
}) {
  const [inputValue, setInputValue] = useState(step.data.videoUrl ?? '')
  const [committed, setCommitted] = useState(step.data.videoUrl ?? '')

  const info = parseVideoUrl(committed)
  const hasVideo = committed.trim().length > 0

  function handleApply() {
    const trimmed = inputValue.trim()
    setCommitted(trimmed)
    onChange({ ...step, data: { ...step.data, videoUrl: trimmed } })
  }

  return (
    <div className="flex flex-col gap-4">
      <EditorHeader step={step} onBack={onBack} accentIcon={Video} accentClass="bg-purple-500/20 text-purple-600"
        onSave={() => onChange({ ...step, data: { ...step.data, videoUrl: committed } })} />

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        {/* URL input row */}
        <div className="px-5 py-4 border-b border-border flex flex-col gap-3">
          <label className="text-[12px] font-semibold text-foreground flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-muted-foreground" />
            Video URL
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleApply() }}
              placeholder="https://youtube.com/watch?v=…  or  https://vimeo.com/…"
              className="flex-1 px-3 py-2.5 rounded-xl bg-background border border-border text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
            <button
              type="button"
              onClick={handleApply}
              disabled={!inputValue.trim() || inputValue.trim() === committed}
              className="px-4 py-2.5 rounded-xl bg-foreground text-background text-[12px] font-semibold hover:opacity-80 disabled:opacity-30 transition-all shrink-0"
            >
              Apply
            </button>
          </div>

          {/* Platform hint */}
          <div className="flex flex-wrap gap-2">
            {(['youtube', 'vimeo', 'direct'] as const).map((p) => (
              <span key={p} className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-lg', PLATFORM_COLORS[p])}>
                {PLATFORM_LABELS[p]}
              </span>
            ))}
            <span className="text-[10px] text-muted-foreground self-center">supported</span>
          </div>
        </div>

        {/* Preview area */}
        <div className="p-5">
          {!hasVideo ? (
            <div className="flex flex-col items-center justify-center py-14 text-center rounded-2xl border-2 border-dashed border-border">
              <Video className="w-9 h-9 text-muted-foreground/30 mb-3" />
              <p className="text-[13px] font-semibold text-foreground mb-1">No video yet</p>
              <p className="text-[11px] text-muted-foreground">Paste a YouTube or Vimeo URL above and press Apply.</p>
            </div>
          ) : info.platform === 'unknown' ? (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[12px] font-semibold text-foreground mb-0.5">Unrecognized URL</p>
                <p className="text-[11px] text-muted-foreground">Only YouTube, Vimeo, and direct video files (.mp4, .webm) are supported.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Clickable thumbnail */}
              <VideoThumbnailCard info={info} />

              {/* Open link */}
              <a
                href={info.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary hover:bg-accent transition-colors text-[12px] font-medium text-muted-foreground hover:text-foreground w-fit"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open on {PLATFORM_LABELS[info.platform]}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── File type helpers ────────────────────────────────────────────────────────

interface FileTypeInfo {
  icon: React.ElementType
  label: string
  color: string          // bg + text tailwind classes
  canPreview: boolean    // image / PDF preview
}

function getFileTypeInfo(url: string, mime?: string): FileTypeInfo {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase() ?? ''
  const m = mime ?? ''

  if (/pdf/.test(m) || ext === 'pdf')
    return { icon: FileText,        label: 'PDF',        color: 'bg-red-500/15 text-red-600',    canPreview: true  }
  if (/word|docx?/.test(m) || ['doc', 'docx'].includes(ext))
    return { icon: FileText,        label: 'Word',       color: 'bg-blue-500/15 text-blue-600',  canPreview: false }
  if (/excel|sheet|xlsx?/.test(m) || ['xls', 'xlsx', 'csv'].includes(ext))
    return { icon: FileSpreadsheet, label: 'Spreadsheet',color: 'bg-green-500/15 text-green-600',canPreview: false }
  if (/image/.test(m) || ['png','jpg','jpeg','gif','webp','svg','avif'].includes(ext))
    return { icon: FileImage,       label: 'Image',      color: 'bg-purple-500/15 text-purple-600', canPreview: true }
  if (/zip|rar|7z|tar|gz/.test(m) || ['zip','rar','7z','tar','gz'].includes(ext))
    return { icon: FileArchive,     label: 'Archive',    color: 'bg-amber-500/15 text-amber-600',canPreview: false }
  if (/javascript|typescript|json|html|css|python/.test(m) || ['js','ts','json','html','css','py','java','cpp','c'].includes(ext))
    return { icon: FileCode,        label: 'Code',       color: 'bg-violet-500/15 text-violet-600', canPreview: false }
  if (/presentation|pptx?/.test(m) || ['ppt','pptx'].includes(ext))
    return { icon: FileText,        label: 'Presentation',color:'bg-orange-500/15 text-orange-600',canPreview: false }

  return { icon: File,            label: 'File',       color: 'bg-muted text-muted-foreground', canPreview: false }
}

function formatFileSize(bytes?: number) {
  if (!bytes) return null
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ─── File preview card ────────────────────────────────────────────────────────

function FilePreviewCard({ url, fileName, fileSize, fileMimeType }: {
  url: string; fileName?: string; fileSize?: number; fileMimeType?: string
}) {
  const info = getFileTypeInfo(url, fileMimeType)
  const Icon = info.icon
  const displayName = fileName ?? url.split('/').pop()?.split('?')[0] ?? url
  const sizeLabel = formatFileSize(fileSize)
  const isImage = info.canPreview && /image/.test(fileMimeType ?? '') || /\.(png|jpg|jpeg|gif|webp|svg|avif)(\?|$)/i.test(url)
  const isPDF   = info.canPreview && (fileMimeType?.includes('pdf') || url.toLowerCase().endsWith('.pdf'))

  return (
    <div className="flex flex-col rounded-2xl border border-border overflow-hidden bg-card shadow-sm">
      {/* Image preview */}
      {isImage && (
        <div className="relative bg-secondary/40 border-b border-border max-h-64 overflow-hidden flex items-center justify-center">
          <img src={url} alt={displayName} className="max-h-64 w-full object-contain" />
        </div>
      )}

      {/* PDF inline preview */}
      {isPDF && !isImage && (
        <div className="border-b border-border bg-neutral-900" style={{ height: 360 }}>
          <iframe src={url} className="w-full h-full" title={displayName} />
        </div>
      )}

      {/* Non-previewable: icon banner */}
      {!isImage && !isPDF && (
        <div className={cn('flex items-center justify-center py-10 border-b border-border', info.color.split(' ')[0].replace('text-', 'bg-').replace('/15', '/10'))}>
          <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center', info.color)}>
            <Icon className="w-8 h-8" />
          </div>
        </div>
      )}

      {/* File meta + actions */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Type badge */}
        <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center shrink-0', info.color)}>
          <Icon className="w-4 h-4" />
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[13px] font-semibold text-foreground truncate leading-tight">{displayName}</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-md', info.color)}>
              {info.label}
            </span>
            {sizeLabel && (
              <span className="text-[10px] text-muted-foreground">{sizeLabel}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <a href={url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary hover:bg-accent text-[11px] font-semibold text-foreground transition-colors">
            <ExternalLink className="w-3.5 h-3.5" />
            Open
          </a>
          <a href={url} download={fileName}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-foreground text-background text-[11px] font-semibold hover:opacity-80 transition-opacity">
            <Download className="w-3.5 h-3.5" />
            Download
          </a>
        </div>
      </div>
    </div>
  )
}

// ─── File step editor ─────────────────────────────────────────────────────────

function FileStepEditor({ step, onBack, onChange }: {
  step: EditorStep; onBack: () => void; onChange: (s: EditorStep) => void
}) {
  const [urlInput, setUrlInput]     = useState(step.data.fileUrl ?? '')
  const [nameInput, setNameInput]   = useState(step.data.fileName ?? '')
  const [committed, setCommitted]   = useState(step.data.fileUrl ?? '')
  const [isValidUrl, setIsValidUrl] = useState(false)

  useEffect(() => {
    try { new URL(committed); setIsValidUrl(true) }
    catch { setIsValidUrl(false) }
  }, [committed])

  function handleApply() {
    const trimmedUrl  = urlInput.trim()
    const trimmedName = nameInput.trim()
    if (!trimmedUrl) return
    setCommitted(trimmedUrl)
    onChange({
      ...step,
      data: {
        ...step.data,
        fileUrl:  trimmedUrl,
        fileName: trimmedName || undefined,
      },
    })
  }

  const isDirty = urlInput.trim() !== committed || nameInput.trim() !== (step.data.fileName ?? '')

  return (
    <div className="flex flex-col gap-4">
      <EditorHeader step={step} onBack={onBack} accentIcon={FileUp} accentClass="bg-green-500/20 text-green-600"
        onSave={() => onChange({ ...step, data: { ...step.data, fileUrl: committed, fileName: nameInput.trim() || undefined } })} />

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        {/* URL + name inputs */}
        <div className="px-5 py-4 border-b border-border flex flex-col gap-4">
          {/* URL row */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-foreground flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-muted-foreground" />
              Document / File URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleApply() }}
                placeholder="https://example.com/document.pdf"
                className="flex-1 px-3 py-2.5 rounded-xl bg-background border border-border text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
              <button
                type="button"
                onClick={handleApply}
                disabled={!urlInput.trim() || !isDirty}
                className="px-4 py-2.5 rounded-xl bg-foreground text-background text-[12px] font-semibold hover:opacity-80 disabled:opacity-30 transition-all shrink-0"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Display name row */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-foreground">
              Display name <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleApply() }}
              placeholder="e.g. Course Syllabus.pdf"
              className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>

          {/* Supported formats hint */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'PDF',   color: 'bg-red-500/15 text-red-600'     },
              { label: 'Word',  color: 'bg-blue-500/15 text-blue-600'   },
              { label: 'Excel', color: 'bg-green-500/15 text-green-600' },
              { label: 'Image', color: 'bg-purple-500/15 text-purple-600'},
              { label: 'ZIP',   color: 'bg-amber-500/15 text-amber-600' },
              { label: 'Code',  color: 'bg-violet-500/15 text-violet-600'},
            ].map((f) => (
              <span key={f.label} className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-lg', f.color)}>
                {f.label}
              </span>
            ))}
            <span className="text-[10px] text-muted-foreground self-center">& more</span>
          </div>
        </div>

          {/* Preview area */}
        <div className="p-5">
          {!committed ? (
            <div className="flex flex-col items-center justify-center py-14 rounded-2xl border-2 border-dashed border-border text-center">
              <FileUp className="w-9 h-9 text-muted-foreground/30 mb-3" />
              <p className="text-[13px] font-semibold text-foreground mb-1">No file yet</p>
              <p className="text-[11px] text-muted-foreground">Paste a URL above and press Apply.</p>
            </div>
          ) : !isValidUrl ? (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[12px] font-semibold text-foreground mb-0.5">Invalid URL</p>
                <p className="text-[11px] text-muted-foreground">Please enter a valid full URL starting with https://</p>
              </div>
            </div>
          ) : (
            <FilePreviewCard
              url={committed}
              fileName={step.data.fileName}
              fileSize={step.data.fileSize}
              fileMimeType={step.data.fileMimeType}
            />
          )}
        </div>
      </div>

      {/* Audio narration — available when a file URL is set */}
      {committed && isValidUrl && (
        <AudioGeneratorPanel
          sourceUrl={committed}
          onAudioGenerated={(dataUrl) =>
            onChange({ ...step, data: { ...step.data, audioUrl: dataUrl } })
          }
        />
      )}
    </div>
  )
}// ─── Generic placeholder ──────────────────────────────────────────────────────

function PlaceholderStepEditor({ step, onBack }: { step: EditorStep; onBack: () => void }) {
  const meta = getMeta(step.type)
  const Icon = meta.icon
  return (
    <div className="flex flex-col gap-4">
      <EditorHeader step={step} onBack={onBack} accentIcon={Icon} accentClass={meta.color} onSave={() => {}} />
      <div className="bg-card border border-border rounded-2xl shadow-sm flex flex-col items-center justify-center py-20 text-center px-8">
        <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center mb-4', meta.color)}>
          <Icon className="w-6 h-6" />
        </div>
        <p className="text-[14px] font-bold text-foreground mb-1">{meta.label} Editor</p>
        <p className="text-[12px] text-muted-foreground">Coming soon.</p>
      </div>
    </div>
  )
}

// ─── Steps panel (main area) ──────────────────────────────────────────────────

interface StepsPanelProps {
  chapter: EditorChapter
  moduleTitle: string
  moduleIndex: number
  onChange: (steps: EditorStep[]) => void
  /** Called when chapter-level data (e.g. flashCards) changes */
  onChapterChange?: (updated: EditorChapter) => void
}

export function StepsPanel({ chapter, moduleTitle, moduleIndex, onChange, onChapterChange }: StepsPanelProps) {
  const [addOpen, setAddOpen] = useState(false)
  const [activeStepId, setActiveStepId] = useState<number | null>(null)

  const activeStep = chapter.steps.find((s) => s.id === activeStepId) ?? null

  function handleStepCreate(step: EditorStep) {
    const withPos = { ...step, position: chapter.steps.length + 1 }
    onChange([...chapter.steps, withPos])
    setActiveStepId(withPos.id)
  }

  function handleStepDelete(id: number) {
    if (activeStepId === id) setActiveStepId(null)
    onChange(chapter.steps.filter((s) => s.id !== id))
  }

  function handleStepUpdate(updated: EditorStep) {
    onChange(chapter.steps.map((s) => (s.id === updated.id ? updated : s)))
  }

  // ── Active step view ──
  if (activeStep) {
    if (activeStep.type === 'info')
      return <TextStepEditor step={activeStep} onBack={() => setActiveStepId(null)} onChange={handleStepUpdate} />
    if (activeStep.type === 'video')
      return <VideoStepEditor step={activeStep} onBack={() => setActiveStepId(null)} onChange={handleStepUpdate} />
    if (activeStep.type === 'file')
      return <FileStepEditor step={activeStep} onBack={() => setActiveStepId(null)} onChange={handleStepUpdate} />
    if (activeStep.type === 'quiz')
      return <QuizStepEditor step={activeStep} onBack={() => setActiveStepId(null)} onChange={handleStepUpdate} />
    return <PlaceholderStepEditor step={activeStep} onBack={() => setActiveStepId(null)} />
  }

  // ── Steps list view ──
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-foreground">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold text-background/50 uppercase tracking-wider">
              {moduleIndex}. {moduleTitle}
            </span>
            <h2 className="text-[15px] font-bold text-background leading-tight">{chapter.title}</h2>
          </div>
          <button type="button" onClick={() => setAddOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-background/15 hover:bg-background/25 text-background text-[12px] font-semibold transition-all">
            <PlusCircle className="w-3.5 h-3.5" /> Add Step
          </button>
        </div>

        <div className="p-5 flex flex-col gap-3">
          {chapter.steps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-3">
                <HelpCircle className="w-6 h-6 text-muted-foreground/40" />
              </div>
              <p className="text-[13px] font-semibold text-foreground mb-1">No steps yet</p>
              <p className="text-[12px] text-muted-foreground mb-4">Add your first step to this chapter.</p>
              <button type="button" onClick={() => setAddOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-foreground text-background rounded-xl text-[12px] font-semibold hover:opacity-80 transition-all">
                <PlusCircle className="w-3.5 h-3.5" /> Add First Step
              </button>
            </div>
          ) : (
            chapter.steps.map((step, idx) => (
              <StepRow key={step.id} step={step} index={idx}
                onOpen={() => setActiveStepId(step.id)}
                onDelete={() => handleStepDelete(step.id)} />
            ))
          )}
        </div>

        <AddStepModal open={addOpen} onClose={() => setAddOpen(false)} onCreate={handleStepCreate} />
      </div>

      {/* ── Flashcard generator — chapter-level AI study cards ──────────────── */}
      <FlashcardGeneratorPanel
        chapterTitle={chapter.title}
        steps={chapter.steps}
        initialCards={chapter.flashCards}
        onCardsGenerated={(cards) =>
          onChapterChange?.({ ...chapter, flashCards: cards })
        }
      />
    </div>
  )
}
