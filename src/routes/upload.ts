// IMGBB Upload Route - Server-side secure upload
// IMGBB API key stays server-side (never exposed to frontend)

import { Hono } from 'hono'
import { verifyToken } from '../utils/auth'

type Bindings = {
  DB: D1Database
  JWT_SECRET: string
  IMGBB_API_KEY: string
}

export const uploadRoutes = new Hono<{ Bindings: Bindings }>()

// Helper: upload image to IMGBB via REST API
async function uploadToImgbb(
  imageData: string | ArrayBuffer,
  apiKey: string,
  name?: string,
  mimeType?: string
): Promise<{ url: string; display_url: string; delete_url: string; width: number; height: number }> {
  if (!apiKey) {
    throw new Error('IMGBB API key not configured. Please set IMGBB_API_KEY as a Cloudflare secret.')
  }

  const formData = new FormData()

  // Convert imageData to base64 string for IMGBB
  if (typeof imageData === 'string') {
    // Already base64 data URI or base64 string — strip the data URI prefix if present
    const base64 = imageData.replace(/^data:[^;]+;base64,/, '')
    formData.append('image', base64)
  } else {
    // ArrayBuffer — convert to base64
    const uint8 = new Uint8Array(imageData)
    let binary = ''
    for (let i = 0; i < uint8.length; i++) {
      binary += String.fromCharCode(uint8[i])
    }
    const base64 = btoa(binary)
    formData.append('image', base64)
  }

  if (name) {
    formData.append('name', name)
  }

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    let errText = ''
    try { errText = await response.text() } catch {}
    throw new Error(`IMGBB upload failed (${response.status}): ${errText}`)
  }

  const result = await response.json() as any
  if (!result.success) {
    throw new Error(`IMGBB error: ${result.error?.message || JSON.stringify(result.error) || 'Unknown error'}`)
  }

  return {
    url: result.data.url,
    display_url: result.data.display_url,
    delete_url: result.data.delete_url,
    width: result.data.width || 0,
    height: result.data.height || 0,
  }
}

