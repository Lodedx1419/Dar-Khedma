// Admin Dashboard functionality

let currentTab = 'bookings';

document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication and admin role
    if (!isAuthenticated() || !isAdmin()) {
        document.getElementById('adminAuth').classList.remove('hidden');
        return;
    }
    
    document.getElementById('adminContent').classList.remove('hidden');
    
    // Load statistics
    await loadStats();
    
    // Setup tab buttons
    setupTabs();
    
    // Load initial tab content
    loadTabContent('bookings');
});

async function loadStats() {
    try {
        const response = await apiRequest('/admin/stats');
        const stats = response.stats;
        
        document.getElementById('statUsers').textContent = stats.total_users;
        document.getElementById('statBookings').textContent = stats.total_bookings;
        document.getElementById('statPendingBookings').textContent = stats.pending_bookings;
        document.getElementById('statProviders').textContent = stats.approved_providers;
        document.getElementById('statPendingProviders').textContent = stats.pending_providers;
        document.getElementById('statContacts').textContent = stats.new_contacts;
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
}

function setupTabs() {
    const adminTabs = document.querySelectorAll('.admin-tab');
    
    adminTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            currentTab = tabName;
            
            adminTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            loadTabContent(tabName);
        });
    });
}

async function loadTabContent(tabName) {
    const tabContent = document.getElementById('adminTabContent');
    tabContent.innerHTML = '<div class="text-center py-8"><i class="fas fa-spinner fa-spin text-3xl text-blue-600"></i></div>';
    
    try {
        switch (tabName) {
            case 'bookings':
                await loadBookings();
                break;
            case 'users':
                await loadUsers();
                break;
            case 'providers':
                await loadProviders();
                break;
            case 'services':
                await loadServices();
                break;
            case 'pricing':
                await loadPricing();
                break;
            case 'contacts':
                await loadContacts();
                break;
        }
    } catch (error) {
        tabContent.innerHTML = `<p class="text-center text-red-600">Error loading ${tabName}</p>`;
    }
}

