/**
 * Vercel serverless function: forwards requests to targetUrl with token in Authorization header.
 * Replaces local proxy-server.js in production.
 * Contract: POST with body { targetUrl, token, method, data }
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
}

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

  try {
    const { targetUrl, token, method = 'GET', data } = req.body || {}
    if (!targetUrl || typeof targetUrl !== 'string') {
      res.writeHead(400, { ...corsHeaders, 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'targetUrl is required' }))
      return
    }

    const headers = {
      Accept: 'application/json',
      ...(data != null && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
    }

    const fetchOptions = {
      method: method.toUpperCase(),
      headers,
      ...(data != null && { body: typeof data === 'string' ? data : JSON.stringify(data) }),
    }

    const targetRes = await fetch(targetUrl, fetchOptions)
    const text = await targetRes.text()

    res.writeHead(targetRes.status, {
      ...corsHeaders,
      'Content-Type': targetRes.headers.get('Content-Type') || 'application/json',
    })
    res.end(text)
  } catch (err) {
    console.error('[api/proxy]', err)
    res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: err?.message || 'Proxy error' }))
  }
}
