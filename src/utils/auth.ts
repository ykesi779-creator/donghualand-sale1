// Auth utilities using Web Crypto API (Cloudflare Workers compatible)

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + ':donghua-salt-2024')
  const hash = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const expectedHash = await hashPassword(password)
  return expectedHash === hash
}

export async function generateToken(payload: any, secret: string): Promise<string> {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify({ ...payload, exp: Date.now() + 86400000 * 30, iat: Date.now() }))
  const signature = await signHmac(`${header}.${body}`, secret)
  return `${header}.${body}.${signature}`
}

export async function verifyToken(token: string, secret: string): Promise<any> {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Invalid token')
  
  const [header, body, signature] = parts
  const expectedSig = await signHmac(`${header}.${body}`, secret)
  
  if (signature !== expectedSig) throw new Error('Invalid signature')
  
  const payload = JSON.parse(atob(body))
  if (payload.exp < Date.now()) throw new Error('Token expired')
  
  return payload
}

async function signHmac(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}
