// Comments Route - Full CRUD with moderation support
import { Hono } from 'hono'
import { verifyToken } from '../utils/auth'

type Bindings = {
  DB: D1Database
  JWT_SECRET: string
}

export const commentRoutes = new Hono<{ Bindings: Bindings }>()

// Helper: get user from Authorization header (optional auth)
async function getOptionalUser(authHeader: string | undefined, jwtSecret: string) {
  if (!authHeader) return null
  try {
    const token = authHeader.replace('Bearer ', '')
    return await verifyToken(token, jwtSecret)
  } catch {
    return null
  }
}

// Helper: get required user (throws 401 if not authenticated)
async function requireUser(authHeader: string | undefined, jwtSecret: string) {
  const user = await getOptionalUser(authHeader, jwtSecret)
  if (!user) throw new Error('Authentication required')
  return user
}

// ==================== GET COMMENTS ====================
// GET /api/comments?anime_id=1&episode_id=1&page=1&limit=20
commentRoutes.get('/', async (c) => {
  const db = c.env.DB
  const animeId = c.req.query('anime_id')
  const episodeId = c.req.query('episode_id')
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '20')
  const offset = (page - 1) * limit

  if (!animeId && !episodeId) {
    return c.json({ error: 'anime_id or episode_id required' }, 400)
  }

  try {
    // Build query
    let whereClause = 'c.is_approved = 1 AND c.parent_id IS NULL'
    const params: any[] = []

    if (episodeId) {
      whereClause += ' AND c.episode_id = ?'
      params.push(parseInt(episodeId))
    } else if (animeId) {
      whereClause += ' AND c.anime_id = ? AND c.episode_id IS NULL'
      params.push(parseInt(animeId))
    }

    // Get top-level comments with user info
    const comments = await db.prepare(`
      SELECT 
        c.id, c.content, c.is_spoiler, c.likes, c.created_at, c.updated_at,
        c.anime_id, c.episode_id, c.parent_id,
        u.id as user_id, u.username, 
        COALESCE(u.profile_image, u.avatar) as user_avatar,
        u.role as user_role,
        (SELECT COUNT(*) FROM comments r WHERE r.parent_id = c.id AND r.is_approved = 1) as reply_count
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(...params, limit, offset).all()

    // Get total count
    const countRes = await db.prepare(`
      SELECT COUNT(*) as total FROM comments c
      WHERE ${whereClause}
    `).bind(...params).first()

    const total = (countRes as any)?.total || 0

    // Get replies for these comments
    const commentIds = (comments.results as any[]).map(c => c.id)
    let replies: any[] = []
    
    if (commentIds.length > 0) {
      const placeholders = commentIds.map(() => '?').join(',')
      const repliesRes = await db.prepare(`
        SELECT 
          c.id, c.content, c.is_spoiler, c.likes, c.created_at, c.updated_at,
          c.anime_id, c.episode_id, c.parent_id,
          u.id as user_id, u.username,
          COALESCE(u.profile_image, u.avatar) as user_avatar,
          u.role as user_role
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.parent_id IN (${placeholders}) AND c.is_approved = 1
        ORDER BY c.created_at ASC
      `).bind(...commentIds).all()
      replies = repliesRes.results as any[]
    }

    // Attach replies to parent comments
    const commentsWithReplies = (comments.results as any[]).map(comment => ({
      ...comment,
      replies: replies.filter(r => r.parent_id === comment.id)
    }))

    return c.json({
      success: true,
      data: commentsWithReplies,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// ==================== POST COMMENT ====================
// POST /api/comments
// Body: { anime_id?, episode_id?, content, is_spoiler?, parent_id? }
commentRoutes.post('/', async (c) => {
  const auth = c.req.header('Authorization')
  
  try {
    const user = await requireUser(auth, c.env.JWT_SECRET || 'donghua-secret-key-2024')
    const db = c.env.DB
    const body = await c.req.json()
    
    const { anime_id, episode_id, content, is_spoiler = false, parent_id } = body

    if (!content || content.trim().length === 0) {
      return c.json({ error: 'Comment content is required' }, 400)
    }
    if (content.length > 2000) {
      return c.json({ error: 'Comment too long (max 2000 characters)' }, 400)
    }
    if (!anime_id && !episode_id) {
      return c.json({ error: 'anime_id or episode_id required' }, 400)
    }

    // Check if parent comment exists (for replies)
    if (parent_id) {
      const parent = await db.prepare('SELECT id FROM comments WHERE id = ?').bind(parseInt(parent_id)).first()
      if (!parent) return c.json({ error: 'Parent comment not found' }, 404)
    }

    // Check settings for auto-approve
    const autoApprove = await db.prepare("SELECT value FROM settings WHERE key = 'comments_auto_approve'").first()
    const isApproved = (autoApprove as any)?.value === '0' ? 0 : 1

    const result = await db.prepare(`
      INSERT INTO comments (user_id, anime_id, episode_id, parent_id, content, is_spoiler, is_approved)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      user.id,
      anime_id ? parseInt(anime_id) : null,
      episode_id ? parseInt(episode_id) : null,
      parent_id ? parseInt(parent_id) : null,
      content.trim(),
      is_spoiler ? 1 : 0,
      isApproved
    ).run()

    // Fetch the created comment with user info
    const newComment = await db.prepare(`
      SELECT c.id, c.content, c.is_spoiler, c.likes, c.created_at, c.parent_id,
             u.id as user_id, u.username,
             COALESCE(u.profile_image, u.avatar) as user_avatar,
             u.role as user_role
      FROM comments c JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `).bind(result.meta.last_row_id).first()

    return c.json({ success: true, data: newComment, is_approved: isApproved === 1 })
  } catch (e: any) {
    if (e.message === 'Authentication required') {
      return c.json({ error: 'You must be logged in to comment' }, 401)
    }
    return c.json({ error: e.message }, 500)
  }
})

