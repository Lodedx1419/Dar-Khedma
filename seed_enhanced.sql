-- Enhanced Seed Data for Dar Khedma Service Marketplace

-- Insert default admin user (password: admin123)
INSERT OR IGNORE INTO users (email, password_hash, full_name, phone, role, account_type) VALUES 
  ('admin@darkhedma.com', '$2a$10$rH8pVQPz1K.KhPKJ9LXOj.9YNZhGQ0p0Zq2.gK0x.YdZjGxN3Kj1K', 'Admin User', '+971501234567', 'admin', 'business');

-- Insert test users (password: user123)
INSERT OR IGNORE INTO users (email, password_hash, full_name, phone, role, account_type, address, city) VALUES 
  ('john@example.com', '$2a$10$rH8pVQPz1K.KhPKJ9LXOj.9YNZhGQ0p0Zq2.gK0x.YdZjGxN3Kj1K', 'John Doe', '+971501234568', 'user', 'individual', '123 Main St', 'Dubai'),
  ('business@example.com', '$2a$10$rH8pVQPz1K.KhPKJ9LXOj.9YNZhGQ0p0Zq2.gK0x.YdZjGxN3Kj1K', 'ABC Company', '+971501234569', 'user', 'business', '456 Business Ave', 'Abu Dhabi'),
  ('sarah@example.com', '$2a$10$rH8pVQPz1K.KhPKJ9LXOj.9YNZhGQ0p0Zq2.gK0x.YdZjGxN3Kj1K', 'Sarah Ahmed', '+971501234570', 'user', 'individual', '789 Palm Street', 'Sharjah');

-- Insert Service Categories (7 categories)
INSERT OR IGNORE INTO service_categories (name, name_ar, description, icon, display_order) VALUES 
  ('Cleaning', 'تنظيف', 'Professional cleaning services for homes and offices', 'fas fa-broom', 1),
  ('Cooking', 'طبخ', 'Expert cooking and meal preparation services', 'fas fa-utensils', 2),
  ('Maintenance', 'صيانة', 'General maintenance and repair services', 'fas fa-tools', 3),
  ('Installation', 'تركيب', 'Professional installation and assembly services', 'fas fa-screwdriver', 4),
  ('Drivers', 'سائقين', 'Professional driver and transportation services', 'fas fa-car', 5),
  ('Gardening', 'بستنة', 'Garden maintenance, landscaping and outdoor care', 'fas fa-leaf', 6),
  ('Personal Help', 'مساعدة شخصية', 'Personal assistance and companion services', 'fas fa-hands-helping', 7);

