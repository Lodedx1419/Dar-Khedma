-- Seed Data for Dar Khedma Service Marketplace

-- Insert default admin user (password: admin123)
-- Password hash for 'admin123' using bcrypt
INSERT OR IGNORE INTO users (email, password_hash, full_name, phone, role, account_type) VALUES 
  ('admin@darkhedma.com', '$2a$10$rH8pVQPz1K.KhPKJ9LXOj.9YNZhGQ0p0Zq2.gK0x.YdZjGxN3Kj1K', 'Admin User', '+1234567890', 'admin', 'business');

-- Insert test users (password: user123)
INSERT OR IGNORE INTO users (email, password_hash, full_name, phone, role, account_type, address, city) VALUES 
  ('john@example.com', '$2a$10$rH8pVQPz1K.KhPKJ9LXOj.9YNZhGQ0p0Zq2.gK0x.YdZjGxN3Kj1K', 'John Doe', '+1234567891', 'user', 'individual', '123 Main St', 'Dubai'),
  ('business@example.com', '$2a$10$rH8pVQPz1K.KhPKJ9LXOj.9YNZhGQ0p0Zq2.gK0x.YdZjGxN3Kj1K', 'ABC Company', '+1234567892', 'user', 'business', '456 Business Ave', 'Abu Dhabi');

-- Insert Service Categories
INSERT OR IGNORE INTO service_categories (name, name_ar, description, icon, display_order) VALUES 
  ('Cleaning', 'تنظيف', 'Professional cleaning services for homes and offices', 'fas fa-broom', 1),
  ('Cooking', 'طبخ', 'Expert cooking and meal preparation services', 'fas fa-utensils', 2),
  ('Maintenance', 'صيانة', 'General maintenance and repair services', 'fas fa-tools', 3),
  ('Installation', 'تركيب', 'Professional installation services', 'fas fa-screwdriver', 4),
  ('Drivers', 'سائقين', 'Professional driver services', 'fas fa-car', 5),
  ('Gardening', 'بستنة', 'Garden maintenance and landscaping', 'fas fa-leaf', 6);

-- Insert Services
INSERT OR IGNORE INTO services (category_id, name, name_ar, description, target_audience, service_type) VALUES 
  -- Cleaning Services
  (1, 'Home Cleaning', 'تنظيف منزلي', 'Complete home cleaning and sanitization', 'individual', 'both'),
  (1, 'Office Cleaning', 'تنظيف مكاتب', 'Professional office and commercial space cleaning', 'business', 'both'),
  (1, 'Deep Cleaning', 'تنظيف شامل', 'Intensive deep cleaning service', 'both', 'visit'),
  
  -- Cooking Services
  (2, 'Home Chef', 'طباخ منزلي', 'Professional home cooking service', 'individual', 'both'),
  (2, 'Meal Preparation', 'إعداد وجبات', 'Daily meal preparation service', 'both', 'contract'),
  (2, 'Event Catering', 'تقديم الطعام للمناسبات', 'Catering for events and gatherings', 'both', 'visit'),
  
  -- Maintenance Services
  (3, 'General Maintenance', 'صيانة عامة', 'General home and office maintenance', 'both', 'both'),
  (3, 'Plumbing', 'سباكة', 'Professional plumbing services', 'both', 'visit'),
  (3, 'Electrical Work', 'أعمال كهربائية', 'Electrical repairs and installations', 'both', 'visit'),
  
  -- Installation Services
  (4, 'Furniture Assembly', 'تركيب أثاث', 'Professional furniture assembly', 'both', 'visit'),
  (4, 'Appliance Installation', 'تركيب أجهزة', 'Home and office appliance installation', 'both', 'visit'),
  
  -- Driver Services
  (5, 'Personal Driver', 'سائق خاص', 'Professional personal driver service', 'individual', 'both'),
  (5, 'Business Driver', 'سائق أعمال', 'Business transportation services', 'business', 'both'),
  
  -- Gardening Services
  (6, 'Garden Maintenance', 'صيانة حدائق', 'Regular garden maintenance and care', 'both', 'both'),
  (6, 'Landscaping', 'تنسيق حدائق', 'Professional landscaping services', 'both', 'visit');

