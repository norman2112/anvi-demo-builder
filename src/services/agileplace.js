import { proxyFetch } from './proxy.js'

/**
 * LeanKit API (apiDocs.md): base https://<host>.leankit.com/io/
 * List all boards: GET /io/board  → returns id, title, etc. (no cardTypes/lanes).
 * Board details: GET /io/board/:boardId → returns cardTypes, lanes, etc.
 */

export async function getBoardDetails(baseUrl, token, boardId) {
  const base = baseUrl.replace(/\/$/, '')
  const targetUrl = `${base}/io/board/${encodeURIComponent(boardId)}`
  const res = await proxyFetch(targetUrl, {
    method: 'GET',
    token,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  })
  return res.json()
}

/**
 * Fetch board list then enrich each with details (cardTypes, lane count) so the table can show them.
 */
export async function discoverEnvironment(baseUrl, token) {
  const base = baseUrl.replace(/\/$/, '')
  const targetUrl = `${base}/io/board`
  console.log('[agileplace] discoverEnvironment called', {
    baseUrl,
    targetUrl,
    tokenLength: token?.length ?? 0,
  })
  const res = await proxyFetch(targetUrl, {
    method: 'GET',
    token,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  })
  const data = await res.json()
  const list = Array.isArray(data?.boards) ? data.boards : data?.items ?? []
  if (list.length === 0) return list

  const enriched = await Promise.all(
    list.map(async (board) => {
      const id = board.id ?? board.boardId
      if (!id) return { ...board, cardTypes: [], lanes: [], laneCount: 0 }
      try {
        const detail = await getBoardDetails(baseUrl, token, id)
        const cardTypes = Array.isArray(detail.cardTypes) ? detail.cardTypes : []
        const lanes = Array.isArray(detail.lanes) ? detail.lanes : []
        const owner = detail.owner ?? detail.createdBy ?? detail.boardOwner
        return {
          ...board,
          cardTypes,
          lanes,
          laneCount: lanes.length,
          owner: owner != null ? owner : board.owner,
        }
      } catch (e) {
        console.warn('[agileplace] Failed to fetch details for board', id, e?.message)
        return { ...board, cardTypes: [], lanes: [], laneCount: 0 }
      }
    })
  )
  return enriched
}
