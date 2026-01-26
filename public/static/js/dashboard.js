// User Dashboard functionality

document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    if (!isAuthenticated()) {
        document.getElementById('dashboardAuth').classList.remove('hidden');
        return;
    }
    
    const user = getUserInfo();
    if (user.role === 'admin') {
        window.location.href = '/admin';
        return;
    }
    
    document.getElementById('dashboardContent').classList.remove('hidden');
    
    // Load user info
    await loadUserInfo();
    
    // Load bookings
    await loadBookings();
    
    // Setup filter buttons
    setupFilterButtons();
});

async function loadUserInfo() {
    try {
        const response = await apiRequest('/auth/me');
        const user = response;
        
        document.getElementById('userName').textContent = user.full_name;
        
        const userInfoHtml = `
            <div><strong>Email:</strong> ${user.email}</div>
            <div><strong>Phone:</strong> ${user.phone || 'N/A'}</div>
            <div><strong>Account Type:</strong> ${user.account_type === 'business' ? 'Business' : 'Individual'}</div>
            <div><strong>City:</strong> ${user.city || 'N/A'}</div>
            ${user.business_name ? `<div><strong>Business:</strong> ${user.business_name}</div>` : ''}
        `;
        
        document.getElementById('userInfo').innerHTML = userInfoHtml;
    } catch (error) {
        console.error('Failed to load user info:', error);
    }
}

async function loadBookings(status = 'all') {
    const bookingsLoading = document.getElementById('bookingsLoading');
    const bookingsList = document.getElementById('bookingsList');
    const bookingsEmpty = document.getElementById('bookingsEmpty');
    
    try {
        showLoading('bookingsLoading');
        bookingsList.classList.add('hidden');
        bookingsEmpty.classList.add('hidden');
        
        let url = '/bookings';
        if (status !== 'all') {
            url += `?status=${status}`;
        }
        
        const response = await apiRequest(url);
        
        hideLoading('bookingsLoading');
        
        if (response.bookings.length === 0) {
            bookingsEmpty.classList.remove('hidden');
        } else {
            displayBookings(response.bookings);
            bookingsList.classList.remove('hidden');
        }
    } catch (error) {
        hideLoading('bookingsLoading');
        bookingsList.innerHTML = '<p class="text-center text-red-600">Failed to load bookings</p>';
        bookingsList.classList.remove('hidden');
    }
}

function displayBookings(bookings) {
    const bookingsList = document.getElementById('bookingsList');
    
    let html = '';
    bookings.forEach(booking => {
        html += `
            <div class="booking-card">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h3 class="text-lg font-semibold">${booking.service_name}</h3>
                        <p class="text-sm text-gray-600">${booking.category_name}</p>
                    </div>
                    ${getStatusBadge(booking.status)}
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                    <div><strong>Type:</strong> ${booking.booking_type.charAt(0).toUpperCase() + booking.booking_type.slice(1)}</div>
                    <div><strong>Mode:</strong> ${booking.service_mode === 'resident' ? 'Resident' : 'Non-Resident'}</div>
                    <div><strong>Start Date:</strong> ${formatDate(booking.start_date)}</div>
                    <div><strong>Price:</strong> ${formatCurrency(booking.total_price)}</div>
                    ${booking.provider_name ? `<div><strong>Provider:</strong> ${booking.provider_name}</div>` : ''}
                    ${booking.provider_phone ? `<div><strong>Contact:</strong> ${booking.provider_phone}</div>` : ''}
                </div>
                <div class="text-sm text-gray-600 mb-3">
                    <strong>Service Address:</strong> ${booking.service_address}
                </div>
                ${booking.status !== 'cancelled' && booking.status !== 'completed' ? `
                    <button onclick="cancelBooking(${booking.id})" class="btn-secondary-sm text-red-600 border-red-600">
                        Cancel Booking
                    </button>
                ` : ''}
            </div>
        `;
    });
    
    bookingsList.innerHTML = html;
}

function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const status = this.dataset.status;
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            loadBookings(status);
        });
    });
}

async function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }
    
    try {
        await apiRequest(`/bookings/${bookingId}/cancel`, {
            method: 'PUT'
        });
        
        alert('Booking cancelled successfully');
        loadBookings();
    } catch (error) {
        alert('Failed to cancel booking: ' + error.message);
    }
}

function showBookingModal() {
    alert('Booking modal coming soon! Please visit the Services page to book a service.');
    window.location.href = '/services';
}
