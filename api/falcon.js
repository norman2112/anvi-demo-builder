/**
 * Vercel serverless: proxies Falcon AI requests so the API key stays server-side.
 * Reads process.env.FALCON_API_KEY — never sent from the frontend.
 * POST body: { messages, model }
 * Forwards to Falcon AI chat/completions with Authorization: Bearer <key>
 */

const FALCON_URL = 'https://falconai.planview-prod.io/api/v1/chat/completions'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
}

export const config = { maxDuration: 60 }

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders).end()
    return
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { ...corsHeaders, 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  const key = process.env.FALCON_API_KEY
  if (!key || !key.trim()) {
    res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'FALCON_API_KEY not configured' }))
    return
  }

  try {
    const { messages, model } = req.body || {}
    if (!messages || !Array.isArray(messages)) {
      res.writeHead(400, { ...corsHeaders, 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'messages array is required' }))
      return
    }

    const body = {
      model: model || 'us.anthropic.claude-sonnet-4-5-20250929-v1:0',
      messages,
    }

    const targetRes = await fetch(FALCON_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(body),
    })

    const text = await targetRes.text()

    res.writeHead(targetRes.status, {
      ...corsHeaders,
      'Content-Type': targetRes.headers.get('Content-Type') || 'application/json',
    })
    res.end(text)
  } catch (err) {
    console.error('[api/falcon]', err)
    res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: err?.message || 'Falcon proxy error' }))
  }
}
