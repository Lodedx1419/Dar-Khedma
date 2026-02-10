# PHP Conversion Setup Guide

## Project Converted to Vanilla PHP

Your Dar Khedma project has been successfully converted from Node.js/Hono to **Vanilla PHP with MariaDB**.

### Architecture

```
api/
├── index.php                 # Main API entry point & router
├── Router.php                # Lightweight routing class
├── config/
│   ├── database.php          # MySQL connection
│   └── jwt.php               # JWT authentication
└── controllers/
    ├── AuthController.php    # User authentication
    ├── ServicesController.php # Services & pricing
    ├── BookingsController.php # Booking management
    └── ContactController.php  # Contact form
public/
├── static/                   # Static files (CSS, images)
├── js/                       # JavaScript (unchanged)
└── index.html                # Main page
```

## Setup Instructions

### 1. Database Setup

#### Option A: Using Adminer (Recommended for Raspberry Pi)
1. Open your Adminer interface
2. Create a new database: `dar_khedma`
3. Copy and paste contents of `database-mysql.sql` into the SQL command area
4. Execute to create all tables
5. Run `database-seed.sql` to add sample data

#### Option B: Using Command Line
```bash
# SSH into your Raspberry Pi
ssh user@your-pi-ip

# Login to MariaDB
mysql -u root -p

# Create database and import schema
CREATE DATABASE dar_khedma;
USE dar_khedma;
SOURCE /path/to/database-mysql.sql;
SOURCE /path/to/database-seed.sql;
EXIT;
```

### 2. Configure Database Connection

Edit `api/config/database.php`:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');      # Your MariaDB user
define('DB_PASS', 'password');  # Your MariaDB password
define('DB_NAME', 'dar_khedma');
```

### 3. Configure JWT Secret

Edit `api/config/jwt.php`:

Change this line to a secure random string:
```php
define('JWT_SECRET', 'your-super-secret-key-change-this-in-production');
```

Generate a secure key:
```bash
openssl rand -base64 32
```

### 4. Deploy to Raspberry Pi

#### Using SCP:
```bash
scp -r /path/to/Dar\ Khedma user@your-pi-ip:/var/www/client1/public_html
```

#### Or using Git:
```bash
cd /var/www/client1/public_html
git clone https://github.com/Lodedx1419/Dar-Khedma.git .
```

### 5. Apache Configuration

Make sure `.htaccess` is in your `public_html` root. The file enables:
- URL rewriting for clean API routes
- CORS headers
- Proper routing to `api/index.php`

If `.htaccess` doesn't work, enable mod_rewrite:
```bash
sudo a2enmod rewrite
sudo a2enmod headers
sudo systemctl restart apache2
```

### 6. File Permissions

```bash
cd /var/www/client1/public_html
sudo chown -R www-data:www-data .
sudo chmod -R 755 .
sudo chmod -R 644 api/config/
```

### 7. Test the API

```bash
# Get all service categories
curl http://your-pi-ip/api/services/categories

# Register a new user
curl -X POST http://your-pi-ip/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"password123",
    "full_name":"Test User",
    "account_type":"individual"
  }'
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (requires token)

### Services
- `GET /api/services/categories` - Get all service categories
- `GET /api/services?audience=individual` - Get services by audience
- `GET /api/services/:id` - Get service details
- `GET /api/services/:id/pricing` - Get service pricing

### Bookings (requires authentication)
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Contact
- `POST /api/contact` - Submit contact form

## JavaScript Usage

All fetch calls should use:

```javascript
// Instead of: http://localhost:3000/api/...
// Use: http://your-pi-ip/api/...

// Register
fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    full_name: 'User Name',
    account_type: 'individual'
  })
})
.then(r => r.json())
.then(data => {
  localStorage.setItem('token', data.token);
  // Redirect to dashboard
});

// Get services
fetch('/api/services?audience=individual')
  .then(r => r.json())
  .then(data => console.log(data.services));

// Authenticated request (with token)
fetch('/api/bookings', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
  .then(r => r.json())
  .then(data => console.log(data.bookings));
```

## Performance Optimization for Raspberry Pi

✅ **Advantages of this setup:**
- No Node.js overhead (saves ~100MB RAM)
- Direct PHP execution by Apache
- Minimal dependencies
- Native MySQL driver
- Lightweight JWT implementation

## Troubleshooting

### 404 Errors on API Calls
- Ensure `.htaccess` is in the root directory
- Check Apache mod_rewrite is enabled
- Verify API files are in `/api/` folder

### Database Connection Error
- Check MySQL/MariaDB is running: `sudo systemctl status mysql`
- Verify credentials in `api/config/database.php`
- Test connection: `mysql -u root -p dar_khedma`

### Token Errors
- Ensure JWT_SECRET is set in `api/config/jwt.php`
- Check token is being sent in Authorization header
- Verify token format: `Bearer <token>`

### File Upload Issues
- Create `uploads/` folder with write permissions
- Set folder ownership: `sudo chown www-data:www-data uploads/`

## Security Reminders

1. **Change JWT_SECRET** before production
2. **Update database credentials** in `api/config/database.php`
3. **Enable HTTPS** on your Apache server
4. **Validate all user input** server-side
5. **Use parameterized queries** (already implemented)
6. **Never commit** sensitive credentials to Git

## Next Steps

1. Verify all API endpoints work
2. Test with your frontend JavaScript
3. Set up SSL certificate (Let's Encrypt)
4. Configure domain/DNS
5. Set up monitoring and logging
6. Deploy admin panel (if needed)

---

**Notes:**
- The lightweight Router doesn't require Composer or heavy dependencies
- All tables use InnoDB engine for better performance
- JSON support for flexible data (skills, availability)
- Proper indexing for fast queries on Raspberry Pi

Need help? Check individual file comments for detailed implementation.
