// Admin routes - requires admin authentication

import { Hono } from 'hono';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import { execute, query, queryOne } from '../utils/db';

type Bindings = {
  DB: D1Database;
};

const admin = new Hono<{ Bindings: Bindings }>();

// All routes require admin authentication
admin.use('*', authMiddleware, adminMiddleware);

/**
 * Get dashboard statistics
 * GET /api/admin/stats
 */
admin.get('/stats', async (c) => {
  try {
    const db = c.env.DB;
    
    // Get counts
    const [users, bookings, providers, pendingProviders, pendingBookings, contacts] = await Promise.all([
      queryOne<{count: number}>(db, 'SELECT COUNT(*) as count FROM users WHERE role = "user"'),
      queryOne<{count: number}>(db, 'SELECT COUNT(*) as count FROM bookings'),
      queryOne<{count: number}>(db, 'SELECT COUNT(*) as count FROM service_providers WHERE status = "approved"'),
      queryOne<{count: number}>(db, 'SELECT COUNT(*) as count FROM service_providers WHERE status = "pending"'),
      queryOne<{count: number}>(db, 'SELECT COUNT(*) as count FROM bookings WHERE status = "pending"'),
      queryOne<{count: number}>(db, 'SELECT COUNT(*) as count FROM contact_submissions WHERE status = "new"')
    ]);
    
    // Get recent bookings
    const recentBookings = await query(
      db,
      `SELECT b.*, u.full_name as user_name, s.name as service_name
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN services s ON b.service_id = s.id
       ORDER BY b.created_at DESC
       LIMIT 10`
    );
    
    return c.json({
      stats: {
        total_users: users?.count || 0,
        total_bookings: bookings?.count || 0,
        approved_providers: providers?.count || 0,
        pending_providers: pendingProviders?.count || 0,
        pending_bookings: pendingBookings?.count || 0,
        new_contacts: contacts?.count || 0
      },
      recent_bookings: recentBookings
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return c.json({ error: 'Failed to fetch statistics' }, 500);
  }
});

/**
 * Get all users
 * GET /api/admin/users
 */
admin.get('/users', async (c) => {
  try {
    const users = await query(
      c.env.DB,
      `SELECT id, email, full_name, phone, role, account_type, business_name, 
              city, is_active, created_at
       FROM users
       ORDER BY created_at DESC`
    );
    return c.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

/**
 * Get all bookings (admin view)
 * GET /api/admin/bookings
 */
admin.get('/bookings', async (c) => {
  try {
    const status = c.req.query('status');
    
    let sql = `
      SELECT 
        b.*,
        u.full_name as user_name,
        u.email as user_email,
        u.phone as user_phone,
        s.name as service_name,
        sc.name as category_name,
        sp.price,
        prov.full_name as provider_name
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN services s ON b.service_id = s.id
      JOIN service_categories sc ON s.category_id = sc.id
      JOIN service_pricing sp ON b.pricing_id = sp.id
      LEFT JOIN service_providers prov ON b.assigned_provider_id = prov.id
    `;
    const params: any[] = [];
    
    if (status) {
      sql += ' WHERE b.status = ?';
      params.push(status);
    }
    
    sql += ' ORDER BY b.created_at DESC';
    
    const bookingsData = await query(c.env.DB, sql, params);
    return c.json({ bookings: bookingsData });
  } catch (error) {
    console.error('Get bookings error:', error);
    return c.json({ error: 'Failed to fetch bookings' }, 500);
  }
});

/**
 * Update booking status
 * PUT /api/admin/bookings/:id
 */
admin.put('/bookings/:id', async (c) => {
  try {
    const bookingId = parseInt(c.req.param('id'));
    const body = await c.req.json();
    const { status, assigned_provider_id, notes } = body;
    
    await execute(
      c.env.DB,
      `UPDATE bookings 
       SET status = ?, assigned_provider_id = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status, assigned_provider_id || null, notes || null, bookingId]
    );
    
    return c.json({ success: true, message: 'Booking updated successfully' });
  } catch (error) {
    console.error('Update booking error:', error);
    return c.json({ error: 'Failed to update booking' }, 500);
  }
});

/**
 * Get all service providers
 * GET /api/admin/providers
 */
admin.get('/providers', async (c) => {
  try {
    const status = c.req.query('status');
    
    let sql = 'SELECT * FROM service_providers';
    const params: any[] = [];
    
    if (status) {
      sql += ' WHERE status = ?';
      params.push(status);
    }
    
    sql += ' ORDER BY created_at DESC';
    
    const providers = await query(c.env.DB, sql, params);
    return c.json({ providers });
  } catch (error) {
    console.error('Get providers error:', error);
    return c.json({ error: 'Failed to fetch providers' }, 500);
  }
});

/**
 * Update service provider status
 * PUT /api/admin/providers/:id
 */
admin.put('/providers/:id', async (c) => {
  try {
    const providerId = parseInt(c.req.param('id'));
    const body = await c.req.json();
    const { status, notes } = body;
    
    if (!['pending', 'approved', 'rejected', 'suspended'].includes(status)) {
      return c.json({ error: 'Invalid status' }, 400);
    }
    
    await execute(
      c.env.DB,
      `UPDATE service_providers 
       SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status, notes || null, providerId]
    );
    
    return c.json({ success: true, message: 'Provider status updated successfully' });
  } catch (error) {
    console.error('Update provider error:', error);
    return c.json({ error: 'Failed to update provider' }, 500);
  }
});

/**
 * Get all contact submissions
 * GET /api/admin/contacts
 */
admin.get('/contacts', async (c) => {
  try {
    const status = c.req.query('status');
    
    let sql = 'SELECT * FROM contact_submissions';
    const params: any[] = [];
    
    if (status) {
      sql += ' WHERE status = ?';
      params.push(status);
    }
    
    sql += ' ORDER BY created_at DESC';
    
    const contacts = await query(c.env.DB, sql, params);
    return c.json({ contacts });
  } catch (error) {
    console.error('Get contacts error:', error);
    return c.json({ error: 'Failed to fetch contacts' }, 500);
  }
});

/**
 * Update contact submission status
 * PUT /api/admin/contacts/:id
 */
admin.put('/contacts/:id', async (c) => {
  try {
    const contactId = parseInt(c.req.param('id'));
    const body = await c.req.json();
    const { status } = body;
    
    if (!['new', 'read', 'responded'].includes(status)) {
      return c.json({ error: 'Invalid status' }, 400);
    }
    
    await execute(
      c.env.DB,
      'UPDATE contact_submissions SET status = ? WHERE id = ?',
      [status, contactId]
    );
    
    return c.json({ success: true, message: 'Contact status updated successfully' });
  } catch (error) {
    console.error('Update contact error:', error);
    return c.json({ error: 'Failed to update contact' }, 500);
  }
});

/**
 * Manage services
 * GET /api/admin/services
 */
admin.get('/services', async (c) => {
  try {
    const services = await query(
      c.env.DB,
      `SELECT s.*, sc.name as category_name
       FROM services s
       JOIN service_categories sc ON s.category_id = sc.id
       ORDER BY sc.display_order, s.name`
    );
    return c.json({ services });
  } catch (error) {
    console.error('Get services error:', error);
    return c.json({ error: 'Failed to fetch services' }, 500);
  }
});

/**
 * Update service
 * PUT /api/admin/services/:id
 */
admin.put('/services/:id', async (c) => {
  try {
    const serviceId = parseInt(c.req.param('id'));
    const body = await c.req.json();
    const { name, description, is_active } = body;
    
    await execute(
      c.env.DB,
      `UPDATE services 
       SET name = ?, description = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, description, is_active, serviceId]
    );
    
    return c.json({ success: true, message: 'Service updated successfully' });
  } catch (error) {
    console.error('Update service error:', error);
    return c.json({ error: 'Failed to update service' }, 500);
  }
});

/**
 * Get all pricing options for admin management
 * GET /api/admin/pricing
 */
admin.get('/pricing', async (c) => {
  try {
    const serviceId = c.req.query('service_id');
    
    let sql = `
      SELECT sp.*, s.name as service_name
      FROM service_pricing sp
      JOIN services s ON sp.service_id = s.id
    `;
    const params: any[] = [];
    
    if (serviceId) {
      sql += ' WHERE sp.service_id = ?';
      params.push(parseInt(serviceId));
    }
    
    sql += ' ORDER BY s.name, sp.pricing_type, sp.price';
    
    const pricing = await query(c.env.DB, sql, params);
    return c.json({ pricing });
  } catch (error) {
    console.error('Get pricing error:', error);
    return c.json({ error: 'Failed to fetch pricing' }, 500);
  }
});

/**
 * Update pricing
 * PUT /api/admin/pricing/:id
 */
admin.put('/pricing/:id', async (c) => {
  try {
    const pricingId = parseInt(c.req.param('id'));
    const body = await c.req.json();
    const { price, description, is_active } = body;
    
    await execute(
      c.env.DB,
      `UPDATE service_pricing 
       SET price = ?, description = ?, is_active = ?
       WHERE id = ?`,
      [price, description, is_active, pricingId]
    );
    
    return c.json({ success: true, message: 'Pricing updated successfully' });
  } catch (error) {
    console.error('Update pricing error:', error);
    return c.json({ error: 'Failed to update pricing' }, 500);
  }
});

export default admin;
