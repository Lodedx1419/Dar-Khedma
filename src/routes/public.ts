// Public routes (contact, provider applications)

import { Hono } from 'hono';
import { execute } from '../utils/db';

type Bindings = {
  DB: D1Database;
};

const publicRoutes = new Hono<{ Bindings: Bindings }>();

/**
 * Submit contact form
 * POST /api/contact
 */
publicRoutes.post('/contact', async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, phone, subject, message } = body;
    
    // Validation
    if (!name || !email || !message) {
      return c.json({ error: 'Name, email, and message are required' }, 400);
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: 'Invalid email address' }, 400);
    }
    
    // Create contact submission
    await execute(
      c.env.DB,
      `INSERT INTO contact_submissions (name, email, phone, subject, message)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, phone || null, subject || null, message]
    );
    
    return c.json({
      success: true,
      message: 'Thank you for contacting us. We will get back to you soon!'
    }, 201);
  } catch (error) {
    console.error('Contact submission error:', error);
    return c.json({ error: 'Failed to submit contact form' }, 500);
  }
});

/**
 * Submit service provider application
 * POST /api/providers/apply
 */
publicRoutes.post('/providers/apply', async (c) => {
  try {
    const body = await c.req.json();
    const {
      full_name,
      email,
      phone,
      address,
      city,
      date_of_birth,
      national_id,
      skills,
      experience_years,
      availability
    } = body;
    
    // Validation
    if (!full_name || !email || !phone || !skills) {
      return c.json({ error: 'Full name, email, phone, and skills are required' }, 400);
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: 'Invalid email address' }, 400);
    }
    
    // Skills should be an array
    const skillsJson = Array.isArray(skills) ? JSON.stringify(skills) : skills;
    const availabilityJson = availability ? JSON.stringify(availability) : null;
    
    // Create service provider application
    await execute(
      c.env.DB,
      `INSERT INTO service_providers (
        full_name, email, phone, address, city, date_of_birth,
        national_id, skills, experience_years, availability, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        full_name,
        email,
        phone,
        address || null,
        city || null,
        date_of_birth || null,
        national_id || null,
        skillsJson,
        experience_years || null,
        availabilityJson
      ]
    );
    
    return c.json({
      success: true,
      message: 'Your application has been submitted successfully. We will review it and contact you soon!'
    }, 201);
  } catch (error: any) {
    console.error('Provider application error:', error);
    
    // Handle duplicate email
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return c.json({ error: 'This email is already registered' }, 400);
    }
    
    return c.json({ error: 'Failed to submit application' }, 500);
  }
});

export default publicRoutes;
