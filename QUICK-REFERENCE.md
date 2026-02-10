# Quick Reference: PHP API

## 🚀 Quick Start

### 1. Database
```bash
mysql -u root -p
CREATE DATABASE dar_khedma;
USE dar_khedma;
SOURCE database-mysql.sql;
SOURCE database-seed.sql;
```

### 2. Configure
- Edit `api/config/database.php` - Add your DB credentials
- Edit `api/config/jwt.php` - Change JWT_SECRET

### 3. Test
```bash
curl http://your-pi-ip/api/services/categories
```

---

## 📡 API Endpoints Cheat Sheet

### Auth (No Token Needed)
```bash
# Register
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "User Name",
  "account_type": "individual"
}

# Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Services (No Token)
```bash
# Categories
GET /api/services/categories

# List services
GET /api/services?audience=individual

# Service details
GET /api/services/1

# Pricing
GET /api/services/1/pricing?type=visit&mode=non_resident
```

### Bookings (Need Token)
```bash
# Create
POST /api/bookings
Header: Authorization: Bearer <token>
{
  "service_id": 1,
  "pricing_id": 1,
  "booking_type": "visit",
  "service_mode": "non_resident",
  "start_date": "2024-02-20",
  "service_address": "123 Main St"
}

# List user's bookings
GET /api/bookings
Header: Authorization: Bearer <token>

# Get booking
GET /api/bookings/1
Header: Authorization: Bearer <token>
```

### Contact (No Token)
```bash
POST /api/contact
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello!"
}
```

### Admin (Need Admin Token)
```bash
# Dashboard stats
GET /api/admin/dashboard
Header: Authorization: Bearer <admin-token>

# List users
GET /api/admin/users

# List providers
GET /api/admin/service-providers?status=pending

# Approve provider
PUT /api/admin/service-providers/1/approve

# Get contact submissions
GET /api/admin/contact-submissions?status=new
```

---

## 🔑 Test Credentials

**Default Admin Account:**
- Email: `admin@darkhedma.com`
- Password: `admin123`

**Test User:**
- Email: `john@example.com`
- Password: `user123`

---

## 📁 File Locations

```
api/                           # Backend code
api/index.php                  # Entry point
api/Router.php                 # URL router
api/config/database.php        # DB config (EDIT)
api/config/jwt.php            # JWT config (EDIT)
api/controllers/              # All endpoints
database-mysql.sql            # Database schema
database-seed.sql             # Sample data
.htaccess                      # Apache config
```

---

## 🧪 Test Requests

### Using curl

```bash
# Test server is running
curl http://localhost/api/services/categories

# Register user
curl -X POST http://localhost/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"new@example.com",
    "password":"password123",
    "full_name":"New User",
    "account_type":"individual"
  }'

# Login
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"new@example.com",
    "password":"password123"
  }'

# Get user profile (with token)
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost/api/auth/me

# Get services
curl http://localhost/api/services

# Create booking (with token)
curl -X POST http://localhost/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "service_id": 1,
    "pricing_id": 1,
    "booking_type": "visit",
    "service_mode": "non_resident",
    "start_date": "2024-03-01",
    "service_address": "123 Main St"
  }'
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| 404 on /api/ | Enable mod_rewrite, restart Apache |
| DB connection error | Check credentials in api/config/database.php |
| No response | Check /var/log/apache2/error.log |
| 401 Unauthorized | Token missing or expired |
| CORS errors | .htaccess should handle it |

---

## 📊 JavaScript Examples

```javascript
// Fetch services
fetch('/api/services?audience=individual')
  .then(r => r.json())
  .then(data => console.log(data.services))

// Login
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
})
.then(r => r.json())
.then(data => {
  localStorage.setItem('token', data.token)
})

// Get user bookings
fetch('/api/bookings', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
})
.then(r => r.json())
.then(data => console.log(data.bookings))

// Submit contact
fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John',
    email: 'john@example.com',
    message: 'Hello!'
  })
})
.then(r => r.json())
.then(data => console.log(data))
```

---

## ⚙️ Configuration Checklist

- [ ] Update `DB_HOST` in database.php
- [ ] Update `DB_USER` in database.php
- [ ] Update `DB_PASS` in database.php
- [ ] Change JWT_SECRET in jwt.php
- [ ] Enable mod_rewrite in Apache
- [ ] Set file permissions (755 for dirs, 644 for files)
- [ ] Set www-data ownership
- [ ] Test database connection
- [ ] Test API endpoints
- [ ] Update frontend API URLs

---

## 📚 Full Documentation

Read in this order:
1. CONVERSION-COMPLETE.md - Overview
2. PHP-SETUP.md - Detailed guide
3. MIGRATION-CHECKLIST.md - Verification
4. This file - Quick reference

---

## 💾 Database Connection

**File:** `api/config/database.php`

Update these values:
```php
define('DB_HOST', 'localhost');   // Your Pi's IP or localhost
define('DB_USER', 'root');        // MariaDB username
define('DB_PASS', 'password');    // MariaDB password
define('DB_NAME', 'dar_khedma');  // Database name
```

---

## 🔐 Security

Before going live:
1. Change JWT_SECRET (generate: `openssl rand -base64 32`)
2. Update database password
3. Enable HTTPS (Let's Encrypt)
4. Change admin password (admin@darkhedma.com)
5. Set strong database password
6. Restrict file permissions
7. Disable file listing (htaccess ✓)

---

## 📞 Getting Help

- Check error log: `/var/log/apache2/error.log`
- Test PHP: `php -v`
- Test MySQL: `mysql -u root -p dar_khedma -e "SELECT 1;"`
- Test API: `curl http://localhost/api/services/categories`
- Read: `PHP-SETUP.md` section "Troubleshooting"

---

## 🎯 Success Indicators

✅ curl returns JSON from API
✅ Login returns token
✅ Token works for protected endpoints
✅ Database queries complete
✅ No errors in Apache log
✅ Frontend loads and shows data

---

**Last Updated:** 2024
**Version:** 1.0 - PHP Conversion