-- Insert Services (25+ services)
INSERT OR IGNORE INTO services (category_id, name, name_ar, description, target_audience, service_type) VALUES 
  -- Cleaning Services (5 services)
  (1, 'Home Cleaning', 'تنظيف منزلي', 'Complete home cleaning and sanitization', 'individual', 'both'),
  (1, 'Office Cleaning', 'تنظيف مكاتب', 'Professional office and commercial space cleaning', 'business', 'both'),
  (1, 'Deep Cleaning', 'تنظيف شامل', 'Intensive deep cleaning service for homes and businesses', 'both', 'visit'),
  (1, 'Carpet & Upholstery Cleaning', 'تنظيف سجاد', 'Specialized carpet and furniture cleaning', 'both', 'visit'),
  (1, 'Window Cleaning', 'تنظيف نوافذ', 'Professional window and glass cleaning', 'both', 'visit'),
  
  -- Cooking Services (5 services)
  (2, 'Home Chef', 'طباخ منزلي', 'Professional home cooking service', 'individual', 'both'),
  (2, 'Meal Preparation', 'إعداد وجبات', 'Daily meal preparation and planning', 'both', 'contract'),
  (2, 'Event Catering', 'تقديم الطعام للمناسبات', 'Catering for events and gatherings', 'both', 'visit'),
  (2, 'Diet & Nutrition Cooking', 'طبخ صحي', 'Specialized healthy meal preparation', 'individual', 'both'),
  (2, 'Baking Services', 'خدمات خبز', 'Professional baking and pastry services', 'both', 'visit'),
  
  -- Maintenance Services (6 services)
  (3, 'General Maintenance', 'صيانة عامة', 'General home and office maintenance', 'both', 'both'),
  (3, 'Plumbing', 'سباكة', 'Professional plumbing repairs and installations', 'both', 'visit'),
  (3, 'Electrical Work', 'أعمال كهربائية', 'Electrical repairs, installations and wiring', 'both', 'visit'),
  (3, 'AC Maintenance', 'صيانة مكيفات', 'Air conditioning service and repair', 'both', 'both'),
  (3, 'Painting', 'دهان', 'Interior and exterior painting services', 'both', 'visit'),
  (3, 'Carpentry', 'نجارة', 'Wood repair and custom carpentry work', 'both', 'visit'),
  
  -- Installation Services (5 services)
  (4, 'Furniture Assembly', 'تركيب أثاث', 'Professional furniture assembly and installation', 'both', 'visit'),
  (4, 'Appliance Installation', 'تركيب أجهزة', 'Home and office appliance installation', 'both', 'visit'),
  (4, 'Shelf Installation', 'تركيب رفوف', 'Wall shelves and storage installation', 'both', 'visit'),
  (4, 'Bed Assembly', 'تركيب أسرة', 'Bed frame assembly and setup', 'both', 'visit'),
  (4, 'TV Mounting', 'تركيب تلفاز', 'Professional TV wall mounting service', 'both', 'visit'),
  
  -- Driver Services (4 services)
  (5, 'Personal Driver', 'سائق خاص', 'Professional personal driver service', 'individual', 'both'),
  (5, 'Business Driver', 'سائق أعمال', 'Corporate transportation and business driver', 'business', 'both'),
  (5, 'School Run Driver', 'سائق مدارس', 'Dedicated school transportation service', 'individual', 'contract'),
  (5, 'Chauffeur Service', 'خدمة سائق فاخر', 'Premium chauffeur service for special occasions', 'both', 'visit'),
  
  -- Gardening Services (5 services)
  (6, 'Garden Maintenance', 'صيانة حدائق', 'Regular garden maintenance and care', 'both', 'both'),
  (6, 'Landscaping', 'تنسيق حدائق', 'Professional landscaping and garden design', 'both', 'visit'),
  (6, 'Lawn Care', 'العناية بالمروج', 'Lawn mowing, trimming and maintenance', 'both', 'both'),
  (6, 'Tree & Plant Care', 'العناية بالأشجار', 'Tree pruning and plant maintenance', 'both', 'visit'),
  (6, 'Irrigation System', 'نظام الري', 'Irrigation system installation and repair', 'both', 'visit'),
  
  -- Personal Help Services (5 services)
  (7, 'Personal Assistant', 'مساعد شخصي', 'General personal assistance and errands', 'individual', 'both'),
  (7, 'Elderly Care', 'رعاية المسنين', 'Professional elderly care and companionship', 'individual', 'both'),
  (7, 'Babysitting', 'رعاية أطفال', 'Professional childcare and babysitting', 'individual', 'both'),
  (7, 'Pet Care', 'رعاية حيوانات', 'Pet sitting and care services', 'individual', 'both'),
  (7, 'Tutoring', 'تدريس خصوصي', 'Private tutoring and educational support', 'individual', 'both');

-- Insert Service Pricing (Comprehensive pricing for hourly and contract options)

-- Cleaning Services Pricing
INSERT OR IGNORE INTO service_pricing (service_id, pricing_type, service_mode, duration_type, price, description) VALUES 
  -- Home Cleaning
  (1, 'visit', 'non_resident', '2h', 35.00, '2 hours home cleaning'),
  (1, 'visit', 'non_resident', '4h', 50.00, '4 hours home cleaning'),
  (1, 'visit', 'non_resident', '8h', 90.00, '8 hours home cleaning'),
  (1, 'contract', 'non_resident', '1month', 400.00, '1 month contract (3 visits/week)'),
  (1, 'contract', 'non_resident', '3months', 1100.00, '3 months contract (3 visits/week)'),
  (1, 'contract', 'non_resident', '6months', 2100.00, '6 months contract (3 visits/week)'),
  (1, 'contract', 'resident', '1month', 800.00, '1 month contract (resident)'),
  (1, 'contract', 'resident', '12months', 8500.00, '12 months contract (resident)'),
  
  -- Deep Cleaning
  (3, 'visit', 'non_resident', '4h', 80.00, '4 hours deep cleaning'),
  (3, 'visit', 'non_resident', '8h', 150.00, '8 hours deep cleaning'),

