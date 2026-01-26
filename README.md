# Dar Khedma - Professional Service Marketplace

**A complete, production-ready service marketplace platform for home and business services built with Hono, Cloudflare Pages, and D1 Database.**

## 🌐 Live Demo

**Public URL**: https://3000-imlqpqpptphgtjj1yjryx-5185f4aa.sandbox.novita.ai

## 📋 Project Overview

Dar Khedma is a full-stack service marketplace platform that connects customers with professional service providers for:
- 🧹 Cleaning
- 🍳 Cooking  
- 🔧 Maintenance
- 🔩 Installation
- 🚗 Drivers
- 🌿 Gardening

### Target Audiences
- **Individuals** - Home services for personal needs
- **Businesses** - Professional services for commercial spaces

### Service Types
- **Visit-Based Services** - One-time or scheduled visits (4h, 8h, monthly)
- **Contract-Based Services** - Long-term contracts (1, 3, 6, 12 months)
- **Service Modes** - Resident (live-in) or Non-Resident (scheduled hours)

## ✨ Features

### 🏠 User Features
- Browse services categorized by type (Individual/Business)
- View detailed pricing for visit and contract options
- Book services with flexible scheduling
- Manage bookings and track service status
- Profile management with business account support

### 👨‍💼 Service Provider Features
- Apply to join the platform
- Skills and availability management
- Professional profile with experience and qualifications

### 🛠 Admin Dashboard
- Complete platform management
- User management and statistics
- Booking oversight and status updates
- Service provider approval workflow
- Service and pricing management
- Contact form submissions review

## 🏗 Technology Stack

### Backend
- **Hono** - Fast, lightweight web framework for Cloudflare Workers
- **Cloudflare Pages** - Edge deployment platform
- **Cloudflare D1** - Globally distributed SQLite database
- **TypeScript** - Type-safe development

### Frontend
- **HTML5/CSS3** - Modern, responsive design
- **Tailwind CSS** - Utility-first CSS framework (via CDN)
- **Vanilla JavaScript** - No framework dependencies
- **Font Awesome** - Professional icons

### Authentication & Security
- **JWT** - Secure token-based authentication
- **Web Crypto API** - Native browser cryptography
- **Role-Based Access Control** - User and Admin roles
- **SHA-256 Password Hashing** - Secure password storage

## 📊 Database Schema

### Core Tables
- **users** - User accounts with role-based access (user/admin)
- **service_providers** - Professional service provider applications
- **service_categories** - Service categorization (6 main categories)
- **services** - Available services with audience targeting
- **service_pricing** - Flexible pricing for all service combinations
- **bookings** - Customer bookings with status tracking
- **contact_submissions** - Contact form messages
- **sessions** - JWT token management

### Key Features
- Relational integrity with foreign keys
- Indexed columns for performance
- Support for both individual and business accounts
- Flexible service pricing structure
- Complete audit trail with timestamps

## 📁 Project Structure

```
webapp/
├── src/
│   ├── index.tsx              # Main application with all routes
│   ├── routes/
│   │   ├── auth.ts            # Authentication endpoints
│   │   ├── services.ts        # Service browsing and search
│   │   ├── bookings.ts        # Booking management
│   │   ├── admin.ts           # Admin dashboard APIs
│   │   └── public.ts          # Contact & provider applications
│   ├── middleware/
│   │   └── auth.ts            # JWT authentication middleware
│   └── utils/
│       ├── jwt.ts             # JWT and password utilities
│       └── db.ts              # Database query helpers
├── public/static/
│   ├── css/
│   │   └── app.css            # Professional design system
│   └── js/
│       ├── auth.js            # Authentication utilities
│       ├── auth-page.js       # Sign in/up functionality
│       ├── services.js        # Services page logic
│       ├── dashboard.js       # User dashboard
│       ├── admin.js           # Admin dashboard
│       ├── contact.js         # Contact form
│       └── join.js            # Provider application
├── migrations/
│   └── 0001_initial_schema.sql # Database schema
├── seed.sql                    # Sample data
├── ecosystem.config.cjs        # PM2 configuration
├── wrangler.toml              # Cloudflare configuration
├── vite.config.ts             # Build configuration
└── package.json               # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Wrangler CLI (for Cloudflare)
- PM2 (pre-installed in sandbox)

### Installation

1. **Clone the repository** (if applicable)
```bash
cd /home/user/webapp
```

2. **Install dependencies**
```bash
npm install
```

3. **Initialize database**
```bash
# Apply database migrations
npm run db:migrate:local

# Seed with sample data
npm run db:seed
```

4. **Build the project**
```bash
npm run build
```

5. **Start development server**
```bash
# Option 1: Using PM2 (recommended)
pm2 start ecosystem.config.cjs