// ==================== DELETE COMMENT ====================
// DELETE /api/comments/:id
commentRoutes.delete('/:id', async (c) => {
  const auth = c.req.header('Authorization')
  const id = parseInt(c.req.param('id'))
  
  try {
    const user = await requireUser(auth, c.env.JWT_SECRET || 'donghua-secret-key-2024')
    const db = c.env.DB

    const comment = await db.prepare('SELECT * FROM comments WHERE id = ?').bind(id).first()
    if (!comment) return c.json({ error: 'Comment not found' }, 404)

    // Only owner or admin can delete
    if ((comment as any).user_id !== user.id && user.role !== 'admin') {
      return c.json({ error: 'Not authorized' }, 403)
    }

    // Delete comment and its replies
    await db.prepare('DELETE FROM comments WHERE id = ? OR parent_id = ?').bind(id, id).run()
    
    return c.json({ success: true })
  } catch (e: any) {
    if (e.message === 'Authentication required') return c.json({ error: e.message }, 401)
    return c.json({ error: e.message }, 500)
  }
})

// ==================== EDIT COMMENT ====================
// PUT /api/comments/:id
commentRoutes.put('/:id', async (c) => {
  const auth = c.req.header('Authorization')
  const id = parseInt(c.req.param('id'))
  
  try {
    const user = await requireUser(auth, c.env.JWT_SECRET || 'donghua-secret-key-2024')
    const db = c.env.DB
    const { content, is_spoiler } = await c.req.json()

    if (!content || content.trim().length === 0) return c.json({ error: 'Content required' }, 400)
    if (content.length > 2000) return c.json({ error: 'Comment too long' }, 400)

    const comment = await db.prepare('SELECT * FROM comments WHERE id = ?').bind(id).first()
    if (!comment) return c.json({ error: 'Comment not found' }, 404)
    if ((comment as any).user_id !== user.id) return c.json({ error: 'Not authorized' }, 403)

    await db.prepare(
      'UPDATE comments SET content = ?, is_spoiler = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(content.trim(), is_spoiler ? 1 : 0, id).run()

    return c.json({ success: true })
  } catch (e: any) {
    if (e.message === 'Authentication required') return c.json({ error: e.message }, 401)
    return c.json({ error: e.message }, 500)
  }
})

// ==================== LIKE/UNLIKE COMMENT ====================
// POST /api/comments/:id/like
commentRoutes.post('/:id/like', async (c) => {
  const auth = c.req.header('Authorization')
  const id = parseInt(c.req.param('id'))
  
  try {
    const user = await requireUser(auth, c.env.JWT_SECRET || 'donghua-secret-key-2024')
    const db = c.env.DB

    // Check if already liked
    const existing = await db.prepare(
      'SELECT id FROM comment_likes WHERE user_id = ? AND comment_id = ?'
    ).bind(user.id, id).first()

    if (existing) {
      // Unlike
      await db.prepare('DELETE FROM comment_likes WHERE user_id = ? AND comment_id = ?').bind(user.id, id).run()
      await db.prepare('UPDATE comments SET likes = MAX(0, likes - 1) WHERE id = ?').bind(id).run()
      return c.json({ success: true, action: 'unliked' })
    } else {
      // Like
      await db.prepare('INSERT INTO comment_likes (user_id, comment_id) VALUES (?, ?)').bind(user.id, id).run()
      await db.prepare('UPDATE comments SET likes = likes + 1 WHERE id = ?').bind(id).run()
      return c.json({ success: true, action: 'liked' })
    }
  } catch (e: any) {
    if (e.message === 'Authentication required') return c.json({ error: e.message }, 401)
    return c.json({ error: e.message }, 500)
  }
})

// ==================== ADMIN: GET ALL COMMENTS ====================
// GET /api/comments/admin/all?page=1&status=pending
commentRoutes.get('/admin/all', async (c) => {
  const auth = c.req.header('Authorization')
  
  try {
    const user = await requireUser(auth, c.env.JWT_SECRET || 'donghua-secret-key-2024')
    if (user.role !== 'admin') return c.json({ error: 'Admin access required' }, 403)
    
    const db = c.env.DB
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '30')
    const status = c.req.query('status') || 'all' // 'all', 'pending', 'approved'
    const offset = (page - 1) * limit

    let whereClause = '1=1'
    if (status === 'pending') whereClause = 'c.is_approved = 0'
    else if (status === 'approved') whereClause = 'c.is_approved = 1'

    const comments = await db.prepare(`
      SELECT 
        c.id, c.content, c.is_spoiler, c.is_approved, c.likes, c.created_at,
        c.anime_id, c.episode_id, c.parent_id,
        u.id as user_id, u.username,
        a.title as anime_title, a.slug as anime_slug,
        e.episode_number
      FROM comments c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN anime a ON c.anime_id = a.id
      LEFT JOIN episodes e ON c.episode_id = e.id
      WHERE ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(limit, offset).all()

    const countRes = await db.prepare(
      `SELECT COUNT(*) as total FROM comments c WHERE ${whereClause}`
    ).first()

    return c.json({
      success: true,
      data: comments.results,
      total: (countRes as any)?.total || 0,
      page,
      limit,
    })
  } catch (e: any) {
    if (e.message === 'Authentication required') return c.json({ error: e.message }, 401)
    return c.json({ error: e.message }, 500)
  }
})

// ==================== ADMIN: MODERATE COMMENT ====================
// PATCH /api/comments/:id/moderate
commentRoutes.patch('/:id/moderate', async (c) => {
  const auth = c.req.header('Authorization')
  const id = parseInt(c.req.param('id'))
  
  try {
    const user = await requireUser(auth, c.env.JWT_SECRET || 'donghua-secret-key-2024')
    if (user.role !== 'admin') return c.json({ error: 'Admin access required' }, 403)
    
    const db = c.env.DB
    const { action } = await c.req.json() // 'approve', 'reject', 'delete'

    if (action === 'approve') {
      await db.prepare('UPDATE comments SET is_approved = 1 WHERE id = ?').bind(id).run()
      return c.json({ success: true, status: 'approved' })
    } else if (action === 'reject') {
      await db.prepare('UPDATE comments SET is_approved = -1 WHERE id = ?').bind(id).run()
      return c.json({ success: true, status: 'rejected' })
    } else if (action === 'delete') {
      await db.prepare('DELETE FROM comments WHERE id = ? OR parent_id = ?').bind(id, id).run()
      return c.json({ success: true, status: 'deleted' })
    }

    return c.json({ error: 'Invalid action. Use: approve, reject, delete' }, 400)
  } catch (e: any) {
    if (e.message === 'Authentication required') return c.json({ error: e.message }, 401)
    return c.json({ error: e.message }, 500)
  }
})
