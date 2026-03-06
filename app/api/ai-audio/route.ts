import { NextRequest, NextResponse } from 'next/server'

// ─── Strip HTML tags to plain text ───────────────────────────────────────────

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

// ─── Voice name → Gemini TTS voice name mapping ───────────────────────────────
// Gemini TTS supports: Zephyr, Puck, Charon, Kore, Fenrir, Aoede, etc.

const VOICE_MAP: Record<string, { voice: string; lang: string }> = {
  'en-US-Neural2-F': { voice: 'Aoede',  lang: 'English'  },
  'en-US-Neural2-D': { voice: 'Fenrir', lang: 'English'  },
  'en-GB-Neural2-C': { voice: 'Kore',   lang: 'English'  },
  'en-GB-Neural2-B': { voice: 'Charon', lang: 'English'  },
  'ru-RU-Wavenet-C': { voice: 'Aoede',  lang: 'Russian'  },
  'ru-RU-Wavenet-B': { voice: 'Fenrir', lang: 'Russian'  },
  'kk-KZ-Standard-A':{ voice: 'Aoede',  lang: 'Kazakh'   },
  'de-DE-Neural2-F': { voice: 'Kore',   lang: 'German'   },
  'fr-FR-Neural2-E': { voice: 'Aoede',  lang: 'French'   },
  'es-ES-Neural2-A': { voice: 'Aoede',  lang: 'Spanish'  },
}

// ─── Step 1: Use Gemini to generate a podcast-style narration ─────────────────

async function generateNarration(source: string, langName: string, apiKey: string): Promise<string> {
  const systemPrompt = `You are an expert educational narrator, similar to NotebookLM's podcast feature.
Your task is to convert the provided source (text, URL content summary, or document) into a clear, engaging audio narration script.

Rules:
- Write in ${langName} language
- Use a friendly, educational podcast tone
- Explain concepts clearly, as if talking to a student
- Add natural transitions between ideas ("First...", "Now let's look at...", "In summary...")
- Keep it concise: 2-4 minutes when read aloud (roughly 300-600 words)
- Do NOT include speaker labels, stage directions, or markdown formatting
- Output ONLY the narration text, nothing else`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-goog-api-key': apiKey },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: `Source content:\n\n${source}` }] }],
      }),
    },
  )

  const data = await res.json()
  if (!res.ok) throw new Error(data?.error?.message ?? `Gemini error: HTTP ${res.status}`)

  const narration: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  if (!narration.trim()) throw new Error('Gemini returned empty narration')
  return narration.trim()
}

// ─── Step 2: Gemini TTS — synthesize the narration script ────────────────────
// Uses gemini-2.5-flash-preview-tts which works with the same API key.

async function synthesizeWithGeminiTTS(
  text: string,
  voiceName: string,
  apiKey: string,
): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text }] }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      }),
    },
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data?.error?.message ?? `Gemini TTS error: HTTP ${res.status}`)
  }

  // The audio comes back as inline base64 data in the response
  const audioData: string =
    data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ?? ''

  if (!audioData) throw new Error('Gemini TTS returned no audio data')

  // Gemini TTS returns raw 16-bit PCM (24 kHz, mono). Browsers cannot play
  // raw PCM — we must wrap it in a proper WAV container with a RIFF header.
  const pcmBuffer = Buffer.from(audioData, 'base64')
  const wavBuffer = pcmToWav(pcmBuffer, 24000, 1, 16)
  return wavBuffer.toString('base64')
}

// ─── Convert raw PCM bytes → WAV (RIFF) with a 44-byte header ─────────────────
// sampleRate: 24000 Hz, numChannels: 1 (mono), bitDepth: 16

function pcmToWav(pcm: Buffer, sampleRate: number, numChannels: number, bitDepth: number): Buffer {
  const byteRate = (sampleRate * numChannels * bitDepth) / 8
  const blockAlign = (numChannels * bitDepth) / 8
  const dataSize = pcm.length
  const header = Buffer.alloc(44)

  // RIFF chunk
  header.write('RIFF', 0)
  header.writeUInt32LE(36 + dataSize, 4)    // ChunkSize
  header.write('WAVE', 8)

  // fmt sub-chunk
  header.write('fmt ', 12)
  header.writeUInt32LE(16, 16)              // Subchunk1Size (PCM = 16)
  header.writeUInt16LE(1, 20)              // AudioFormat (PCM = 1)
  header.writeUInt16LE(numChannels, 22)
  header.writeUInt32LE(sampleRate, 24)
  header.writeUInt32LE(byteRate, 28)
  header.writeUInt16LE(blockAlign, 32)
  header.writeUInt16LE(bitDepth, 34)

  // data sub-chunk
  header.write('data', 36)
  header.writeUInt32LE(dataSize, 40)

  return Buffer.concat([header, pcm])
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { text, html, url, voice = 'en-US-Neural2-F' } = await req.json()

    const voiceMeta = VOICE_MAP[voice] ?? { voice: 'Aoede', lang: 'English' }

    // Build source text from whatever was provided
    let sourceText = ''
    if (url?.trim()) {
      try {
        const pageRes = await fetch(url.trim(), { headers: { 'User-Agent': 'Mozilla/5.0' } })
        const pageHtml = await pageRes.text()
        sourceText = htmlToPlainText(pageHtml).slice(0, 8000)
      } catch {
        return NextResponse.json({ error: 'Could not fetch the provided URL.' }, { status: 400 })
      }
    } else if (html?.trim()) {
      sourceText = htmlToPlainText(html)
    } else if (text?.trim()) {
      sourceText = text.trim()
    }

    if (!sourceText.trim()) {
      return NextResponse.json({ error: 'No source content provided' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 })
    }

    // ── Step 1: Generate narration script ─────────────────────────────────────
    const narration = await generateNarration(sourceText, voiceMeta.lang, apiKey)

    // ── Step 2: Synthesize with Gemini TTS ────────────────────────────────────
    const audioBase64 = await synthesizeWithGeminiTTS(narration, voiceMeta.voice, apiKey)

    return NextResponse.json({ audio: audioBase64, mimeType: 'audio/wav' })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
