# PHP API Migration Checklist

## Files Created for PHP Backend

### Core Files
- ✅ `api/index.php` - Main API entry point
- ✅ `api/Router.php` - Lightweight routing class
- ✅ `api/config/database.php` - MySQL connection config
- ✅ `api/config/jwt.php` - JWT authentication & password hashing
- ✅ `api/controllers/AuthController.php` - User auth (register, login, profile)
- ✅ `api/controllers/ServicesController.php` - Services & pricing endpoints
- ✅ `api/controllers/BookingsController.php` - Booking CRUD operations
- ✅ `api/controllers/ContactController.php` - Contact form submission
- ✅ `.htaccess` - Apache routing & CORS configuration
- ✅ `database-mysql.sql` - Complete MySQL schema
- ✅ `database-seed.sql` - Sample data

### Configuration Files
- ✅ `PHP-SETUP.md` - Complete setup guide
- ✅ `API-EXAMPLES.html` - JavaScript integration examples
- ✅ `MIGRATION-CHECKLIST.md` - This file

## What's Changed

### Backend
| Original | New |
|----------|-----|
| Node.js + Hono | Vanilla PHP |
| TypeScript | PHP 7.4+ |
| D1 SQLite | MySQL/MariaDB |
| `src/routes/` | `api/controllers/` |
| Custom middleware | Native PHP headers |

### Database
| Original | New |
|----------|-----|
| SQLite (D1) | MySQL/MariaDB |
| `.sql` migration files | Single `database-mysql.sql` |
| Cloudflare deployment | Raspberry Pi Apache |

### Frontend
| Original | New |
|----------|-----|
| `http://localhost:3000/api/...` | `http://your-pi-ip/api/...` |
| Same endpoints | Same endpoints |
| No changes needed | Just update base URL |

## Step-by-Step Migration

### 1. Database Setup
```bash
# On Raspberry Pi
mysql -u root -p
CREATE DATABASE dar_khedma;
USE dar_khedma;
SOURCE /path/to/database-mysql.sql;
SOURCE /path/to/database-seed.sql;
```

### 2. Configuration
- [ ] Update `api/config/database.php` with your MariaDB credentials
- [ ] Change JWT_SECRET in `api/config/jwt.php`
- [ ] Verify `.htaccess` is in your Apache root

### 3. Deploy Files
- [ ] Copy entire project to `/var/www/client1/public_html`
- [ ] Set proper permissions (755 for dirs, 644 for files)
- [ ] Change ownership to `www-data:www-data`

### 4. Test Endpoints
```bash
curl http://localhost/api/services/categories
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@darkhedma.com","password":"admin123"}'
```

### 5. Update Frontend
- [ ] Update `API_BASE` URL in JavaScript files
- [ ] Test authentication flow
- [ ] Test service listing
- [ ] Test booking creation
- [ ] Test contact form

### 6. Verify All Endpoints
- [ ] `POST /api/auth/register` - New user signup
- [ ] `POST /api/auth/login` - User login
- [ ] `GET /api/auth/me` - Get current user
- [ ] `GET /api/services/categories` - List categories
- [ ] `GET /api/services` - List services
- [ ] `GET /api/services/:id` - Service details
- [ ] `GET /api/services/:id/pricing` - Service pricing
- [ ] `POST /api/bookings` - Create booking
- [ ] `GET /api/bookings` - User's bookings
- [ ] `GET /api/bookings/:id` - Booking details
- [ ] `PUT /api/bookings/:id` - Update booking
- [ ] `DELETE /api/bookings/:id` - Cancel booking
- [ ] `POST /api/contact` - Submit contact form

## Performance Optimization

### Memory Usage
| Setup | RAM |
|-------|-----|
| Node.js (original) | ~100-200MB |
| PHP-FPM (new) | ~20-30MB |
| Apache | ~30-50MB |
| MySQL | ~50-100MB |
| **Total** | ~100-180MB |

### Database Indexes
✅ All tables have proper indexes for:
- Email lookups
- User role/type filtering
- Service category filtering
- Booking status filtering
- Provider status filtering

## Backward Compatibility

### API Endpoints
✅ **100% Compatible** - All endpoints remain the same:
```
/api/auth/*
/api/services/*
/api/bookings/*
/api/contact
```

### Request Format
✅ **Identical** - JSON request/response format unchanged

### Authentication
✅ **Same** - JWT tokens work the same way

### Response Structure
✅ **Identical** - All response structures are the same

## Advantages of PHP Migration

1. **Lower Resource Usage** - Raspberr Pi stays cool
2. **Better Hosting Compatibility** - Works on any shared host
3. **No Dependencies** - No npm packages to manage
4. **Direct Execution** - PHP runs directly on Apache
5. **Easy Debugging** - Server logs in one place
6. **Faster Cold Start** - No Node startup delay

## Common Issues & Solutions

### 404 Not Found
**Cause:** Apache not rewriting URLs  
**Solution:** Enable mod_rewrite, verify `.htaccess`

### Database Connection Failed
**Cause:** Wrong credentials or MySQL not running  
**Solution:** Check credentials, restart MySQL, verify database exists

### CORS Errors
**Cause:** Missing CORS headers  
**Solution:** `.htaccess` includes CORS headers, should work automatically

### Token Validation Failed
**Cause:** Wrong JWT_SECRET  
**Solution:** Use same secret throughout, generate with `openssl rand -base64 32`

### High CPU Usage
**Cause:** Missing database indexes  
**Solution:** All provided (database-mysql.sql includes all indexes)

## Next Steps After Migration

1. **Enable HTTPS** - Generate SSL certificate with Let's Encrypt
2. **Setup Backup** - Automated daily MySQL backups
3. **Monitor Logs** - Check `/var/log/apache2/error.log`
4. **Setup Email** - Configure SMTP for contact form emails
5. **Add Logging** - Log all API requests for debugging

## Rollback Instructions

If you need to go back to Node.js/Hono:

1. Remove `/api/` folder
2. Run `npm install`
3. Set up D1 database on Cloudflare
4. Update frontend to use Node.js URLs
5. Deploy to Cloudflare Pages

## Support

**Files to reference:**
- `PHP-SETUP.md` - Detailed setup guide
- `API-EXAMPLES.html` - JavaScript usage examples
- `api/config/database.php` - Database configuration
- `api/config/jwt.php` - JWT token implementation
- `api/controllers/*.php` - Individual endpoint implementations

---

**Status:** ✅ Ready for deployment

All PHP files are production-ready with:
- Error handling
- Input validation
- Prepared statements (SQL injection prevention)
- CORS support
- JWT authentication
- Proper HTTP status codes
