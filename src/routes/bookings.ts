// Bookings routes

import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import { execute, query, queryOne } from '../utils/db';

type Bindings = {
  DB: D1Database;
};

const bookings = new Hono<{ Bindings: Bindings }>();

// All routes require authentication
bookings.use('*', authMiddleware);

/**
 * Create a new booking
 * POST /api/bookings
 */
bookings.post('/', async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    const {
      service_id,
      pricing_id,
      booking_type,
      service_mode,
      start_date,
      end_date,
      duration_info,
      service_address,
      special_requirements
    } = body;
    
    // Validation
    if (!service_id || !pricing_id || !booking_type || !service_mode || !start_date || !service_address) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // Get pricing to calculate total
    const pricing = await queryOne(
      c.env.DB,
      'SELECT * FROM service_pricing WHERE id = ?',
      [pricing_id]
    );
    
    if (!pricing) {
      return c.json({ error: 'Invalid pricing option' }, 400);
    }
    
    // Create booking
    const result = await execute(
      c.env.DB,
      `INSERT INTO bookings (
        user_id, service_id, pricing_id, booking_type, service_mode,
        start_date, end_date, duration_info, total_price, service_address,
        special_requirements, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        user.userId,
        service_id,
        pricing_id,
        booking_type,
        service_mode,
        start_date,
        end_date || null,
        duration_info ? JSON.stringify(duration_info) : null,
        pricing.price,
        service_address,
        special_requirements || null
      ]
    );
    
    return c.json({
      success: true,
      booking_id: result.meta.last_row_id,
      message: 'Booking created successfully'
    }, 201);
  } catch (error) {
    console.error('Create booking error:', error);
    return c.json({ error: 'Failed to create booking' }, 500);
  }
});

/**
 * Get user's bookings
 * GET /api/bookings
 */
bookings.get('/', async (c) => {
  try {
    const user = c.get('user');
    const status = c.req.query('status');
    
    let sql = `
      SELECT 
        b.*,
        s.name as service_name,
        sc.name as category_name,
        sp.price,
        sp.duration_type,
        prov.full_name as provider_name,
        prov.phone as provider_phone
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN service_categories sc ON s.category_id = sc.id
      JOIN service_pricing sp ON b.pricing_id = sp.id
      LEFT JOIN service_providers prov ON b.assigned_provider_id = prov.id
      WHERE b.user_id = ?
    `;
    const params: any[] = [user.userId];
    
    if (status) {
      sql += ' AND b.status = ?';
      params.push(status);
    }
    
    sql += ' ORDER BY b.created_at DESC';
    
    const userBookings = await query(c.env.DB, sql, params);
    return c.json({ bookings: userBookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    return c.json({ error: 'Failed to fetch bookings' }, 500);
  }
});

/**
 * Get a specific booking
 * GET /api/bookings/:id
 */
bookings.get('/:id', async (c) => {
  try {
    const user = c.get('user');
    const bookingId = parseInt(c.req.param('id'));
    
    const booking = await queryOne(
      c.env.DB,
      `SELECT 
        b.*,
        s.name as service_name,
        s.description as service_description,
        sc.name as category_name,
        sp.price,
        sp.duration_type,
        sp.description as pricing_description,
        prov.full_name as provider_name,
        prov.phone as provider_phone,
        prov.email as provider_email
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN service_categories sc ON s.category_id = sc.id
      JOIN service_pricing sp ON b.pricing_id = sp.id
      LEFT JOIN service_providers prov ON b.assigned_provider_id = prov.id
      WHERE b.id = ? AND b.user_id = ?`,
      [bookingId, user.userId]
    );
    
    if (!booking) {
      return c.json({ error: 'Booking not found' }, 404);
    }
    
    return c.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    return c.json({ error: 'Failed to fetch booking' }, 500);
  }
});

/**
 * Cancel a booking
 * PUT /api/bookings/:id/cancel
 */
bookings.put('/:id/cancel', async (c) => {
  try {
    const user = c.get('user');
    const bookingId = parseInt(c.req.param('id'));
    
    // Check if booking exists and belongs to user
    const booking = await queryOne(
      c.env.DB,
      'SELECT * FROM bookings WHERE id = ? AND user_id = ?',
      [bookingId, user.userId]
    );
    
    if (!booking) {
      return c.json({ error: 'Booking not found' }, 404);
    }
    
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return c.json({ error: 'Cannot cancel this booking' }, 400);
    }
    
    await execute(
      c.env.DB,
      `UPDATE bookings SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [bookingId]
    );
    
    return c.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    return c.json({ error: 'Failed to cancel booking' }, 500);
  }
});

export default bookings;
