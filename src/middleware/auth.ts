// Authentication middleware

import { Context, Next } from 'hono';
import { verifyJWT, JWTPayload } from '../utils/jwt';

// Extend Hono context to include user
declare module 'hono' {
  interface ContextVariableMap {
    user: JWTPayload;
  }
}

/**
 * Authentication middleware - verify JWT token
 */
export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized - No token provided' }, 401);
  }
  
  const token = authHeader.substring(7);
  const payload = await verifyJWT(token);
  
  if (!payload) {
    return c.json({ error: 'Unauthorized - Invalid or expired token' }, 401);
  }
  
  // Store user info in context
  c.set('user', payload);
  
  await next();
}

/**
 * Admin-only middleware - verify user is admin
 */
export async function adminMiddleware(c: Context, next: Next) {
  const user = c.get('user');
  
  if (!user || user.role !== 'admin') {
    return c.json({ error: 'Forbidden - Admin access required' }, 403);
  }
  
  await next();
}

/**
 * Optional authentication - don't fail if no token
 */
export async function optionalAuthMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const payload = await verifyJWT(token);
    
    if (payload) {
      c.set('user', payload);
    }
  }
  
  await next();
}