// ==================== UPLOAD PROFILE IMAGE ====================
// POST /api/upload/profile-image
// Requires: Authorization header with user JWT token
// Body: multipart/form-data with 'image' field OR JSON with base64 'data' field
uploadRoutes.post('/profile-image', async (c) => {
  const auth = c.req.header('Authorization')
  if (!auth) return c.json({ error: 'Authentication required' }, 401)

  try {
    const token = auth.replace('Bearer ', '')
    const payload = await verifyToken(token, c.env.JWT_SECRET || 'donghua-secret-key-2024')

    const apiKey = c.env.IMGBB_API_KEY

    if (!apiKey) {
      return c.json({ error: 'Image upload service not configured. Please contact admin.' }, 503)
    }

    const contentType = c.req.header('Content-Type') || ''
    let imageData: string | ArrayBuffer
    let mimeType = 'image/jpeg'

    if (contentType.includes('multipart/form-data')) {
      const formData = await c.req.formData()
      const file = formData.get('image') as File | null
      if (!file) return c.json({ error: 'No image file provided' }, 400)

      // Validate file type
      if (!file.type.startsWith('image/')) {
        return c.json({ error: 'Only image files are allowed' }, 400)
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return c.json({ error: 'Image must be smaller than 5MB' }, 400)
      }
      mimeType = file.type
      imageData = await file.arrayBuffer()
    } else {
      // JSON with base64
      const body = await c.req.json()
      if (!body.data) return c.json({ error: 'No image data provided' }, 400)
      imageData = body.data // base64 data URI
    }

    const imgName = `user_${payload.id}_profile`
    const result = await uploadToImgbb(imageData, apiKey, imgName, mimeType)

    // Update user profile_image in DB
    await c.env.DB.prepare(
      'UPDATE users SET profile_image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(result.url, payload.id).run()

    return c.json({
      success: true,
      url: result.url,
      display_url: result.display_url,
    })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// ==================== UPLOAD COVER IMAGE ====================
// POST /api/upload/cover-image
uploadRoutes.post('/cover-image', async (c) => {
  const auth = c.req.header('Authorization')
  if (!auth) return c.json({ error: 'Authentication required' }, 401)

  try {
    const token = auth.replace('Bearer ', '')
    const payload = await verifyToken(token, c.env.JWT_SECRET || 'donghua-secret-key-2024')

    const apiKey = c.env.IMGBB_API_KEY

    if (!apiKey) {
      return c.json({ error: 'Image upload service not configured. Please contact admin.' }, 503)
    }

    const contentType = c.req.header('Content-Type') || ''
    let imageData: string | ArrayBuffer
    let mimeType = 'image/jpeg'

    if (contentType.includes('multipart/form-data')) {
      const formData = await c.req.formData()
      const file = formData.get('image') as File | null
      if (!file) return c.json({ error: 'No image file provided' }, 400)
      if (!file.type.startsWith('image/')) return c.json({ error: 'Only image files are allowed' }, 400)
      if (file.size > 10 * 1024 * 1024) return c.json({ error: 'Image must be smaller than 10MB' }, 400)
      mimeType = file.type
      imageData = await file.arrayBuffer()
    } else {
      const body = await c.req.json()
      if (!body.data) return c.json({ error: 'No image data provided' }, 400)
      imageData = body.data
    }

    const imgName = `user_${payload.id}_cover`
    const result = await uploadToImgbb(imageData, apiKey, imgName, mimeType)

    // Update user cover_image in DB
    await c.env.DB.prepare(
      'UPDATE users SET cover_image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(result.url, payload.id).run()

    return c.json({
      success: true,
      url: result.url,
      display_url: result.display_url,
    })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// ==================== ADMIN IMAGE UPLOAD ====================
// POST /api/upload/admin
// Admin can upload any image (anime cover, banner, episode thumbnail)
// Requires: Admin token in Authorization header
uploadRoutes.post('/admin', async (c) => {
  const auth = c.req.header('Authorization')
  if (!auth) return c.json({ error: 'Authentication required' }, 401)

  try {
    const token = auth.replace('Bearer ', '')
    const payload = await verifyToken(token, c.env.JWT_SECRET || 'donghua-secret-key-2024')

    // Must be admin
    if (payload.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403)
    }

    const apiKey = c.env.IMGBB_API_KEY

    if (!apiKey) {
      return c.json({ error: 'IMGBB not configured. Please set IMGBB_API_KEY as a Cloudflare secret.' }, 503)
    }

    const contentType = c.req.header('Content-Type') || ''
    let imageData: string | ArrayBuffer
    let uploadType = 'general'
    let mimeType = 'image/jpeg'
    let imgName = 'admin_upload'

    if (contentType.includes('multipart/form-data')) {
      const formData = await c.req.formData()
      const file = formData.get('image') as File | null
      if (!file) return c.json({ error: 'No image file provided' }, 400)
      if (!file.type.startsWith('image/')) return c.json({ error: 'Only image files are allowed' }, 400)
      if (file.size > 32 * 1024 * 1024) return c.json({ error: 'Image must be smaller than 32MB' }, 400)

      // Get optional type param
      uploadType = String(formData.get('type') || 'general')
      mimeType = file.type || 'image/jpeg'
      imgName = file.name?.replace(/\.[^.]+$/, '') || 'admin_upload'
      imageData = await file.arrayBuffer()
    } else {
      const body = await c.req.json()
      if (!body.data) return c.json({ error: 'No image data provided' }, 400)
      imageData = body.data
      uploadType = body.type || 'general'
      imgName = body.name || 'admin_upload'
    }

    // Build a descriptive image name
    const typePrefix: Record<string, string> = {
      cover: 'anime_cover',
      banner: 'anime_banner',
      thumbnail: 'ep_thumb',
      general: 'admin',
    }
    const finalName = `${typePrefix[uploadType] || 'admin'}_${imgName}_${Date.now()}`

    const result = await uploadToImgbb(imageData, apiKey, finalName, mimeType)

    return c.json({
      success: true,
      url: result.url,
      display_url: result.display_url,
      width: result.width,
      height: result.height,
      type: uploadType,
    })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})
