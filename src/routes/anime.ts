import { Hono } from 'hono'
import { slugify } from '../utils/helpers'

type Bindings = { DB: D1Database }
export const animeRoutes = new Hono<{ Bindings: Bindings }>()

// GET all anime
animeRoutes.get('/', async (c) => {
  const db = c.env?.DB
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '20')
  const status = c.req.query('status') || ''
  const q = c.req.query('q') || ''
  const offset = (page - 1) * limit

  try {
    if (!db) throw new Error('No DB')
    let query = 'SELECT a.*, COUNT(e.id) as episode_count, MAX(e.episode_number) as latest_ep FROM anime a LEFT JOIN episodes e ON a.id = e.anime_id'
    const params: any[] = []
    const wheres: string[] = []
    if (status) { wheres.push('a.status = ?'); params.push(status) }
    if (q) { wheres.push('(a.title LIKE ? OR a.title_native LIKE ?)'); params.push(`%${q}%`, `%${q}%`) }
    if (wheres.length) query += ' WHERE ' + wheres.join(' AND ')
    query += ' GROUP BY a.id ORDER BY a.updated_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const results = await db.prepare(query).bind(...params).all()
    const countQ = 'SELECT COUNT(*) as total FROM anime' + (wheres.length ? ' WHERE ' + wheres.join(' AND ') : '')
    const count = await db.prepare(countQ).bind(...params.slice(0, -2)).first()

    const data = results.results || []
    return c.json({ data, total: (count as any)?.total || 0, page, limit })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// GET single anime
animeRoutes.get('/:id', async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB
  try {
    const isNum = /^\d+$/.test(id)
    const anime = await db.prepare(`SELECT * FROM anime WHERE ${isNum ? 'id' : 'slug'} = ?`).bind(isNum ? parseInt(id) : id).first()
    if (!anime) return c.json({ error: 'Not found' }, 404)
    
    const episodes = await db.prepare('SELECT * FROM episodes WHERE anime_id = ? ORDER BY episode_number ASC').bind((anime as any).id).all()
    return c.json({ ...anime, episodes: episodes.results })
  } catch(e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// POST create anime
animeRoutes.post('/', async (c) => {
  const db = c.env.DB
  try {
    const body = await c.req.json()
    const { title, title_native, title_english, description, cover_image, banner_image, 
            trailer_url, status, type, release_year, genres, studios, rating, vote_count,
            duration, country, language, is_featured, is_trending, is_popular, tmdb_id, season } = body
    
    if (!title) return c.json({ error: 'Title required' }, 400)
    
    let slug = body.slug || slugify(title)
    // Ensure slug uniqueness
    const existing = await db.prepare('SELECT id FROM anime WHERE slug = ?').bind(slug).first()
    if (existing) slug = slug + '-' + Date.now()
    
    const result = await db.prepare(`
      INSERT INTO anime (tmdb_id, title, title_native, title_english, slug, description, 
        cover_image, banner_image, trailer_url, status, type, release_year, season, genres, studios, 
        rating, vote_count, duration, country, language, is_featured, is_trending, is_popular, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      tmdb_id || null, title, title_native || null, title_english || null, slug, description || null,
      cover_image || null, banner_image || null, trailer_url || null,
      status || 'Ongoing', type || 'ONA', release_year || null, season || null,
      JSON.stringify(Array.isArray(genres) ? genres : (genres ? String(genres).split(',').map((g: string) => g.trim()) : [])),
      JSON.stringify(Array.isArray(studios) ? studios : (studios ? String(studios).split(',').map((s: string) => s.trim()) : [])),
      rating || 0, vote_count || 0, duration || null, country || 'CN', language || 'Chinese',
      is_featured ? 1 : 0, is_trending ? 1 : 0, is_popular ? 1 : 0
    ).run()
    
    return c.json({ success: true, id: result.meta.last_row_id, slug })
  } catch(e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// PUT update anime
animeRoutes.put('/:id', async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB
  try {
    const body = await c.req.json()
    const { title, title_native, title_english, description, cover_image, banner_image,
            trailer_url, status, type, release_year, genres, studios, rating, vote_count,
            duration, country, language, is_featured, is_trending, is_popular, season, slug } = body
    
    const genresJson = JSON.stringify(Array.isArray(genres) ? genres : (genres ? String(genres).split(',').map((g: string) => g.trim()) : []))
    const studiosJson = JSON.stringify(Array.isArray(studios) ? studios : (studios ? String(studios).split(',').map((s: string) => s.trim()) : []))
    
    await db.prepare(`
      UPDATE anime SET title=?, title_native=?, title_english=?, slug=?, description=?, 
        cover_image=?, banner_image=?, trailer_url=?, status=?, type=?, release_year=?, season=?,
        genres=?, studios=?, rating=?, vote_count=?, duration=?, country=?, language=?,
        is_featured=?, is_trending=?, is_popular=?, updated_at=CURRENT_TIMESTAMP
      WHERE id=?
    `).bind(
      title, title_native || null, title_english || null, slug || slugify(title), description || null,
      cover_image || null, banner_image || null, trailer_url || null,
      status || 'Ongoing', type || 'ONA', release_year || null, season || null,
      genresJson, studiosJson, rating || 0, vote_count || 0, duration || null,
      country || 'CN', language || 'Chinese',
      is_featured ? 1 : 0, is_trending ? 1 : 0, is_popular ? 1 : 0, parseInt(id)
    ).run()
    
    return c.json({ success: true })
  } catch(e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// DELETE anime
animeRoutes.delete('/:id', async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB
  try {
    await db.prepare('DELETE FROM anime WHERE id = ?').bind(parseInt(id)).run()
    return c.json({ success: true })
  } catch(e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// PATCH - Toggle featured/trending/popular
animeRoutes.patch('/:id/:field', async (c) => {
  const id = c.req.param('id')
  const field = c.req.param('field')
  const allowed = ['is_featured', 'is_trending', 'is_popular']
  if (!allowed.includes(field)) return c.json({ error: 'Invalid field' }, 400)
  
  const db = c.env.DB
  try {
    const anime = await db.prepare(`SELECT ${field} FROM anime WHERE id = ?`).bind(parseInt(id)).first()
    if (!anime) return c.json({ error: 'Not found' }, 404)
    
    const current = (anime as any)[field]
    await db.prepare(`UPDATE anime SET ${field} = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(current ? 0 : 1, parseInt(id)).run()
    return c.json({ success: true, value: !current })
  } catch(e: any) {
    return c.json({ error: e.message }, 500)
  }
})
