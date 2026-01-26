import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/cloudflare-workers';

// Import routes
import auth from './routes/auth';
import services from './routes/services';
import bookings from './routes/bookings';
import publicRoutes from './routes/public';
import admin from './routes/admin';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS for API routes
app.use('/api/*', cors());

// Serve static files
app.use('/static/*', serveStatic({ root: './' }));

// API Routes
app.route('/api/auth', auth);
app.route('/api/services', services);
app.route('/api/bookings', bookings);
app.route('/api', publicRoutes);
app.route('/api/admin', admin);

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Frontend Routes - HTML pages
app.get('/', (c) => {
  return c.html(getHomePage());
});

app.get('/services', (c) => {
  return c.html(getServicesPage());
});

app.get('/about', (c) => {
  return c.html(getAboutPage());
});

app.get('/contact', (c) => {
  return c.html(getContactPage());
});

app.get('/join', (c) => {
  return c.html(getJoinPage());
});

app.get('/auth', (c) => {
  return c.html(getAuthPage());
});

app.get('/dashboard', (c) => {
  return c.html(getDashboardPage());
});

app.get('/admin', (c) => {
  return c.html(getAdminDashboardPage());
});

// Helper functions to generate HTML pages
function getLayoutHTML(title: string, content: string, activePage: string = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Dar Khedma</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="/static/css/app.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <a href="/" class="flex items-center">
                        <i class="fas fa-home text-blue-600 text-2xl mr-2"></i>
                        <span class="text-2xl font-bold text-gray-800">Dar Khedma</span>
                    </a>
                </div>
                <div class="hidden md:flex items-center space-x-8">
                    <a href="/" class="nav-link ${activePage === 'home' ? 'active' : ''}">Home</a>
                    <a href="/services" class="nav-link ${activePage === 'services' ? 'active' : ''}">Services</a>
                    <a href="/about" class="nav-link ${activePage === 'about' ? 'active' : ''}">About Us</a>
                    <a href="/contact" class="nav-link ${activePage === 'contact' ? 'active' : ''}">Contact</a>
                    <a href="/join" class="nav-link ${activePage === 'join' ? 'active' : ''}">Join Us</a>
                    <a href="/dashboard" class="btn-primary-sm" id="dashboardBtn" style="display: none;">Dashboard</a>
                    <a href="/auth" class="btn-primary-sm" id="authBtn">Sign In</a>
                    <button id="logoutBtn" class="btn-secondary-sm" style="display: none;">Logout</button>
                </div>
                <div class="md:hidden flex items-center">
                    <button id="mobileMenuBtn" class="text-gray-600 hover:text-gray-800">
                        <i class="fas fa-bars text-2xl"></i>
                    </button>
                </div>
            </div>
        </div>
        <!-- Mobile menu -->
        <div id="mobileMenu" class="hidden md:hidden bg-white border-t">
            <div class="px-4 py-2 space-y-2">
                <a href="/" class="block py-2 hover:text-blue-600">Home</a>
                <a href="/services" class="block py-2 hover:text-blue-600">Services</a>
                <a href="/about" class="block py-2 hover:text-blue-600">About Us</a>
                <a href="/contact" class="block py-2 hover:text-blue-600">Contact</a>
                <a href="/join" class="block py-2 hover:text-blue-600">Join Us</a>
                <a href="/dashboard" id="dashboardBtnMobile" class="block py-2 hover:text-blue-600" style="display: none;">Dashboard</a>
                <a href="/auth" id="authBtnMobile" class="block py-2 hover:text-blue-600">Sign In</a>
                <button id="logoutBtnMobile" class="block py-2 hover:text-blue-600 w-full text-left" style="display: none;">Logout</button>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    ${content}

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-12 mt-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-lg font-bold mb-4">Dar Khedma</h3>
                    <p class="text-gray-400">Professional home and business services you can trust.</p>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Services</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="/services?audience=individual" class="hover:text-white">For Individuals</a></li>
                        <li><a href="/services?audience=business" class="hover:text-white">For Businesses</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Company</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="/about" class="hover:text-white">About Us</a></li>
                        <li><a href="/contact" class="hover:text-white">Contact</a></li>
                        <li><a href="/join" class="hover:text-white">Join Our Team</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Contact Info</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><i class="fas fa-phone mr-2"></i> +971 XX XXX XXXX</li>
                        <li><i class="fas fa-envelope mr-2"></i> info@darkhedma.com</li>
                        <li><i class="fas fa-map-marker-alt mr-2"></i> UAE</li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2024 Dar Khedma. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script src="/static/js/auth.js"></script>
    <script src="/static/js/app.js"></script>
</body>
</html>`;
}

function getHomePage() {
  return getLayoutHTML('Home', `
    <main>
        <!-- Hero Section -->
        <section class="hero-section">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 class="hero-title">Professional Services for Your Home & Business</h1>
                <p class="hero-subtitle">Trusted, reliable, and affordable services delivered by qualified professionals</p>
                <div class="flex justify-center gap-4 mt-8">
                    <a href="/services?audience=individual" class="btn-primary">Services for Individuals</a>
                    <a href="/services?audience=business" class="btn-secondary">Services for Businesses</a>
                </div>
            </div>
        </section>

        <!-- Services Overview -->
        <section class="section-padding">
            <div class="container-custom">
                <h2 class="section-title">Our Services</h2>
                <div class="services-grid" id="servicesGrid">
                    <div class="service-card">
                        <i class="fas fa-broom text-5xl text-blue-600 mb-4"></i>
                        <h3 class="text-xl font-semibold mb-2">Cleaning</h3>
                        <p class="text-gray-600">Professional cleaning for homes and offices</p>
                    </div>
                    <div class="service-card">
                        <i class="fas fa-utensils text-5xl text-blue-600 mb-4"></i>
                        <h3 class="text-xl font-semibold mb-2">Cooking</h3>
                        <p class="text-gray-600">Expert chefs and meal preparation</p>
                    </div>
                    <div class="service-card">
                        <i class="fas fa-tools text-5xl text-blue-600 mb-4"></i>
                        <h3 class="text-xl font-semibold mb-2">Maintenance</h3>
                        <p class="text-gray-600">General repairs and maintenance</p>
                    </div>
                    <div class="service-card">
                        <i class="fas fa-screwdriver text-5xl text-blue-600 mb-4"></i>
                        <h3 class="text-xl font-semibold mb-2">Installation</h3>
                        <p class="text-gray-600">Professional installation services</p>
                    </div>
                    <div class="service-card">
                        <i class="fas fa-car text-5xl text-blue-600 mb-4"></i>
                        <h3 class="text-xl font-semibold mb-2">Drivers</h3>
                        <p class="text-gray-600">Professional driver services</p>
                    </div>
                    <div class="service-card">
                        <i class="fas fa-leaf text-5xl text-blue-600 mb-4"></i>
                        <h3 class="text-xl font-semibold mb-2">Gardening</h3>
                        <p class="text-gray-600">Garden maintenance and landscaping</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Why Choose Us -->
        <section class="bg-gray-100 section-padding">
            <div class="container-custom">
                <h2 class="section-title">Why Choose Dar Khedma?</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="text-center">
                        <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-shield-alt text-blue-600 text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">Trusted Professionals</h3>
                        <p class="text-gray-600">All our service providers are vetted, qualified, and background-checked</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-dollar-sign text-blue-600 text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">Affordable Pricing</h3>
                        <p class="text-gray-600">Transparent pricing with flexible payment options and contracts</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-clock text-blue-600 text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">Flexible Scheduling</h3>
                        <p class="text-gray-600">Choose from visit-based or contract services to suit your needs</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="section-padding">
            <div class="container-custom text-center">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
                <p class="text-xl text-gray-600 mb-8">Browse our services and book the one that suits your needs</p>
                <a href="/services" class="btn-primary">View All Services</a>
            </div>
        </section>
    </main>
  `, 'home');
}

function getServicesPage() {
  return getLayoutHTML('Services', `
    <main class="section-padding">
        <div class="container-custom">
            <h1 class="page-title">Our Services</h1>
            
            <!-- Audience Tabs -->
            <div class="flex justify-center mb-8">
                <div class="inline-flex rounded-lg border border-gray-300 bg-white p-1">
                    <button class="audience-tab active" data-audience="individual">
                        <i class="fas fa-user mr-2"></i>For Individuals
                    </button>
                    <button class="audience-tab" data-audience="business">
                        <i class="fas fa-building mr-2"></i>For Businesses
                    </button>
                </div>
            </div>

            <!-- Loading State -->
            <div id="servicesLoading" class="text-center py-12">
                <i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
                <p class="mt-4 text-gray-600">Loading services...</p>
            </div>

            <!-- Services Content -->
            <div id="servicesContent" class="hidden">
                <!-- Services will be loaded here by JavaScript -->
            </div>
        </div>
    </main>
    <script src="/static/js/services.js"></script>
  `, 'services');
}

function getAboutPage() {
  return getLayoutHTML('About Us', `
    <main class="section-padding">
        <div class="container-custom">
            <h1 class="page-title">About Dar Khedma</h1>
            
            <div class="max-w-4xl mx-auto">
                <div class="bg-white rounded-lg shadow-md p-8 mb-8">
                    <h2 class="text-2xl font-bold mb-4">Our Mission</h2>
                    <p class="text-gray-700 mb-6">
                        At Dar Khedma, our mission is to provide exceptional home and business services through a network of trusted, 
                        qualified professionals. We believe that quality services should be accessible, affordable, and reliable.
                    </p>
                    
                    <h2 class="text-2xl font-bold mb-4">Our Vision</h2>
                    <p class="text-gray-700 mb-6">
                        To become the leading service marketplace in the region, connecting skilled professionals with customers 
                        who value quality, trust, and convenience.
                    </p>
                    
                    <h2 class="text-2xl font-bold mb-4">Our Values</h2>
                    <ul class="space-y-3 text-gray-700">
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-blue-600 mt-1 mr-3"></i>
                            <div>
                                <strong>Trust:</strong> Every service provider is thoroughly vetted and background-checked
                            </div>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-blue-600 mt-1 mr-3"></i>
                            <div>
                                <strong>Quality:</strong> We maintain high standards for all services delivered
                            </div>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-blue-600 mt-1 mr-3"></i>
                            <div>
                                <strong>Transparency:</strong> Clear pricing and honest communication
                            </div>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-blue-600 mt-1 mr-3"></i>
                            <div>
                                <strong>Customer Focus:</strong> Your satisfaction is our priority
                            </div>
                        </li>
                    </ul>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="text-center p-6 bg-blue-50 rounded-lg">
                        <div class="text-4xl font-bold text-blue-600 mb-2">500+</div>
                        <div class="text-gray-600">Verified Professionals</div>
                    </div>
                    <div class="text-center p-6 bg-blue-50 rounded-lg">
                        <div class="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
                        <div class="text-gray-600">Services Completed</div>
                    </div>
                    <div class="text-center p-6 bg-blue-50 rounded-lg">
                        <div class="text-4xl font-bold text-blue-600 mb-2">98%</div>
                        <div class="text-gray-600">Customer Satisfaction</div>
                    </div>
                </div>
            </div>
        </div>
    </main>
  `, 'about');
}

function getContactPage() {
  return getLayoutHTML('Contact Us', `
    <main class="section-padding">
        <div class="container-custom">
            <h1 class="page-title">Contact Us</h1>
            
            <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Contact Form -->
                <div class="bg-white rounded-lg shadow-md p-8">
                    <h2 class="text-2xl font-bold mb-6">Send us a Message</h2>
                    <form id="contactForm" class="space-y-4">
                        <div>
                            <label class="form-label">Full Name *</label>
                            <input type="text" name="name" required class="form-input">
                        </div>
                        <div>
                            <label class="form-label">Email *</label>
                            <input type="email" name="email" required class="form-input">
                        </div>
                        <div>
                            <label class="form-label">Phone</label>
                            <input type="tel" name="phone" class="form-input">
                        </div>
                        <div>
                            <label class="form-label">Subject</label>
                            <input type="text" name="subject" class="form-input">
                        </div>
                        <div>
                            <label class="form-label">Message *</label>
                            <textarea name="message" required rows="5" class="form-input"></textarea>
                        </div>
                        <button type="submit" class="btn-primary w-full">Send Message</button>
                        <div id="contactMessage" class="hidden"></div>
                    </form>
                </div>

                <!-- Contact Information -->
                <div>
                    <div class="bg-white rounded-lg shadow-md p-8 mb-6">
                        <h2 class="text-2xl font-bold mb-6">Get in Touch</h2>
                        <div class="space-y-4">
                            <div class="flex items-start">
                                <i class="fas fa-map-marker-alt text-blue-600 text-xl mt-1 mr-4"></i>
                                <div>
                                    <div class="font-semibold">Address</div>
                                    <div class="text-gray-600">United Arab Emirates</div>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <i class="fas fa-phone text-blue-600 text-xl mt-1 mr-4"></i>
                                <div>
                                    <div class="font-semibold">Phone</div>
                                    <div class="text-gray-600">+971 XX XXX XXXX</div>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <i class="fas fa-envelope text-blue-600 text-xl mt-1 mr-4"></i>
                                <div>
                                    <div class="font-semibold">Email</div>
                                    <div class="text-gray-600">info@darkhedma.com</div>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <i class="fas fa-clock text-blue-600 text-xl mt-1 mr-4"></i>
                                <div>
                                    <div class="font-semibold">Business Hours</div>
                                    <div class="text-gray-600">24/7 Service Available</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-blue-50 rounded-lg p-6">
                        <h3 class="font-semibold mb-2">Need Immediate Assistance?</h3>
                        <p class="text-gray-600 mb-4">Our customer support team is available 24/7 to help you.</p>
                        <a href="tel:+971XXXXXXX" class="btn-primary w-full text-center">Call Now</a>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <script src="/static/js/contact.js"></script>
  `, 'contact');
}

function getJoinPage() {
  return getLayoutHTML('Join Us', `
    <main class="section-padding">
        <div class="container-custom">
            <h1 class="page-title">Join Our Team of Professionals</h1>
            <p class="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                Are you a skilled professional looking for opportunities? Join Dar Khedma and connect with 
                clients who need your services.
            </p>
            
            <div class="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
                <form id="providerForm" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="form-label">Full Name *</label>
                            <input type="text" name="full_name" required class="form-input">
                        </div>
                        <div>
                            <label class="form-label">Email *</label>
                            <input type="email" name="email" required class="form-input">
                        </div>
                        <div>
                            <label class="form-label">Phone *</label>
                            <input type="tel" name="phone" required class="form-input">
                        </div>
                        <div>
                            <label class="form-label">City</label>
                            <input type="text" name="city" class="form-input">
                        </div>
                        <div>
                            <label class="form-label">Date of Birth</label>
                            <input type="date" name="date_of_birth" class="form-input">
                        </div>
                        <div>
                            <label class="form-label">Years of Experience</label>
                            <input type="number" name="experience_years" min="0" class="form-input">
                        </div>
                    </div>

                    <div>
                        <label class="form-label">Address</label>
                        <input type="text" name="address" class="form-input">
                    </div>

                    <div>
                        <label class="form-label">National ID</label>
                        <input type="text" name="national_id" class="form-input">
                    </div>

                    <div>
                        <label class="form-label">Skills/Services *</label>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                            <label class="flex items-center">
                                <input type="checkbox" name="skills" value="Cleaning" class="mr-2">
                                Cleaning
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="skills" value="Cooking" class="mr-2">
                                Cooking
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="skills" value="Maintenance" class="mr-2">
                                Maintenance
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="skills" value="Installation" class="mr-2">
                                Installation
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="skills" value="Drivers" class="mr-2">
                                Drivers
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="skills" value="Gardening" class="mr-2">
                                Gardening
                            </label>
                        </div>
                    </div>

                    <div>
                        <label class="form-label">Availability (Days)</label>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                            <label class="flex items-center">
                                <input type="checkbox" name="days" value="Sun" class="mr-2">
                                Sunday
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="days" value="Mon" class="mr-2">
                                Monday
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="days" value="Tue" class="mr-2">
                                Tuesday
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="days" value="Wed" class="mr-2">
                                Wednesday
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="days" value="Thu" class="mr-2">
                                Thursday
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="days" value="Fri" class="mr-2">
                                Friday
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="days" value="Sat" class="mr-2">
                                Saturday
                            </label>
                        </div>
                    </div>

                    <div>
                        <label class="form-label">Preferred Working Hours</label>
                        <input type="text" name="hours" placeholder="e.g., 8am-5pm" class="form-input">
                    </div>

                    <button type="submit" class="btn-primary w-full">Submit Application</button>
                    <div id="providerMessage" class="hidden"></div>
                </form>
            </div>
        </div>
    </main>
    <script src="/static/js/join.js"></script>
  `, 'join');
}

function getAuthPage() {
  return getLayoutHTML('Sign In / Sign Up', `
    <main class="section-padding">
        <div class="container-custom">
            <div class="max-w-md mx-auto">
                <!-- Auth Tabs -->
                <div class="flex mb-8 border-b">
                    <button class="auth-tab active" data-tab="login">Sign In</button>
                    <button class="auth-tab" data-tab="register">Sign Up</button>
                </div>

                <!-- Login Form -->
                <div id="loginForm" class="auth-form-container">
                    <form class="space-y-4" onsubmit="handleLogin(event)">
                        <div>
                            <label class="form-label">Email</label>
                            <input type="email" name="email" required class="form-input">
                        </div>
                        <div>
                            <label class="form-label">Password</label>
                            <input type="password" name="password" required class="form-input">
                        </div>
                        <button type="submit" class="btn-primary w-full">Sign In</button>
                        <div id="loginMessage" class="hidden"></div>
                    </form>
                </div>

                <!-- Register Form -->
                <div id="registerForm" class="auth-form-container hidden">
                    <form class="space-y-4" onsubmit="handleRegister(event)">
                        <div>
                            <label class="form-label">Full Name *</label>
                            <input type="text" name="full_name" required class="form-input">
                        </div>
                        <div>
                            <label class="form-label">Email *</label>
                            <input type="email" name="email" required class="form-input">
                        </div>
                        <div>
                            <label class="form-label">Password * (min 6 characters)</label>
                            <input type="password" name="password" required minlength="6" class="form-input">
                        </div>
                        <div>
                            <label class="form-label">Phone</label>
                            <input type="tel" name="phone" class="form-input">
                        </div>
                        <div>
                            <label class="form-label">Account Type *</label>
                            <select name="account_type" required class="form-input" onchange="handleAccountTypeChange(event)">
                                <option value="individual">Individual</option>
                                <option value="business">Business</option>
                            </select>
                        </div>
                        <div id="businessFields" class="space-y-4 hidden">
                            <div>
                                <label class="form-label">Business Name *</label>
                                <input type="text" name="business_name" class="form-input">
                            </div>
                            <div>
                                <label class="form-label">Business Registration</label>
                                <input type="text" name="business_registration" class="form-input">
                            </div>
                        </div>
                        <div>
                            <label class="form-label">Address</label>
                            <input type="text" name="address" class="form-input">
                        </div>
                        <div>
                            <label class="form-label">City</label>
                            <input type="text" name="city" class="form-input">
                        </div>
                        <button type="submit" class="btn-primary w-full">Sign Up</button>
                        <div id="registerMessage" class="hidden"></div>
                    </form>
                </div>
            </div>
        </div>
    </main>
    <script src="/static/js/auth-page.js"></script>
  `, '');
}

function getDashboardPage() {
  return getLayoutHTML('Dashboard', `
    <main class="section-padding">
        <div class="container-custom">
            <div id="dashboardAuth" class="text-center py-12">
                <p class="text-gray-600 mb-4">Please sign in to view your dashboard</p>
                <a href="/auth" class="btn-primary">Sign In</a>
            </div>

            <div id="dashboardContent" class="hidden">
                <h1 class="page-title">My Dashboard</h1>
                
                <!-- User Info -->
                <div class="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 class="text-2xl font-bold mb-4">Welcome, <span id="userName"></span></h2>
                    <div id="userInfo" class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600"></div>
                </div>

                <!-- Booking Actions -->
                <div class="mb-8">
                    <a href="#" onclick="showBookingModal(); return false;" class="btn-primary">
                        <i class="fas fa-plus mr-2"></i>Book a Service
                    </a>
                </div>

                <!-- Bookings -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-2xl font-bold mb-6">My Bookings</h2>
                    
                    <!-- Status Filters -->
                    <div class="flex flex-wrap gap-2 mb-6">
                        <button class="filter-btn active" data-status="all">All</button>
                        <button class="filter-btn" data-status="pending">Pending</button>
                        <button class="filter-btn" data-status="confirmed">Confirmed</button>
                        <button class="filter-btn" data-status="in_progress">In Progress</button>
                        <button class="filter-btn" data-status="completed">Completed</button>
                        <button class="filter-btn" data-status="cancelled">Cancelled</button>
                    </div>

                    <div id="bookingsLoading" class="text-center py-8">
                        <i class="fas fa-spinner fa-spin text-3xl text-blue-600"></i>
                    </div>
                    <div id="bookingsList" class="space-y-4 hidden"></div>
                    <div id="bookingsEmpty" class="text-center py-8 text-gray-600 hidden">
                        No bookings found
                    </div>
                </div>
            </div>
        </div>
    </main>
    <script src="/static/js/dashboard.js"></script>
  `, '');
}

function getAdminDashboardPage() {
  return getLayoutHTML('Admin Dashboard', `
    <main class="section-padding">
        <div class="container-custom">
            <div id="adminAuth" class="text-center py-12">
                <p class="text-red-600 mb-4">Admin access required</p>
                <a href="/auth" class="btn-primary">Sign In</a>
            </div>

            <div id="adminContent" class="hidden">
                <h1 class="page-title">Admin Dashboard</h1>
                
                <!-- Statistics -->
                <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <div class="stat-card">
                        <div class="stat-value" id="statUsers">0</div>
                        <div class="stat-label">Users</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="statBookings">0</div>
                        <div class="stat-label">Total Bookings</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="statPendingBookings">0</div>
                        <div class="stat-label">Pending Bookings</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="statProviders">0</div>
                        <div class="stat-label">Providers</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="statPendingProviders">0</div>
                        <div class="stat-label">Pending Providers</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="statContacts">0</div>
                        <div class="stat-label">New Contacts</div>
                    </div>
                </div>

                <!-- Admin Tabs -->
                <div class="mb-8">
                    <div class="flex flex-wrap gap-2 border-b">
                        <button class="admin-tab active" data-tab="bookings">Bookings</button>
                        <button class="admin-tab" data-tab="users">Users</button>
                        <button class="admin-tab" data-tab="providers">Providers</button>
                        <button class="admin-tab" data-tab="services">Services</button>
                        <button class="admin-tab" data-tab="pricing">Pricing</button>
                        <button class="admin-tab" data-tab="contacts">Contacts</button>
                    </div>
                </div>

                <!-- Tab Contents -->
                <div id="adminTabContent">
                    <!-- Content will be loaded by JavaScript -->
                </div>
            </div>
        </div>
    </main>
    <script src="/static/js/admin.js"></script>
  `, '');
}

export default app;