-- Insert Service Pricing (Examples)
-- Cleaning - Home Cleaning
INSERT OR IGNORE INTO service_pricing (service_id, pricing_type, service_mode, duration_type, price, description) VALUES 
  (1, 'visit', 'non_resident', '4h', 50.00, '4 hours home cleaning'),
  (1, 'visit', 'non_resident', '8h', 90.00, '8 hours home cleaning'),
  (1, 'visit', 'non_resident', 'monthly_6days', 450.00, 'Monthly cleaning (6 days/week)'),
  (1, 'contract', 'non_resident', '1month', 400.00, '1 month contract'),
  (1, 'contract', 'non_resident', '3months', 1100.00, '3 months contract'),
  (1, 'contract', 'resident', '1month', 800.00, '1 month contract (resident)'),
  (1, 'contract', 'resident', '12months', 8500.00, '12 months contract (resident)');

-- Cooking - Home Chef
INSERT OR IGNORE INTO service_pricing (service_id, pricing_type, service_mode, duration_type, price, description) VALUES 
  (4, 'visit', 'non_resident', '4h', 60.00, '4 hours cooking service'),
  (4, 'visit', 'non_resident', '8h', 110.00, '8 hours cooking service'),
  (4, 'contract', 'non_resident', '1month', 500.00, '1 month contract'),
  (4, 'contract', 'non_resident', '6months', 2700.00, '6 months contract'),
  (4, 'contract', 'resident', '1month', 900.00, '1 month contract (resident)'),
  (4, 'contract', 'resident', '12months', 10000.00, '12 months contract (resident)');

-- Maintenance - General Maintenance
INSERT OR IGNORE INTO service_pricing (service_id, pricing_type, service_mode, duration_type, price, description) VALUES 
  (7, 'visit', 'non_resident', '4h', 70.00, '4 hours maintenance work'),
  (7, 'visit', 'non_resident', '8h', 130.00, '8 hours maintenance work'),
  (7, 'contract', 'non_resident', '1month', 600.00, '1 month maintenance contract'),
  (7, 'contract', 'non_resident', '3months', 1650.00, '3 months maintenance contract');

-- Driver - Personal Driver
INSERT OR IGNORE INTO service_pricing (service_id, pricing_type, service_mode, duration_type, price, description) VALUES 
  (12, 'visit', 'non_resident', '4h', 40.00, '4 hours driver service'),
  (12, 'visit', 'non_resident', '8h', 75.00, '8 hours driver service'),
  (12, 'contract', 'non_resident', '1month', 550.00, '1 month driver contract'),
  (12, 'contract', 'non_resident', '6months', 3000.00, '6 months driver contract');

-- Gardening - Garden Maintenance
INSERT OR IGNORE INTO service_pricing (service_id, pricing_type, service_mode, duration_type, price, description) VALUES 
  (14, 'visit', 'non_resident', '4h', 45.00, '4 hours garden work'),
  (14, 'visit', 'non_resident', 'monthly_6days', 400.00, 'Monthly garden maintenance'),
  (14, 'contract', 'non_resident', '1month', 350.00, '1 month garden contract'),
  (14, 'contract', 'non_resident', '12months', 3800.00, '12 months garden contract');

-- Insert sample service providers
INSERT OR IGNORE INTO service_providers (full_name, email, phone, city, skills, experience_years, availability, status) VALUES 
  ('Ahmad Hassan', 'ahmad.hassan@example.com', '+971501234567', 'Dubai', '["Cleaning", "Maintenance"]', 5, '{"days": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], "hours": "8am-6pm"}', 'approved'),
  ('Fatima Ali', 'fatima.ali@example.com', '+971501234568', 'Abu Dhabi', '["Cooking", "Cleaning"]', 3, '{"days": ["Sun", "Mon", "Tue", "Wed", "Thu"], "hours": "7am-3pm"}', 'approved'),
  ('Mohammed Salem', 'mohammed.salem@example.com', '+971501234569', 'Dubai', '["Drivers"]', 8, '{"days": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], "hours": "24/7"}', 'approved'),
  ('Sara Ibrahim', 'sara.ibrahim@example.com', '+971501234570', 'Sharjah', '["Gardening", "Maintenance"]', 4, '{"days": ["Mon", "Wed", "Fri", "Sat"], "hours": "6am-2pm"}', 'approved');
