import { Hono } from 'hono'

type Bindings = { DB: D1Database, TMDB_API_KEY: string }
export const tmdbRoutes = new Hono<{ Bindings: Bindings }>()

const TMDB_BASE = 'https://api.themoviedb.org/3'
const TMDB_IMAGE = 'https://image.tmdb.org/t/p'

// Search TMDB
tmdbRoutes.get('/search', async (c) => {
  const query = c.req.query('q') || ''
  const lang = c.req.query('lang') || 'zh-CN'
  const page = c.req.query('page') || '1'
  const apiKey = c.req.query('api_key') || c.env.TMDB_API_KEY || ''
  
  if (!apiKey) return c.json({ error: 'TMDB API key not configured' }, 400)
  if (!query) return c.json({ error: 'Query required' }, 400)

  try {
    const url = `${TMDB_BASE}/search/tv?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=${lang}&page=${page}`
    const resp = await fetch(url)
    if (!resp.ok) return c.json({ error: 'TMDB API error: ' + resp.status }, resp.status)
    
    const data = await resp.json() as any
    
    // Transform results
    const results = (data.results || []).map((item: any) => ({
      id: item.id,
      title: item.name,
      title_english: item.original_name,
      overview: item.overview,
      cover_image: item.poster_path ? `${TMDB_IMAGE}/w500${item.poster_path}` : null,
      banner_image: item.backdrop_path ? `${TMDB_IMAGE}/original${item.backdrop_path}` : null,
      release_year: item.first_air_date ? new Date(item.first_air_date).getFullYear() : null,
      rating: item.vote_average,
      vote_count: item.vote_count,
      genres: item.genre_ids,
      popularity: item.popularity,
      original_language: item.original_language,
    }))
    
    return c.json({ results, total: data.total_results, total_pages: data.total_pages })
  } catch(e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// Get TMDB TV Show details
tmdbRoutes.get('/tv/:id', async (c) => {
  const id = c.req.param('id')
  const lang = c.req.query('lang') || 'zh-CN'
  const apiKey = c.req.query('api_key') || c.env.TMDB_API_KEY || ''
  
  if (!apiKey) return c.json({ error: 'TMDB API key not configured' }, 400)

  try {
    // Fetch main info + videos + images
    const [detailResp, videoResp, transResp] = await Promise.all([
      fetch(`${TMDB_BASE}/tv/${id}?api_key=${apiKey}&language=${lang}&append_to_response=credits,keywords`),
      fetch(`${TMDB_BASE}/tv/${id}/videos?api_key=${apiKey}&language=en-US`),
      fetch(`${TMDB_BASE}/tv/${id}/translations?api_key=${apiKey}`),
    ])
    
    if (!detailResp.ok) return c.json({ error: 'Not found on TMDB' }, 404)
    
    const detail = await detailResp.json() as any
    const videos = await videoResp.json() as any
    const translations = await transResp.json() as any
    
    // Find trailer
    const trailer = (videos.results || []).find((v: any) => v.type === 'Trailer' && v.site === 'YouTube')
    
    // Find Chinese and English translations
    const zhTrans = (translations.translations || []).find((t: any) => t.iso_639_1 === 'zh')
    const cnTrans = (translations.translations || []).find((t: any) => t.iso_639_1 === 'zh' && t.iso_3166_1 === 'CN')
    
    // Get studios
    const studios = (detail.production_companies || []).map((c: any) => c.name)
    
    // Get genres
    const genres = (detail.genres || []).map((g: any) => g.name)
    
    // Determine native title (Chinese if available)
    const nativeTitle = cnTrans?.data?.name || zhTrans?.data?.name || null
    
    // Determine country
    const countries = detail.origin_country || []
    const country = countries.includes('CN') ? 'CN' : countries.includes('JP') ? 'JP' : (countries[0] || 'CN')
    
    const transformed = {
      tmdb_id: detail.id,
      title: detail.name,
      title_native: nativeTitle,
      title_english: detail.original_name !== detail.name ? detail.original_name : null,
      description: (cnTrans?.data?.overview || detail.overview || ''),
      cover_image: detail.poster_path ? `${TMDB_IMAGE}/w500${detail.poster_path}` : null,
      banner_image: detail.backdrop_path ? `${TMDB_IMAGE}/original${detail.backdrop_path}` : null,
      trailer_url: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
      rating: detail.vote_average || 0,
      vote_count: detail.vote_count || 0,
      release_year: detail.first_air_date ? new Date(detail.first_air_date).getFullYear() : null,
      genres,
      studios,
      country,
      episode_count: detail.number_of_episodes || 0,
      seasons: detail.number_of_seasons || 1,
      status: mapTmdbStatus(detail.status),
      language: detail.original_language,
      networks: (detail.networks || []).map((n: any) => n.name),
    }
    
    return c.json(transformed)
  } catch(e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// Search anime specifically (Chinese animated series)
tmdbRoutes.get('/search/anime', async (c) => {
  const query = c.req.query('q') || ''
  const apiKey = c.req.query('api_key') || c.env.TMDB_API_KEY || ''
  const lang = c.req.query('lang') || 'zh-CN'
  
  if (!apiKey) return c.json({ error: 'TMDB API key not configured' }, 400)

  try {
    // Search in multiple languages for better results
    const [zhResp, enResp] = await Promise.all([
      fetch(`${TMDB_BASE}/search/tv?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=zh-CN`),
      fetch(`${TMDB_BASE}/search/tv?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=en-US`),
    ])
    
    const zhData = await zhResp.json() as any
    const enData = await enResp.json() as any
    
    // Merge and deduplicate results
    const allResults = [...(zhData.results || []), ...(enData.results || [])]
    const seen = new Set()
    const unique = allResults.filter(item => {
      if (seen.has(item.id)) return false
      seen.add(item.id)
      return true
    })
    
    const results = unique.slice(0, 20).map((item: any) => ({
      id: item.id,
      title: item.name,
      title_english: item.original_name,
      overview: item.overview,
      cover_image: item.poster_path ? `${TMDB_IMAGE}/w500${item.poster_path}` : null,
      banner_image: item.backdrop_path ? `${TMDB_IMAGE}/original${item.backdrop_path}` : null,
      release_year: item.first_air_date ? new Date(item.first_air_date).getFullYear() : null,
      rating: item.vote_average,
      vote_count: item.vote_count,
      popularity: item.popularity,
    }))
    
    return c.json({ results })
  } catch(e: any) {
    return c.json({ error: e.message }, 500)
  }
})

function mapTmdbStatus(status: string): string {
  const map: Record<string, string> = {
    'Returning Series': 'Ongoing',
    'In Production': 'Ongoing',
    'Planned': 'Upcoming',
    'Ended': 'Completed',
    'Canceled': 'Completed',
    'Pilot': 'Upcoming',
  }
  return map[status] || 'Ongoing'
}
