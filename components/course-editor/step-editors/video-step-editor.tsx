'use client'

import { useState, useEffect } from 'react'
import { Video, ExternalLink, Play, Link as LinkIcon, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EditorStep } from '@/lib/course-editor-types'
import { EditorHeader } from '../step-editor-header'

// ─── URL parser ───────────────────────────────────────────────────────────────

export type VideoPlatform = 'youtube' | 'vimeo' | 'direct' | 'unknown'

export interface VideoInfo {
  platform: VideoPlatform
  videoId: string | null
  originalUrl: string
  embedUrl: string | null
  thumbnailUrl: string | null
}

export function parseVideoUrl(rawUrl: string): VideoInfo {
  const url = rawUrl.trim()
  const base: VideoInfo = {
    platform: 'unknown', videoId: null, originalUrl: url,
    embedUrl: null, thumbnailUrl: null,
  }
  if (!url) return base

  // YouTube
  const ytId =
    url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/)?.[1] ??
    url.match(/[?&]v=([A-Za-z0-9_-]{11})/)?.[1] ??
    url.match(/\/shorts\/([A-Za-z0-9_-]{11})/)?.[1] ??
    url.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{11})/)?.[1] ??
    null
  if (ytId) return {
    platform: 'youtube', videoId: ytId,
    originalUrl: `https://www.youtube.com/watch?v=${ytId}`,
    embedUrl: `https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`,
    thumbnailUrl: `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`,
  }

  // Vimeo
  const vimeoId = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1] ?? null
  if (vimeoId) return {
    platform: 'vimeo', videoId: vimeoId,
    originalUrl: `https://vimeo.com/${vimeoId}`,
    embedUrl: `https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0`,
    thumbnailUrl: null,
  }

  // Direct file
  if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(url))
    return { platform: 'direct', videoId: null, originalUrl: url, embedUrl: url, thumbnailUrl: null }

  return base
}

const PLATFORM_LABELS: Record<VideoPlatform, string> = {
  youtube: 'YouTube', vimeo: 'Vimeo', direct: 'Direct video', unknown: 'Unknown',
}

const PLATFORM_COLORS: Record<VideoPlatform, string> = {
  youtube: 'bg-red-500/15 text-red-600',
  vimeo:   'bg-sky-500/15 text-sky-600',
  direct:  'bg-green-500/15 text-green-600',
  unknown: 'bg-muted text-muted-foreground',
}

// ─── Thumbnail card ───────────────────────────────────────────────────────────

function VideoThumbnailCard({ info }: { info: VideoInfo }) {
  const [thumbError, setThumbError]   = useState(false)
  const [vimeoThumb, setVimeoThumb]   = useState<string | null>(null)
  const [loading,    setLoading]      = useState(info.platform === 'vimeo')

  useEffect(() => {
    if (info.platform !== 'vimeo' || !info.videoId) return
    setLoading(true)
    fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${info.videoId}&width=640`)
      .then((r) => r.json())
      .then((d) => setVimeoThumb(d.thumbnail_url ?? null))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [info.platform, info.videoId])

  const thumb    = info.platform === 'vimeo' ? vimeoThumb : info.thumbnailUrl
  const hasThumb = !!thumb && !thumbError

  return (
    <a
      href={info.originalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex rounded-2xl overflow-hidden border border-border bg-black aspect-video hover:border-foreground/30 hover:shadow-xl transition-all"
    >
      {loading ? (
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

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg transition-all group-hover:scale-110 group-hover:bg-white">
          <Play className="w-6 h-6 text-foreground fill-foreground translate-x-0.5" />
        </div>
      </div>

      <div className="absolute top-3 left-3">
        <span className={cn('text-[10px] font-bold px-2 py-1 rounded-lg backdrop-blur-sm', PLATFORM_COLORS[info.platform])}>
          {PLATFORM_LABELS[info.platform]}
        </span>
      </div>

      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-7 h-7 rounded-lg bg-white/90 flex items-center justify-center shadow-sm">
          <ExternalLink className="w-3.5 h-3.5 text-foreground" />
        </div>
      </div>
    </a>
  )
}

// ─── Video step editor ────────────────────────────────────────────────────────

interface VideoStepEditorProps {
  step: EditorStep
  onBack: () => void
  onChange: (s: EditorStep) => void
}

export function VideoStepEditor({ step, onBack, onChange }: VideoStepEditorProps) {
  const [inputValue, setInputValue] = useState(step.data.videoUrl ?? '')
  const [committed,  setCommitted]  = useState(step.data.videoUrl ?? '')

  const info     = parseVideoUrl(committed)
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
        {/* Input */}
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
              className="px-4 py-2.5 rounded-xl bg-nav-pill text-white text-[12px] font-semibold hover:opacity-90 disabled:opacity-30 transition-all shrink-0"
            >
              Apply
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['youtube', 'vimeo', 'direct'] as const).map((p) => (
              <span key={p} className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-lg', PLATFORM_COLORS[p])}>
                {PLATFORM_LABELS[p]}
              </span>
            ))}
            <span className="text-[10px] text-muted-foreground self-center">supported</span>
          </div>
        </div>

        {/* Preview */}
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
              <VideoThumbnailCard info={info} />
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
