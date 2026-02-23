const defaultProxyUrl = import.meta.env.DEV
  ? (import.meta.env.VITE_PROXY_URL || 'http://localhost:3000')
  : (import.meta.env.VITE_PROXY_URL || '/api/proxy')

/**
 * Proxy contract (matches old HTML prototype): POST to proxy root with
 * body { targetUrl, token, method, data }.
 * When path is a full URL we POST that body to defaultProxyUrl; otherwise GET defaultProxyUrl + path.
 */
export async function proxyFetch(path, options = {}) {
  const method = options.method || 'GET'
  const isFullUrl = path.startsWith('http')

  if (isFullUrl) {
    const body = {
      targetUrl: path,
      token: options.token ?? null,
      method,
      data: options.body ?? null,
    }
    console.log('[proxy] POST to proxy (full URL)', {
      proxyUrl: defaultProxyUrl,
      targetUrl: path,
      method: body.method,
      hasToken: !!body.token,
      bodyKeys: Object.keys(body),
    })
    try {
      const res = await fetch(defaultProxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const text = await res.text()
        console.error('[proxy] Proxy responded with error', { status: res.status, statusText: res.statusText, body: text })
        throw new Error(`Proxy error: ${res.status} ${res.statusText}`)
      }
      return res
    } catch (err) {
      console.error('[proxy] Fetch failed', {
        proxyUrl: defaultProxyUrl,
        targetUrl: path,
        error: err,
        message: err?.message,
        name: err?.name,
        cause: err?.cause,
      })
      throw err
    }
  }

  const url = `${defaultProxyUrl}${path.startsWith('/') ? path : `/${path}`}`
  console.log('[proxy] GET relative', { url })
  const res = await fetch(url, { ...options, headers: { ...options.headers } })
  if (!res.ok) throw new Error(`Proxy error: ${res.status}`)
  return res
}