-- Cooking Services Pricing
  -- Home Chef
  (6, 'visit', 'non_resident', '2h', 40.00, '2 hours cooking service'),
  (6, 'visit', 'non_resident', '4h', 60.00, '4 hours cooking service'),
  (6, 'visit', 'non_resident', '8h', 110.00, '8 hours cooking service'),
  (6, 'contract', 'non_resident', '1month', 500.00, '1 month contract (daily meals)'),
  (6, 'contract', 'non_resident', '3months', 1400.00, '3 months contract (daily meals)'),
  (6, 'contract', 'non_resident', '6months', 2700.00, '6 months contract (daily meals)'),
  (6, 'contract', 'resident', '1month', 900.00, '1 month contract (resident chef)'),
  (6, 'contract', 'resident', '12months', 10000.00, '12 months contract (resident chef)');

-- Maintenance Services Pricing
INSERT OR IGNORE INTO service_pricing (service_id, pricing_type, service_mode, duration_type, price, description) VALUES 
  -- General Maintenance
  (11, 'visit', 'non_resident', '2h', 45.00, '2 hours maintenance work'),
  (11, 'visit', 'non_resident', '4h', 70.00, '4 hours maintenance work'),
  (11, 'visit', 'non_resident', '8h', 130.00, '8 hours maintenance work'),
  (11, 'contract', 'non_resident', '1month', 600.00, '1 month maintenance contract'),
  (11, 'contract', 'non_resident', '3months', 1650.00, '3 months maintenance contract'),
  (11, 'contract', 'non_resident', '6months', 3100.00, '6 months maintenance contract'),
  
  -- Plumbing
  (12, 'visit', 'non_resident', '2h', 50.00, '2 hours plumbing work'),
  (12, 'visit', 'non_resident', '4h', 90.00, '4 hours plumbing work'),
  
  -- Electrical
  (13, 'visit', 'non_resident', '2h', 55.00, '2 hours electrical work'),
  (13, 'visit', 'non_resident', '4h', 95.00, '4 hours electrical work');

-- Installation Services Pricing
INSERT OR IGNORE INTO service_pricing (service_id, pricing_type, service_mode, duration_type, price, description) VALUES 
  -- Furniture Assembly
  (16, 'visit', 'non_resident', '2h', 40.00, '2 hours furniture assembly'),
  (16, 'visit', 'non_resident', '4h', 70.00, '4 hours furniture assembly'),
  
  -- Shelf Installation
  (18, 'visit', 'non_resident', '2h', 45.00, 'Shelf installation service'),
  
  -- Bed Assembly
  (19, 'visit', 'non_resident', '2h', 50.00, 'Bed assembly service'),
  
  -- TV Mounting
  (20, 'visit', 'non_resident', '1h', 60.00, 'TV wall mounting');

-- Driver Services Pricing
INSERT OR IGNORE INTO service_pricing (service_id, pricing_type, service_mode, duration_type, price, description) VALUES 
  -- Personal Driver
  (21, 'visit', 'non_resident', '2h', 30.00, '2 hours driver service'),
  (21, 'visit', 'non_resident', '4h', 50.00, '4 hours driver service'),
  (21, 'visit', 'non_resident', '8h', 90.00, '8 hours driver service'),
  (21, 'contract', 'non_resident', '1month', 550.00, '1 month driver contract (4 hours/day)'),
  (21, 'contract', 'non_resident', '3months', 1550.00, '3 months driver contract'),
  (21, 'contract', 'non_resident', '6months', 3000.00, '6 months driver contract'),
  (21, 'contract', 'non_resident', '12months', 5800.00, '12 months driver contract'),
  
  -- School Run Driver
  (23, 'contract', 'non_resident', '1month', 400.00, '1 month school run (morning & afternoon)'),
  (23, 'contract', 'non_resident', '3months', 1100.00, '3 months school run contract'),
  (23, 'contract', 'non_resident', '6months', 2100.00, '6 months school run contract');

