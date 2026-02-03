// Services routes

import { Hono } from 'hono';
import { getServiceCategories, getServicesByAudience, getServicePricing, query } from '../utils/db';

type Bindings = {
  DB: D1Database;
};

const services = new Hono<{ Bindings: Bindings }>();

/**
 * Get all service categories
 * GET /api/services/categories
 */
services.get('/categories', async (c) => {
  try {
    const categories = await getServiceCategories(c.env.DB);
    return c.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    return c.json({ error: 'Failed to fetch categories' }, 500);
  }
});

/**
 * Get services by target audience (individual/business)
 * GET /api/services?audience=individual|business
 */
services.get('/', async (c) => {
  try {
    const audience = c.req.query('audience') as 'individual' | 'business' | undefined;
    const categoryId = c.req.query('category');
    
    let sql = `
      SELECT s.*, sc.name as category_name, sc.icon as category_icon
      FROM services s
      JOIN service_categories sc ON s.category_id = sc.id
      WHERE s.is_active = 1
    `;
    const params: any[] = [];
    
    if (audience) {
      sql += ` AND (s.target_audience = ? OR s.target_audience = 'both')`;
      params.push(audience);
    }
    
    if (categoryId) {
      sql += ` AND s.category_id = ?`;
      params.push(parseInt(categoryId));
    }
    
    sql += ' ORDER BY sc.display_order, s.name';
    
    const servicesData = await query(c.env.DB, sql, params);
    return c.json({ services: servicesData });
  } catch (error) {
    console.error('Get services error:', error);
    return c.json({ error: 'Failed to fetch services' }, 500);
  }
});

/**
 * Get a specific service by ID
 * GET /api/services/:id
 */
services.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    
    const service = await query(
      c.env.DB,
      `SELECT s.*, sc.name as category_name, sc.icon as category_icon
       FROM services s
       JOIN service_categories sc ON s.category_id = sc.id
       WHERE s.id = ? AND s.is_active = 1`,
      [id]
    );
    
    if (service.length === 0) {
      return c.json({ error: 'Service not found' }, 404);
    }
    
    return c.json({ service: service[0] });
  } catch (error) {
    console.error('Get service error:', error);
    return c.json({ error: 'Failed to fetch service' }, 500);
  }
});

/**
 * Get pricing options for a service
 * GET /api/services/:id/pricing
 */
services.get('/:id/pricing', async (c) => {
  try {
    const serviceId = parseInt(c.req.param('id'));
    const pricingType = c.req.query('type'); // 'visit' or 'contract'
    const serviceMode = c.req.query('mode'); // 'resident' or 'non_resident'
    
    let sql = 'SELECT * FROM service_pricing WHERE service_id = ? AND is_active = 1';
    const params: any[] = [serviceId];
    
    if (pricingType) {
      sql += ' AND pricing_type = ?';
      params.push(pricingType);
    }
    
    if (serviceMode) {
      sql += ' AND service_mode = ?';
      params.push(serviceMode);
    }
    
    sql += ' ORDER BY price ASC';
    
    const pricing = await query(c.env.DB, sql, params);
    return c.json({ pricing });
  } catch (error) {
    console.error('Get pricing error:', error);
    return c.json({ error: 'Failed to fetch pricing' }, 500);
  }
});

/**
 * Get services grouped by category
 * GET /api/services/grouped
 */
services.get('/grouped/by-category', async (c) => {
  try {
    const audience = c.req.query('audience') as 'individual' | 'business' | undefined;
    
    // Get all categories
    const categories = await getServiceCategories(c.env.DB);
    
    // Get services for each category
    const result = await Promise.all(
      categories.map(async (category) => {
        let sql = `
          SELECT * FROM services 
          WHERE category_id = ? AND is_active = 1
        `;
        const params: any[] = [category.id];
        
        if (audience) {
          sql += ` AND (target_audience = ? OR target_audience = 'both')`;
          params.push(audience);
        }
        
        sql += ' ORDER BY name';
        
        const categoryServices = await query(c.env.DB, sql, params);
        
        return {
          ...category,
          services: categoryServices
        };
      })
    );
    
    // Filter out categories with no services
    const filteredResult = result.filter(cat => cat.services.length > 0);
    
    return c.json({ categories: filteredResult });
  } catch (error) {
    console.error('Get grouped services error:', error);
    return c.json({ error: 'Failed to fetch services' }, 500);
  }
});

export default services;
