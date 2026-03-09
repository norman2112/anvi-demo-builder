const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
}

const ALLOWED_ENTITIES = new Set([
  'Strategy_Dimension',
  'PortfolioDashboards_Project_Dimension',
])

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
    const { instanceNumber, entity } = req.body || {}

    const trimmedInstance = (instanceNumber ?? '').toString().trim()
    if (!trimmedInstance) {
      res.writeHead(400, { ...corsHeaders, 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'instanceNumber is required' }))
      return
    }

    if (!ALLOWED_ENTITIES.has(entity)) {
      res.writeHead(400, { ...corsHeaders, 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Invalid entity' }))
      return
    }

    const base = `https://scdemo${trimmedInstance}.pvcloud.com`.replace(/\/$/, '')
    const url = `${base}/odataservice/odataservice.svc/${encodeURIComponent(entity)}?$format=json`

    const username = 'plt\\odata'
    const password = 'data'
    const auth = Buffer.from(`${username}:${password}`).toString('base64')
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30_000)

    let odataRes
    try {
      odataRes = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${auth}`,
        },
        signal: controller.signal,
      })
    } catch (err) {
      clearTimeout(timeout)
      if (err && err.name === 'AbortError') {
        res.writeHead(504, { ...corsHeaders, 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Portfolios request timed out' }))
        return
      }
      console.error('[api/portfolios] Network error', err)
      res.writeHead(503, { ...corsHeaders, 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Could not reach Portfolios instance' }))
      return
    } finally {
      clearTimeout(timeout)
    }

    const text = await odataRes.text()
    const status = odataRes.status

    if (status === 401 || status === 403) {
      res.writeHead(401, { ...corsHeaders, 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Invalid Portfolios credentials' }))
      return
    }

    if (status === 404) {
      res.writeHead(404, { ...corsHeaders, 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Entity set not found or instance URL invalid' }))
      return
    }

    if (status >= 500) {
      res.writeHead(502, { ...corsHeaders, 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Portfolios OData service error' }))
      return
    }

    if (!odataRes.ok) {
      res.writeHead(status, { ...corsHeaders, 'Content-Type': 'application/json' })
      res.end(text || JSON.stringify({ error: 'Unexpected Portfolios response' }))
      return
    }

    res.writeHead(200, {
      ...corsHeaders,
      'Content-Type': odataRes.headers.get('Content-Type') || 'application/json',
    })
    res.end(text)
  } catch (err) {
    console.error('[api/portfolios] Unexpected error', err)
    res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Unexpected server error' }))
  }
}

