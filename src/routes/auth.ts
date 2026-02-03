// Authentication routes

import { Hono } from 'hono';
import { createJWT, hashPassword, verifyPassword } from '../utils/jwt';
import { getUserByEmail, createUser, getUserById } from '../utils/db';
import { authMiddleware } from '../middleware/auth';

type Bindings = {
  DB: D1Database;
};

const auth = new Hono<{ Bindings: Bindings }>();

/**
 * Register a new user
 * POST /api/auth/register
 */
auth.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, full_name, phone, account_type, business_name, business_registration, address, city } = body;
    
    // Validation
    if (!email || !password || !full_name) {
      return c.json({ error: 'Email, password, and full name are required' }, 400);
    }
    
    if (password.length < 6) {
      return c.json({ error: 'Password must be at least 6 characters' }, 400);
    }
    
    if (account_type === 'business' && !business_name) {
      return c.json({ error: 'Business name is required for business accounts' }, 400);
    }
    
    // Check if user already exists
    const existingUser = await getUserByEmail(c.env.DB, email);
    if (existingUser) {
      return c.json({ error: 'Email already registered' }, 400);
    }
    
    // Hash password
    const password_hash = await hashPassword(password);
    
    // Create user
    const userId = await createUser(c.env.DB, {
      email,
      password_hash,
      full_name,
      phone,
      account_type: account_type || 'individual',
      business_name,
      business_registration,
      address,
      city
    });
    
    // Create JWT token
    const token = await createJWT({
      userId,
      email,
      role: 'user'
    });
    
    return c.json({
      success: true,
      token,
      user: {
        id: userId,
        email,
        full_name,
        role: 'user',
        account_type: account_type || 'individual'
      }
    }, 201);
  } catch (error) {
    console.error('Register error:', error);
    return c.json({ error: 'Registration failed' }, 500);
  }
});

/**
 * Login user
 * POST /api/auth/login
 */
auth.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;
    
    // Validation
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }
    
    // Get user
    const user = await getUserByEmail(c.env.DB, email);
    if (!user) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }
    
    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }
    
    // Create JWT token
    const token = await createJWT({
      userId: user.id,
      email: user.email,
      role: user.role
    });
    
    return c.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        account_type: user.account_type,
        phone: user.phone,
        address: user.address,
        city: user.city,
        business_name: user.business_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});

/**
 * Get current user profile
 * GET /api/auth/me
 */
auth.get('/me', authMiddleware, async (c) => {
  try {
    const currentUser = c.get('user');
    const user = await getUserById(c.env.DB, currentUser.userId);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    return c.json({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      account_type: user.account_type,
      phone: user.phone,
      address: user.address,
      city: user.city,
      business_name: user.business_name,
      business_registration: user.business_registration,
      created_at: user.created_at
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return c.json({ error: 'Failed to get profile' }, 500);
  }
});

/**
 * Update user profile
 * PUT /api/auth/profile
 */
auth.put('/profile', authMiddleware, async (c) => {
  try {
    const currentUser = c.get('user');
    const body = await c.req.json();
    const { full_name, phone, address, city, business_name } = body;
    
    const db = c.env.DB;
    await db.prepare(
      `UPDATE users 
       SET full_name = ?, phone = ?, address = ?, city = ?, business_name = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).bind(full_name, phone, address, city, business_name, currentUser.userId).run();
    
    return c.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

export default auth;
