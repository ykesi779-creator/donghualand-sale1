import { Hono } from 'hono'

type Bindings = { DB: D1Database }
export const searchRoutes = new Hono<{ Bindings: Bindings }>()

searchRoutes.get('/', async (c) => {
  const q = c.req.query('q') || ''
  const status = c.req.query('status') || ''
  const genre = c.req.query('genre') || ''
  const type = c.req.query('type') || ''
  const year = c.req.query('year') || ''
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '20')
  const offset = (page - 1) * limit
  const db = c.env?.DB

  try {
    if (!db) throw new Error('No DB')
    let query = `SELECT a.*, MAX(e.episode_number) as latest_ep, COUNT(e.id) as ep_count
                 FROM anime a LEFT JOIN episodes e ON a.id = e.anime_id WHERE 1=1`
    const params: any[] = []

    if (q) { query += ' AND (a.title LIKE ? OR a.title_native LIKE ? OR a.title_english LIKE ?)'; params.push(`%${q}%`, `%${q}%`, `%${q}%`) }
    if (status) { query += ' AND a.status = ?'; params.push(status) }
    if (genre) { query += ' AND a.genres LIKE ?'; params.push(`%${genre}%`) }
    if (type) { query += ' AND a.type = ?'; params.push(type) }
    if (year) { query += ' AND a.release_year = ?'; params.push(parseInt(year)) }

    query += ' GROUP BY a.id ORDER BY a.view_count DESC, a.updated_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const results = await db.prepare(query).bind(...params).all()

    let countQuery = 'SELECT COUNT(*) as total FROM anime WHERE 1=1'
    const countParams: any[] = []
    if (q) { countQuery += ' AND (title LIKE ? OR title_native LIKE ? OR title_english LIKE ?)'; countParams.push(`%${q}%`, `%${q}%`, `%${q}%`) }
    if (status) { countQuery += ' AND status = ?'; countParams.push(status) }
    if (genre) { countQuery += ' AND genres LIKE ?'; countParams.push(`%${genre}%`) }
    if (type) { countQuery += ' AND type = ?'; countParams.push(type) }
    if (year) { countQuery += ' AND release_year = ?'; countParams.push(parseInt(year)) }

    const total = await db.prepare(countQuery).bind(...countParams).first()

    return c.json({
      data: results.results || [],
      total: (total as any)?.total || 0,
      page, limit
    })
  } catch (e: any) {
    return c.json({ data: [], total: 0, page, limit, error: e.message }, 500)
  }
})

// Quick autocomplete
searchRoutes.get('/quick', async (c) => {
  const q = c.req.query('q') || ''
  if (!q || q.length < 2) return c.json({ data: [] })
  const db = c.env?.DB
  try {
    if (!db) throw new Error('No DB')
    const results = await db.prepare(`
      SELECT id, title, title_native, cover_image, slug, status, type, release_year
      FROM anime WHERE title LIKE ? OR title_native LIKE ? OR title_english LIKE ?
      ORDER BY view_count DESC LIMIT 8
    `).bind(`%${q}%`, `%${q}%`, `%${q}%`).all()
    return c.json({ data: results.results || [] })
  } catch (e: any) {
    return c.json({ data: [] })
  }
})