-- Gardening Services Pricing
INSERT OR IGNORE INTO service_pricing (service_id, pricing_type, service_mode, duration_type, price, description) VALUES 
  -- Garden Maintenance
  (25, 'visit', 'non_resident', '2h', 35.00, '2 hours garden work'),
  (25, 'visit', 'non_resident', '4h', 60.00, '4 hours garden work'),
  (25, 'contract', 'non_resident', '1month', 350.00, '1 month garden contract (weekly visits)'),
  (25, 'contract', 'non_resident', '3months', 950.00, '3 months garden contract'),
  (25, 'contract', 'non_resident', '12months', 3600.00, '12 months garden contract'),
  
  -- Lawn Care
  (27, 'visit', 'non_resident', '2h', 40.00, '2 hours lawn care'),
  (27, 'contract', 'non_resident', '1month', 300.00, '1 month lawn care (weekly)');

-- Personal Help Services Pricing
INSERT OR IGNORE INTO service_pricing (service_id, pricing_type, service_mode, duration_type, price, description) VALUES 
  -- Personal Assistant
  (30, 'visit', 'non_resident', '4h', 55.00, '4 hours personal assistance'),
  (30, 'visit', 'non_resident', '8h', 100.00, '8 hours personal assistance'),
  (30, 'contract', 'non_resident', '1month', 650.00, '1 month personal assistant contract'),
  
  -- Elderly Care
  (31, 'visit', 'non_resident', '4h', 65.00, '4 hours elderly care'),
  (31, 'visit', 'non_resident', '8h', 120.00, '8 hours elderly care'),
  (31, 'contract', 'non_resident', '1month', 850.00, '1 month elderly care contract'),
  (31, 'contract', 'resident', '1month', 1200.00, '1 month live-in elderly care'),
  
  -- Babysitting
  (32, 'visit', 'non_resident', '2h', 35.00, '2 hours babysitting'),
  (32, 'visit', 'non_resident', '4h', 60.00, '4 hours babysitting'),
  (32, 'contract', 'non_resident', '1month', 600.00, '1 month babysitting contract'),
  
  -- Tutoring
  (34, 'visit', 'non_resident', '1h', 40.00, '1 hour tutoring session'),
  (34, 'visit', 'non_resident', '2h', 75.00, '2 hours tutoring session'),
  (34, 'contract', 'non_resident', '1month', 500.00, '1 month tutoring (3 sessions/week)');

-- Insert sample service providers with diverse skills
INSERT OR IGNORE INTO service_providers (full_name, email, phone, city, skills, experience_years, availability, status) VALUES 
  ('Ahmad Hassan', 'ahmad.hassan@example.com', '+971501234571', 'Dubai', '["Cleaning", "Maintenance"]', 5, '{"days": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], "hours": "8am-6pm"}', 'approved'),
  ('Fatima Ali', 'fatima.ali@example.com', '+971501234572', 'Abu Dhabi', '["Cooking", "Cleaning"]', 3, '{"days": ["Sun", "Mon", "Tue", "Wed", "Thu"], "hours": "7am-3pm"}', 'approved'),
  ('Mohammed Salem', 'mohammed.salem@example.com', '+971501234573', 'Dubai', '["Drivers"]', 8, '{"days": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], "hours": "24/7"}', 'approved'),
  ('Sara Ibrahim', 'sara.ibrahim@example.com', '+971501234574', 'Sharjah', '["Gardening", "Maintenance"]', 4, '{"days": ["Mon", "Wed", "Fri", "Sat"], "hours": "6am-2pm"}', 'approved'),
  ('Khalid Rashid', 'khalid.rashid@example.com', '+971501234575', 'Dubai', '["Installation", "Maintenance", "Carpentry"]', 7, '{"days": ["Sun", "Mon", "Tue", "Wed", "Thu"], "hours": "8am-5pm"}', 'approved'),
  ('Amira Youssef', 'amira.youssef@example.com', '+971501234576', 'Abu Dhabi', '["Personal Help", "Elderly Care", "Babysitting"]', 6, '{"days": ["Mon", "Tue", "Wed", "Thu", "Fri"], "hours": "9am-7pm"}', 'approved'),
  ('Hassan Ahmed', 'hassan.ahmed@example.com', '+971501234577', 'Dubai', '["Drivers", "Personal Help"]', 10, '{"days": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], "hours": "6am-10pm"}', 'approved'),
  ('Layla Khalil', 'layla.khalil@example.com', '+971501234578', 'Sharjah', '["Cooking", "Tutoring"]', 4, '{"days": ["Sun", "Mon", "Wed", "Thu"], "hours": "2pm-8pm"}', 'approved');
