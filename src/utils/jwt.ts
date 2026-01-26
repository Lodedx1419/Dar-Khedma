// JWT utilities using Web Crypto API for Cloudflare Workers

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  exp: number;
}

const JWT_SECRET = 'darkhedma-secret-key-change-in-production'; // TODO: Move to environment variables

/**
 * Create a JWT token
 */
export async function createJWT(payload: Omit<JWTPayload, 'exp'>): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  
  // Token expires in 7 days
  const expiresIn = 7 * 24 * 60 * 60; // 7 days in seconds
  const exp = Math.floor(Date.now() / 1000) + expiresIn;
  
  const fullPayload: JWTPayload = {
    ...payload,
    exp
  };
  
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  
  const signature = await sign(`${encodedHeader}.${encodedPayload}`, JWT_SECRET);
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const [encodedHeader, encodedPayload, signature] = parts;
    
    // Verify signature
    const expectedSignature = await sign(`${encodedHeader}.${encodedPayload}`, JWT_SECRET);
    if (signature !== expectedSignature) {
      return null;
    }
    
    // Decode payload
    const payload: JWTPayload = JSON.parse(base64UrlDecode(encodedPayload));
    
    // Check expiration
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Sign data using HMAC SHA-256
 */
async function sign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const msgData = encoder.encode(data);
  
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, msgData);
  return base64UrlEncode(signature);
}

/**
 * Base64 URL encode
 */
function base64UrlEncode(data: string | ArrayBuffer): string {
  let base64: string;
  
  if (typeof data === 'string') {
    base64 = btoa(data);
  } else {
    const bytes = new Uint8Array(data);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    base64 = btoa(binary);
  }
  
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Base64 URL decode
 */
function base64UrlDecode(data: string): string {
  let base64 = data
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  // Add padding
  const padding = base64.length % 4;
  if (padding) {
    base64 += '='.repeat(4 - padding);
  }
  
  return atob(base64);
}

/**
 * Hash password using SHA-256 (simple implementation for demo)
 * Note: In production, consider using a more secure hashing algorithm
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}