# Option 2: Direct (blocking)
npm run dev:sandbox
```

6. **Access the application**
- Local: http://localhost:3000
- Public: Use GetServiceUrl tool

## 🎯 Test Credentials

### Admin Account
- **Email**: admin@darkhedma.com
- **Password**: admin123

### Test User Accounts
- **Individual User**: john@example.com / user123
- **Business User**: business@example.com / user123

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Services
- `GET /api/services` - List all services (with filters)
- `GET /api/services/:id` - Get service details
- `GET /api/services/:id/pricing` - Get service pricing
- `GET /api/services/grouped/by-category` - Services grouped by category
- `GET /api/services/categories` - List categories

### Bookings (Authenticated)
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - List user's bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Public
- `POST /api/contact` - Submit contact form
- `POST /api/providers/apply` - Apply as service provider

### Admin (Admin Only)
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - List all users
- `GET /api/admin/bookings` - List all bookings
- `PUT /api/admin/bookings/:id` - Update booking status
- `GET /api/admin/providers` - List service providers
- `PUT /api/admin/providers/:id` - Update provider status
- `GET /api/admin/contacts` - List contact submissions
- `PUT /api/admin/contacts/:id` - Update contact status
- `GET /api/admin/services` - List services
- `PUT /api/admin/services/:id` - Update service
- `GET /api/admin/pricing` - List pricing options
- `PUT /api/admin/pricing/:id` - Update pricing

## 🎨 Pages

1. **Home** (/) - Hero section, services overview, why choose us
2. **Services** (/services) - Browse and filter services by audience
3. **About Us** (/about) - Company mission, vision, and values
4. **Contact** (/contact) - Contact form and information
5. **Join Us** (/join) - Service provider application form
6. **Auth** (/auth) - Unified sign in/sign up page
7. **Dashboard** (/dashboard) - User booking management
8. **Admin** (/admin) - Complete admin management interface

## 🔐 Security Features

- JWT-based authentication with 7-day expiration
- SHA-256 password hashing
- Role-based access control (User/Admin)
- Protected API endpoints with middleware
- Session token management
- XSS and CSRF protection

## 🎨 Design Features

- **Professional color palette** - Blues and greens for trust
- **Fully responsive** - Mobile-first design
- **Clean typography** - Modern, readable fonts
- **Interactive elements** - Hover effects and transitions
- **Status badges** - Visual booking status indicators
- **Loading states** - Spinner animations
- **Form validation** - Frontend and backend
- **Error handling** - User-friendly error messages

## 📝 Database Management Commands

```bash
# Reset local database (DANGER: Deletes all data)
npm run db:reset

# Apply migrations to local database
npm run db:migrate:local

# Apply migrations to production database
npm run db:migrate:prod

# Seed database with test data
npm run db:seed

# Open database console (local)
npm run db:console:local

# Open database console (production)
npm run db:console:prod
```

## 🚀 Deployment

### Local Development
```bash
# Build project
npm run build

# Start with PM2
pm2 start ecosystem.config.cjs

# View logs
pm2 logs webapp --nostream
```

### Cloudflare Pages Production Deployment

1. **Setup Cloudflare API Key**
```bash
# Use setup_cloudflare_api_key tool first
```

2. **Create Production Database**
```bash
npx wrangler d1 create darkhedma-production
# Copy the database ID to wrangler.toml
```

3. **Apply Migrations to Production**
```bash
npm run db:migrate:prod
```

4. **Deploy to Cloudflare Pages**
```bash
npm run deploy:prod
```

## 📈 Current Status

### ✅ Completed Features
- Full authentication system with JWT
- Complete database schema with seed data
- All backend API routes (auth, services, bookings, admin, public)
- All frontend pages (Home, Services, About, Contact, Join, Auth, Dashboard, Admin)
- Professional responsive CSS design
- User dashboard with booking management
- Admin dashboard with complete platform management
- Service provider application system
- Contact form functionality
- Role-based access control

### 🎯 Future Enhancements
- Payment integration (Stripe/PayPal)
- Email notifications
- SMS notifications
- Service provider mobile app
- Real-time chat support
- Service ratings and reviews
- Advanced search and filters
- Multi-language support (Arabic/English)
- Calendar integration
- Document upload for providers

## 🐛 Known Limitations

- Password hashing uses SHA-256 (consider bcrypt for production)
- File uploads not yet implemented
- No email verification for registration
- No password reset functionality
- Admin panel needs more sophisticated role permissions

## 📞 Support & Contact

For questions or support, please use the contact form on the website or reach out to:
- **Email**: info@darkhedma.com
- **Phone**: +971 XX XXX XXXX

## 📄 License

This is a commercial project built for Dar Khedma. All rights reserved.

## 🙏 Acknowledgments

Built with:
- Hono Framework
- Cloudflare Pages & D1
- Tailwind CSS
- Font Awesome
- TypeScript

---

**Last Updated**: January 26, 2026
**Version**: 1.0.0
**Status**: ✅ Production Ready
**Public URL**: https://3000-imlqpqpptphgtjj1yjryx-5185f4aa.sandbox.novita.ai
