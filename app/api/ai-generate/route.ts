import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_INSTRUCTION = `You are an expert content writer for an e-learning platform.
When the user provides a prompt, generate rich educational content in valid HTML.
Use only these tags: <h1>–<h3>, <p>, <strong>, <em>, <u>, <ul>, <ol>, <li>, <blockquote>, <code>, <pre>.
Do NOT wrap output in \`\`\`html or any markdown fences.
Do NOT include <html>, <body>, <head>, or any outer wrapper tags.
Keep the content focused, clear, and educational.
Output only the HTML, nothing else.`

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()
    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 })
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }],
          },
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    )

    const data = await res.json()

    if (!res.ok) {
      const msg = data?.error?.message ?? `HTTP ${res.status}`
      return NextResponse.json({ error: msg }, { status: res.status })
    }

    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    const html = text
      .trim()
      .replace(/^```html\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()

    return NextResponse.json({ html })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
