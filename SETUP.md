# Dar Khedma PHP Backend - Setup Instructions

This guide will help you get the Dar Khedma PHP backend running locally or on a Raspberry Pi.

## Prerequisites

- **PHP 7.4+** (with mysqli extension)
- **Apache 2.4+** with `mod_rewrite` and `mod_headers` enabled
- **MySQL 8.0** or **MariaDB 10.3+**

## Step 1: Enable Apache Modules

```bash
sudo a2enmod rewrite
sudo a2enmod headers
sudo systemctl restart apache2
```

## Step 2: Create Database

```bash
# Connect to MySQL/MariaDB
mysql -u root -p

# Create database and user
CREATE DATABASE dar_khedma;
CREATE USER 'dar_khedma'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON dar_khedma.* TO 'dar_khedma'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Step 3: Import Database Schema

```bash
# From the project directory
mysql -u dar_khedma -p dar_khedma < api/database-mysql.sql

# (Optional) Load sample data
mysql -u dar_khedma -p dar_khedma < api/database-seed.sql
```

## Step 4: Configure Environment

1. **Copy the .env.example file to .env:**
   ```bash
   cp api/.env.example api/.env
   ```

2. **Edit the .env file with your database credentials:**
   ```bash
   nano api/.env
   ```

3. **Update the following values:**
   ```
   DB_HOST=localhost
   DB_USER=dar_khedma
   DB_PASS=your_secure_password
   DB_NAME=dar_khedma
   JWT_SECRET=generate-a-secure-random-string
   ```

4. **Generate a secure JWT_SECRET:**
   ```bash
   # On Linux/Mac:
   openssl rand -base64 32

   # On Windows (PowerShell):
   [Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
   ```

   Copy the generated string and paste it into your `.env` file as `JWT_SECRET=your_generated_string`

## Step 5: Deploy to Apache

### Option A: Deploy to Apache Document Root

```bash
# Copy the entire project to Apache's document root
sudo cp -r . /var/www/html/dar-khedma/

# Set proper permissions
sudo chown -R www-data:www-data /var/www/html/dar-khedma/
sudo chmod -R 755 /var/www/html/dar-khedma/
sudo chmod -R 755 /var/www/html/dar-khedma/api

# The application will be accessible at: http://localhost/dar-khedma/
```

### Option B: Deploy to Subdomain (Recommended)

```bash
# Create Apache VirtualHost configuration
sudo nano /etc/apache2/sites-available/darkhedma.local.conf
```

Add this content:
```apache
<VirtualHost *:80>
    ServerName darkhedma.local
    ServerAdmin admin@darkhedma.local

    DocumentRoot /var/www/darkhedma

    <Directory /var/www/darkhedma>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/darkhedma-error.log
    CustomLog ${APACHE_LOG_DIR}/darkhedma-access.log combined
</VirtualHost>
```

Enable the site:
```bash
sudo a2ensite darkhedma.local.conf
sudo systemctl restart apache2
```

Add to your local hosts file (`/etc/hosts` or `C:\Windows\System32\drivers\etc\hosts`):
```
127.0.0.1 darkhedma.local
```

## Step 6: Verify Installation

### Test Frontend
- Navigate to: `http://localhost/dar-khedma/` (if using root deployment)
- Or: `http://darkhedma.local/` (if using subdomain)

You should see the home page.

### Test API Endpoints

```bash
# Get all services
curl http://localhost/dar-khedma/api/services

# Login
curl -X POST http://localhost/dar-khedma/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@darkhedma.com","password":"admin123"}'

# Use the returned token for authenticated endpoints
TOKEN="your_token_here"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost/dar-khedma/api/auth/me
```

## Troubleshooting

### API Returns 404 Errors

**Check if mod_rewrite is enabled:**
```bash
apache2ctl -M | grep rewrite
# Should show: rewrite_module (shared)
```

If not enabled:
```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

### Authentication Token Not Recognized

Check that the `.env` file has a `JWT_SECRET` set:
```bash
grep JWT_SECRET api/.env
```

If not set, regenerate it and restart Apache.

### Database Connection Failed

1. Verify MariaDB/MySQL is running:
   ```bash
   sudo systemctl status mysql
   # or
   sudo systemctl status mariadb
   ```

2. Test the connection:
   ```bash
   mysql -u dar_khedma -p -h localhost dar_khedma
   ```

3. Check the `.env` file has correct credentials:
   ```bash
   cat api/.env
   ```

### Pages Not Loading (Blank White Screen)

1. **Enable PHP error logging:**
   Edit `/etc/php/7.4/apache2/php.ini` (adjust version as needed):
   ```ini
   display_errors = On
   error_log = /var/log/apache2/php-errors.log
   ```

2. **Restart Apache:**
   ```bash
   sudo systemctl restart apache2
   ```

3. **Check error logs:**
   ```bash
   tail -f /var/log/apache2/error.log
   tail -f /var/log/apache2/php-errors.log
   ```

## Default Test Credentials

After loading the sample data, you can login with:

**Admin Account:**
- Email: `admin@darkhedma.com`
- Password: `admin123`

**Regular User:**
- Email: `john@example.com`
- Password: `user123`

## Security Notes for Production

1. **Change default passwords immediately after login**
2. **Update JWT_SECRET to a strong, random value**
3. **Use HTTPS for all connections**
4. **Remove or restrict access to `/api/.env` file**
5. **Use strong database user passwords**
6. **Regular database backups**
7. **Monitor error logs for suspicious activity**

## Database Tables

The database includes the following tables:

- `users` - User accounts and profiles
- `service_categories` - Service categories
- `services` - Service listings with pricing
- `service_pricing` - Flexible pricing tiers
- `bookings` - Service bookings/reservations
- `service_providers` - Service provider profiles
- `contact_submissions` - Contact form submissions
- `sessions` - JWT session management

## Support

For issues not covered here, check the API endpoints in the `api/` directory and review the controller implementations.