async function loadBookings() {
    const response = await apiRequest('/admin/bookings');
    const tabContent = document.getElementById('adminTabContent');
    
    let html = `
        <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold mb-4">Bookings Management</h2>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Service</th>
                            <th>Type</th>
                            <th>Start Date</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    response.bookings.forEach(booking => {
        html += `
            <tr>
                <td>${booking.id}</td>
                <td>${booking.user_name}<br><small class="text-gray-600">${booking.user_email}</small></td>
                <td>${booking.service_name}</td>
                <td>${booking.booking_type}</td>
                <td>${formatDate(booking.start_date)}</td>
                <td>${formatCurrency(booking.price)}</td>
                <td>${getStatusBadge(booking.status)}</td>
                <td>
                    <select onchange="updateBookingStatus(${booking.id}, this.value)" class="form-input">
                        <option value="">Update Status</option>
                        <option value="pending" ${booking.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="confirmed" ${booking.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                        <option value="in_progress" ${booking.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                        <option value="completed" ${booking.status === 'completed' ? 'selected' : ''}>Completed</option>
                        <option value="cancelled" ${booking.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    tabContent.innerHTML = html;
}

async function loadUsers() {
    const response = await apiRequest('/admin/users');
    const tabContent = document.getElementById('adminTabContent');
    
    let html = `
        <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold mb-4">Users Management</h2>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Type</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Registered</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    response.users.forEach(user => {
        html += `
            <tr>
                <td>${user.id}</td>
                <td>${user.full_name}${user.business_name ? `<br><small class="text-gray-600">${user.business_name}</small>` : ''}</td>
                <td>${user.email}</td>
                <td>${user.phone || 'N/A'}</td>
                <td>${user.account_type}</td>
                <td><span class="status-badge ${user.role === 'admin' ? 'status-completed' : 'status-pending'}">${user.role}</span></td>
                <td>${user.is_active ? '<span class="text-green-600">Active</span>' : '<span class="text-red-600">Inactive</span>'}</td>
                <td>${formatDate(user.created_at)}</td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    tabContent.innerHTML = html;
}

async function loadProviders() {
    const response = await apiRequest('/admin/providers');
    const tabContent = document.getElementById('adminTabContent');
    
    let html = `
        <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold mb-4">Service Providers Management</h2>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Contact</th>
                            <th>Skills</th>
                            <th>Experience</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    response.providers.forEach(provider => {
        const skills = JSON.parse(provider.skills || '[]');
        html += `
            <tr>
                <td>${provider.id}</td>
                <td>${provider.full_name}<br><small class="text-gray-600">${provider.city || 'N/A'}</small></td>
                <td>${provider.email}<br><small class="text-gray-600">${provider.phone}</small></td>
                <td>${skills.join(', ')}</td>
                <td>${provider.experience_years || 0} years</td>
                <td>${getStatusBadge(provider.status)}</td>
                <td>
                    <select onchange="updateProviderStatus(${provider.id}, this.value)" class="form-input">
                        <option value="">Update Status</option>
                        <option value="pending" ${provider.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="approved" ${provider.status === 'approved' ? 'selected' : ''}>Approved</option>
                        <option value="rejected" ${provider.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                        <option value="suspended" ${provider.status === 'suspended' ? 'selected' : ''}>Suspended</option>
                    </select>
                </td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    tabContent.innerHTML = html;
}

async function loadServices() {
    const response = await apiRequest('/admin/services');
    const tabContent = document.getElementById('adminTabContent');
    
    let html = `
        <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold mb-4">Services Management</h2>
            <div class="space-y-4">
    `;
    
    response.services.forEach(service => {
        html += `
            <div class="border rounded-lg p-4">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="text-lg font-semibold">${service.name}</h3>
                        <p class="text-sm text-gray-600">${service.category_name}</p>
                        <p class="text-sm mt-2">${service.description || 'No description'}</p>
                        <div class="mt-2">
                            <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">${service.target_audience}</span>
                            <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded ml-2">${service.service_type}</span>
                        </div>
                    </div>
                    <label class="flex items-center">
                        <input type="checkbox" ${service.is_active ? 'checked' : ''} 
                               onchange="toggleServiceActive(${service.id}, this.checked)" 
                               class="mr-2">
                        Active
                    </label>
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    tabContent.innerHTML = html;
}

async function loadPricing() {
    const response = await apiRequest('/admin/pricing');
    const tabContent = document.getElementById('adminTabContent');
    
    let html = `
        <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold mb-4">Pricing Management</h2>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Type</th>
                            <th>Mode</th>
                            <th>Duration</th>
                            <th>Price</th>
                            <th>Active</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    response.pricing.forEach(price => {
        html += `
            <tr>
                <td>${price.service_name}</td>
                <td>${price.pricing_type}</td>
                <td>${price.service_mode}</td>
                <td>${price.duration_type || 'N/A'}</td>
                <td>${formatCurrency(price.price)}</td>
                <td>${price.is_active ? '<span class="text-green-600">Yes</span>' : '<span class="text-red-600">No</span>'}</td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    tabContent.innerHTML = html;
}

async function loadContacts() {
    const response = await apiRequest('/admin/contacts');
    const tabContent = document.getElementById('adminTabContent');
    
    let html = `
        <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold mb-4">Contact Submissions</h2>
            <div class="space-y-4">
    `;
    
    response.contacts.forEach(contact => {
        html += `
            <div class="border rounded-lg p-4">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h3 class="text-lg font-semibold">${contact.name}</h3>
                        <p class="text-sm text-gray-600">${contact.email} ${contact.phone ? `• ${contact.phone}` : ''}</p>
                    </div>
                    ${getStatusBadge(contact.status)}
                </div>
                ${contact.subject ? `<p class="font-semibold mb-2">${contact.subject}</p>` : ''}
                <p class="text-gray-700 mb-3">${contact.message}</p>
                <div class="flex gap-2">
                    <button onclick="updateContactStatus(${contact.id}, 'read')" class="btn-secondary-sm">Mark as Read</button>
                    <button onclick="updateContactStatus(${contact.id}, 'responded')" class="btn-primary-sm">Mark as Responded</button>
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    tabContent.innerHTML = html;
}

// Action handlers
async function updateBookingStatus(bookingId, status) {
    if (!status) return;
    
    try {
        await apiRequest(`/admin/bookings/${bookingId}`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
        
        alert('Booking status updated successfully');
        loadBookings();
    } catch (error) {
        alert('Failed to update booking: ' + error.message);
    }
}

async function updateProviderStatus(providerId, status) {
    if (!status) return;
    
    try {
        await apiRequest(`/admin/providers/${providerId}`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
        
        alert('Provider status updated successfully');
        loadProviders();
    } catch (error) {
        alert('Failed to update provider: ' + error.message);
    }
}

async function toggleServiceActive(serviceId, isActive) {
    try {
        await apiRequest(`/admin/services/${serviceId}`, {
            method: 'PUT',
            body: JSON.stringify({ is_active: isActive ? 1 : 0 })
        });
        
        alert('Service status updated successfully');
    } catch (error) {
        alert('Failed to update service: ' + error.message);
        loadServices();
    }
}

async function updateContactStatus(contactId, status) {
    try {
        await apiRequest(`/admin/contacts/${contactId}`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
        
        alert('Contact status updated successfully');
        loadContacts();
    } catch (error) {
        alert('Failed to update contact: ' + error.message);
    }
}
