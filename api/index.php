<?php
/**
 * Main API Entry Point
 * Lightweight PHP API Router
 */

require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/ServicesController.php';
require_once __DIR__ . '/controllers/BookingsController.php';
require_once __DIR__ . '/controllers/ContactController.php';
require_once __DIR__ . '/controllers/AdminController.php';

// Create router
$router = new Router();

// Auth routes
$router->post('/api/auth/register', 'AuthController', 'register');
$router->post('/api/auth/login', 'AuthController', 'login');
$router->get('/api/auth/me', 'AuthController', 'getProfile');

// Services routes
$router->get('/api/services/categories', 'ServicesController', 'getCategories');
$router->get('/api/services', 'ServicesController', 'getServices');
$router->get('/api/services/:id', 'ServicesController', 'getService');
$router->get('/api/services/:id/pricing', 'ServicesController', 'getPricing');

// Bookings routes (require auth)
$router->post('/api/bookings', 'BookingsController', 'createBooking');
$router->get('/api/bookings', 'BookingsController', 'getBookings');
$router->get('/api/bookings/:id', 'BookingsController', 'getBooking');
$router->put('/api/bookings/:id', 'BookingsController', 'updateBooking');
$router->delete('/api/bookings/:id', 'BookingsController', 'cancelBooking');

// Admin routes
$router->get('/api/admin/dashboard', 'AdminController', 'getDashboard');
$router->get('/api/admin/users', 'AdminController', 'getUsers');
$router->get('/api/admin/service-providers', 'AdminController', 'getServiceProviders');
$router->put('/api/admin/service-providers/:id/approve', 'AdminController', 'approveProvider');
$router->put('/api/admin/service-providers/:id/reject', 'AdminController', 'rejectProvider');
$router->get('/api/admin/bookings', 'AdminController', 'getBookings');
$router->get('/api/admin/contact-submissions', 'AdminController', 'getContactSubmissions');
$router->put('/api/admin/contact-submissions/:id', 'AdminController', 'updateContactSubmission');

// Contact routes
$router->post('/api/contact', 'ContactController', 'submit');

// Dispatch
$router->dispatch();

?>
