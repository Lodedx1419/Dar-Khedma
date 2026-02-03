// Database utility functions

export interface User {
  id: number;
  email: string;
  password_hash: string;
  full_name: string;
  phone?: string;
  role: 'user' | 'admin';
  account_type: 'individual' | 'business';
  business_name?: string;
  business_registration?: string;
  address?: string;
  city?: string;
  created_at: string;
  updated_at: string;
  is_active: number;
}

export interface Service {
  id: number;
  category_id: number;
  name: string;
  name_ar?: string;
  description?: string;
  target_audience: 'individual' | 'business' | 'both';
  service_type: 'visit' | 'contract' | 'both';
  is_active: number;
}

export interface ServiceCategory {
  id: number;
  name: string;
  name_ar?: string;
  description?: string;
  icon?: string;
  display_order: number;
  is_active: number;
}

export interface ServicePricing {
  id: number;
  service_id: number;
  pricing_type: 'visit' | 'contract';
  service_mode: 'resident' | 'non_resident';
  duration_type?: string;
  price: number;
  currency: string;
  description?: string;
  is_active: number;
}

export interface Booking {
  id: number;
  user_id: number;
  service_id: number;
  pricing_id: number;
  booking_type: 'visit' | 'contract';
  service_mode: 'resident' | 'non_resident';
  start_date: string;
  end_date?: string;
  duration_info?: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  assigned_provider_id?: number;
  service_address: string;
  special_requirements?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceProvider {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  date_of_birth?: string;
  national_id?: string;
  skills: string;
  experience_years?: number;
  availability?: string;
  documents?: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'new' | 'read' | 'responded';
  created_at: string;
}

/**
 * Execute a query and return results
 */
export async function query<T = any>(
  db: D1Database,
  sql: string,
  params: any[] = []
): Promise<T[]> {
  const stmt = db.prepare(sql);
  const bound = params.length > 0 ? stmt.bind(...params) : stmt;
  const result = await bound.all();
  return result.results as T[];
}

/**
 * Execute a query and return the first result
 */
export async function queryOne<T = any>(
  db: D1Database,
  sql: string,
  params: any[] = []
): Promise<T | null> {
  const results = await query<T>(db, sql, params);
  return results.length > 0 ? results[0] : null;
}

/**
 * Execute an insert/update/delete query
 */
export async function execute(
  db: D1Database,
  sql: string,
  params: any[] = []
): Promise<D1Result> {
  const stmt = db.prepare(sql);
  const bound = params.length > 0 ? stmt.bind(...params) : stmt;
  return await bound.run();
}

/**
 * Get user by email
 */
export async function getUserByEmail(db: D1Database, email: string): Promise<User | null> {
  return await queryOne<User>(
    db,
    'SELECT * FROM users WHERE email = ? AND is_active = 1',
    [email]
  );
}

/**
 * Get user by ID
 */
export async function getUserById(db: D1Database, id: number): Promise<User | null> {
  return await queryOne<User>(
    db,
    'SELECT * FROM users WHERE id = ? AND is_active = 1',
    [id]
  );
}

/**
 * Create a new user
 */
export async function createUser(
  db: D1Database,
  data: {
    email: string;
    password_hash: string;
    full_name: string;
    phone?: string;
    role?: string;
    account_type?: string;
    business_name?: string;
    business_registration?: string;
    address?: string;
    city?: string;
  }
): Promise<number> {
  const result = await execute(
    db,
    `INSERT INTO users (email, password_hash, full_name, phone, role, account_type, business_name, business_registration, address, city)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.email,
      data.password_hash,
      data.full_name,
      data.phone || null,
      data.role || 'user',
      data.account_type || 'individual',
      data.business_name || null,
      data.business_registration || null,
      data.address || null,
      data.city || null
    ]
  );
  return result.meta.last_row_id || 0;
}

/**
 * Get all active service categories
 */
export async function getServiceCategories(db: D1Database): Promise<ServiceCategory[]> {
  return await query<ServiceCategory>(
    db,
    'SELECT * FROM service_categories WHERE is_active = 1 ORDER BY display_order, name'
  );
}

/**
 * Get services by target audience
 */
export async function getServicesByAudience(
  db: D1Database,
  audience: 'individual' | 'business'
): Promise<Service[]> {
  return await query<Service>(
    db,
    `SELECT * FROM services 
     WHERE is_active = 1 
     AND (target_audience = ? OR target_audience = 'both')
     ORDER BY name`,
    [audience]
  );
}

/**
 * Get service pricing options
 */
export async function getServicePricing(
  db: D1Database,
  serviceId: number
): Promise<ServicePricing[]> {
  return await query<ServicePricing>(
    db,
    'SELECT * FROM service_pricing WHERE service_id = ? AND is_active = 1',
    [serviceId]
  );
}
