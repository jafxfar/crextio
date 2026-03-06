import { NextRequest, NextResponse } from 'next/server'

// ─── Strip HTML tags to plain text ────────────────────────────────────────────

function htmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface StepSource {
  title: string
  type: 'info' | 'video' | 'file' | 'quiz' | string
  /** Plain text content (from info steps) */
  text?: string
  /** URL (from file or video steps) */
  url?: string
}

interface FlashCard {
  id: string
  front: string
  back: string
}

// ─── Fetch URL content (server-side to avoid CORS) ────────────────────────────

async function fetchUrlText(url: string): Promise<string> {
  const res = await fetch(url.trim(), { headers: { 'User-Agent': 'Mozilla/5.0' } })
  const html = await res.text()
  return htmlToPlainText(html).slice(0, 6000)
}

// ─── Gemini: generate flash cards ────────────────────────────────────────────

async function generateFlashCards(
  chapterTitle: string,
  steps: StepSource[],
  apiKey: string,
): Promise<FlashCard[]> {
  // Build a consolidated context from all steps
  const context = steps
    .map((s, i) => {
      const parts: string[] = [`Step ${i + 1}: ${s.title} (${s.type})`]
      if (s.text)  parts.push(s.text)
      if (s.url)   parts.push(`[Source URL: ${s.url}]`)
      return parts.join('\n')
    })
    .join('\n\n---\n\n')

  const systemPrompt = `You are an expert educational flashcard creator, similar to NotebookLM's study tools.
Your job is to analyze learning content from a course chapter and produce concise, high-quality flashcards.

Rules:
- Create 6–12 flashcards that cover the KEY concepts, terms, and facts from the content.
- Each flashcard has:
    "front": a short question or key term (max 15 words)
    "back": a clear, concise answer or explanation (max 60 words)
- Write in the SAME language as the source content.
- Focus on the most important takeaways a student must remember.
- Do NOT create trivial or duplicate cards.
- Respond ONLY with a valid JSON array of objects: [{"front": "...", "back": "..."}, ...]
- No markdown, no code fences, no extra text — just the raw JSON array.`

  const prompt = `Chapter: "${chapterTitle}"\n\nContent from chapter steps:\n\n${context}`

  const res = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-goog-api-key': apiKey },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4 },
      }),
    },
  )

  const data = await res.json()
  if (!res.ok) throw new Error(data?.error?.message ?? `Gemini error: HTTP ${res.status}`)

  const raw: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  if (!raw.trim()) throw new Error('Gemini returned empty response')

  // Strip any accidental markdown fences
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

  let cards: { front: string; back: string }[]
  try {
    cards = JSON.parse(cleaned)
  } catch {
    throw new Error('Gemini response was not valid JSON. Raw: ' + cleaned.slice(0, 200))
  }

  if (!Array.isArray(cards)) throw new Error('Gemini response is not an array')

  return cards.map((c, i) => ({
    id: `fc-${Date.now()}-${i}`,
    front: String(c.front ?? '').trim(),
    back:  String(c.back  ?? '').trim(),
  }))
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { chapterTitle, steps } = await req.json() as {
      chapterTitle: string
      steps: StepSource[]
    }

    if (!chapterTitle || !Array.isArray(steps) || steps.length === 0) {
      return NextResponse.json({ error: 'chapterTitle and steps[] are required' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 })
    }

    // Resolve URL-based steps server-side (file / video steps)
    const resolvedSteps: StepSource[] = await Promise.all(
      steps.map(async (s) => {
        if (s.url && !s.text) {
          try {
            const text = await fetchUrlText(s.url)
            return { ...s, text }
          } catch {
            return s // keep url, Gemini will note it
          }
        }
        return s
      }),
    )

    const cards = await generateFlashCards(chapterTitle, resolvedSteps, apiKey)
    return NextResponse.json({ cards })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
