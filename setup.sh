#!/bin/bash
# Quick Setup Script for Raspberry Pi Deployment
# Run this script to set up your PHP Dar Khedma on Raspberry Pi

set -e

echo "======================================"
echo "Dar Khedma PHP Setup Script"
echo "======================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DB_USER="root"
DB_NAME="dar_khedma"
WEB_ROOT="/var/www/client1/public_html"

echo -e "${YELLOW}Step 1: Checking prerequisites...${NC}"

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}MySQL/MariaDB not found. Please install: sudo apt install mariadb-server${NC}"
    exit 1
fi

# Check if Apache is installed
if ! command -v apache2ctl &> /dev/null; then
    echo -e "${RED}Apache not found. Please install: sudo apt install apache2 php php-mysql libapache2-mod-php${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites OK${NC}\n"

echo -e "${YELLOW}Step 2: Checking Apache modules...${NC}"

if ! apache2ctl -M 2>&1 | grep -q "rewrite_module"; then
    echo -e "${YELLOW}Enabling mod_rewrite...${NC}"
    sudo a2enmod rewrite
fi

if ! apache2ctl -M 2>&1 | grep -q "headers_module"; then
    echo -e "${YELLOW}Enabling mod_headers...${NC}"
    sudo a2enmod headers
fi

echo -e "${GREEN}✓ Apache modules OK${NC}\n"

echo -e "${YELLOW}Step 3: Creating database...${NC}"

# Check if database exists
if mysql -u "$DB_USER" -p -e "USE $DB_NAME" 2>/dev/null; then
    echo -e "${YELLOW}Database already exists. Backup before proceeding.${NC}"
    read -p "Continue? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    mysql -u "$DB_USER" -p -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
    echo -e "${GREEN}✓ Database created${NC}"
fi

echo -e "${YELLOW}Step 4: Importing database schema...${NC}"

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ -f "$SCRIPT_DIR/database-mysql.sql" ]; then
    mysql -u "$DB_USER" -p "$DB_NAME" < "$SCRIPT_DIR/database-mysql.sql"
    echo -e "${GREEN}✓ Schema imported${NC}"
else
    echo -e "${RED}database-mysql.sql not found${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 5: Importing seed data...${NC}"

if [ -f "$SCRIPT_DIR/database-seed.sql" ]; then
    mysql -u "$DB_USER" -p "$DB_NAME" < "$SCRIPT_DIR/database-seed.sql"
    echo -e "${GREEN}✓ Seed data imported${NC}"
else
    echo -e "${YELLOW}Warning: database-seed.sql not found${NC}"
fi

echo -e "${YELLOW}Step 6: Setting file permissions...${NC}"

sudo chown -R www-data:www-data "$WEB_ROOT"
sudo chmod -R 755 "$WEB_ROOT"
sudo chmod -R 644 "$WEB_ROOT/api/config"

echo -e "${GREEN}✓ Permissions set${NC}\n"

echo -e "${YELLOW}Step 7: Configuration...${NC}"

read -p "Enter MariaDB username (default: root): " DB_USER_INPUT
DB_USER=${DB_USER_INPUT:-root}

read -sp "Enter MariaDB password: " DB_PASS
echo

# Update database.php
sed -i "s/define('DB_USER', .*/define('DB_USER', '$DB_USER');/" "$SCRIPT_DIR/api/config/database.php"
sed -i "s/define('DB_PASS', .*/define('DB_PASS', '$DB_PASS');/" "$SCRIPT_DIR/api/config/database.php"

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32)
sed -i "s|define('JWT_SECRET', .*|define('JWT_SECRET', '$JWT_SECRET');|" "$SCRIPT_DIR/api/config/jwt.php"

echo -e "${GREEN}✓ Configuration updated${NC}\n"

echo -e "${YELLOW}Step 8: Restarting Apache...${NC}"

sudo systemctl restart apache2

echo -e "${GREEN}✓ Apache restarted${NC}\n"

echo -e "${GREEN}======================================"
echo "Setup Complete!"
echo "======================================${NC}\n"

echo "API Base URL: http://$(hostname -I | awk '{print $1}')/api"
echo ""
echo "Test the API:"
echo "  curl http://$(hostname -I | awk '{print $1}')/api/services/categories"
echo ""
echo "Login with:"
echo "  Email: admin@darkhedma.com"
echo "  Password: admin123"
echo ""
echo "Next steps:"
echo "  1. Update API_BASE in your JavaScript files"
echo "  2. Configure HTTPS (Let's Encrypt)"
echo "  3. Update frontend to use new API URL"
echo ""
echo "Documentation:"
echo "  - PHP-SETUP.md: Detailed setup guide"
echo "  - MIGRATION-CHECKLIST.md: Migration checklist"
echo "  - API-EXAMPLES.html: JavaScript examples"
