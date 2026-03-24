import { Hono } from 'hono'

type Bindings = { DB: D1Database }
export const episodeRoutes = new Hono<{ Bindings: Bindings }>()

// GET episodes for an anime
episodeRoutes.get('/anime/:animeId', async (c) => {
  const animeId = c.req.param('animeId')
  const db = c.env.DB
  try {
    const episodes = await db.prepare(
      'SELECT * FROM episodes WHERE anime_id = ? ORDER BY episode_number ASC'
    ).bind(parseInt(animeId)).all()
    return c.json({ data: episodes.results })
  } catch(e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// GET single episode
episodeRoutes.get('/:id', async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB
  try {
    const ep = await db.prepare('SELECT * FROM episodes WHERE id = ?').bind(parseInt(id)).first()
    if (!ep) return c.json({ error: 'Not found' }, 404)
    return c.json(ep)
  } catch(e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// POST create episode
episodeRoutes.post('/', async (c) => {
  const db = c.env.DB
  try {
    const body = await c.req.json()
    const { anime_id, episode_number, title, description, thumbnail, embed_url, duration, air_date } = body
    
    if (!anime_id || !episode_number || !embed_url) {
      return c.json({ error: 'anime_id, episode_number, and embed_url are required' }, 400)
    }
    
    // Check for existing episode with same number
    const existing = await db.prepare(
      'SELECT id FROM episodes WHERE anime_id = ? AND episode_number = ?'
    ).bind(parseInt(anime_id), parseInt(episode_number)).first()
    
    if (existing) {
      return c.json({ error: `Episode ${episode_number} already exists for this anime` }, 409)
    }
    
    const result = await db.prepare(`
      INSERT INTO episodes (anime_id, episode_number, title, description, thumbnail, embed_url, duration, air_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      parseInt(anime_id), parseInt(episode_number), title || null, description || null,
      thumbnail || null, embed_url, duration || 0, air_date || null
    ).run()
    
    // Update anime episode count and timestamp
    await db.prepare(`
      UPDATE anime SET 
        episode_count = (SELECT COUNT(*) FROM episodes WHERE anime_id = ?),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(parseInt(anime_id), parseInt(anime_id)).run()
    
    return c.json({ success: true, id: result.meta.last_row_id })
  } catch(e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// PUT update episode
episodeRoutes.put('/:id', async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB
  try {
    const body = await c.req.json()
    const { episode_number, title, description, thumbnail, embed_url, duration, air_date } = body
    
    await db.prepare(`
      UPDATE episodes SET 
        episode_number = ?, title = ?, description = ?, thumbnail = ?,
        embed_url = ?, duration = ?, air_date = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      parseInt(episode_number), title || null, description || null, thumbnail || null,
      embed_url, duration || 0, air_date || null, parseInt(id)
    ).run()
    
    return c.json({ success: true })
  } catch(e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// DELETE episode
episodeRoutes.delete('/:id', async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB
  try {
    const ep = await db.prepare('SELECT anime_id FROM episodes WHERE id = ?').bind(parseInt(id)).first()
    if (!ep) return c.json({ error: 'Not found' }, 404)
    
    await db.prepare('DELETE FROM episodes WHERE id = ?').bind(parseInt(id)).run()
    
    // Update anime episode count
    const animeId = (ep as any).anime_id
    await db.prepare(`
      UPDATE anime SET 
        episode_count = (SELECT COUNT(*) FROM episodes WHERE anime_id = ?),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(animeId, animeId).run()
    
    return c.json({ success: true })
  } catch(e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// Bulk add episodes
episodeRoutes.post('/bulk', async (c) => {
  const db = c.env.DB
  try {
    const body = await c.req.json()
    const { anime_id, episodes } = body
    if (!anime_id || !Array.isArray(episodes)) return c.json({ error: 'Invalid data' }, 400)
    
    let added = 0
    let errors = []
    
    for (const ep of episodes) {
      try {
        const existing = await db.prepare(
          'SELECT id FROM episodes WHERE anime_id = ? AND episode_number = ?'
        ).bind(parseInt(anime_id), parseInt(ep.episode_number)).first()
        
        if (!existing) {
          await db.prepare(`
            INSERT INTO episodes (anime_id, episode_number, title, description, thumbnail, embed_url, duration, air_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            parseInt(anime_id), parseInt(ep.episode_number), ep.title || null, ep.description || null,
            ep.thumbnail || null, ep.embed_url, ep.duration || 0, ep.air_date || null
          ).run()
          added++
        }
      } catch(e: any) {
        errors.push({ episode: ep.episode_number, error: e.message })
      }
    }
    
    await db.prepare(`UPDATE anime SET episode_count = (SELECT COUNT(*) FROM episodes WHERE anime_id = ?), updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(parseInt(anime_id), parseInt(anime_id)).run()
    
    return c.json({ success: true, added, errors })
  } catch(e: any) {
    return c.json({ error: e.message }, 500)
  }
})
