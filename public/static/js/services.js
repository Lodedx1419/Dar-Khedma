// Services page functionality

document.addEventListener('DOMContentLoaded', async function() {
    const audienceTabs = document.querySelectorAll('.audience-tab');
    let currentAudience = 'individual';
    
    // Tab switching
    audienceTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            currentAudience = this.dataset.audience;
            audienceTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            loadServices(currentAudience);
        });
    });
    
    // Load initial services
    await loadServices(currentAudience);
});

async function loadServices(audience) {
    const servicesLoading = document.getElementById('servicesLoading');
    const servicesContent = document.getElementById('servicesContent');
    
    try {
        showLoading('servicesLoading');
        servicesContent.classList.add('hidden');
        
        const response = await apiRequest(`/services/grouped/by-category?audience=${audience}`);
        
        hideLoading('servicesLoading');
        servicesContent.classList.remove('hidden');
        
        displayServices(response.categories);
    } catch (error) {
        hideLoading('servicesLoading');
        servicesContent.innerHTML = '<p class="text-center text-red-600">Failed to load services</p>';
        servicesContent.classList.remove('hidden');
    }
}

function displayServices(categories) {
    const servicesContent = document.getElementById('servicesContent');
    
    if (categories.length === 0) {
        servicesContent.innerHTML = '<p class="text-center text-gray-600">No services available</p>';
        return;
    }
    
    let html = '';
    
    categories.forEach(category => {
        html += `
            <div class="category-section">
                <div class="category-header">
                    <i class="${category.icon || 'fas fa-cube'} category-icon"></i>
                    <h2 class="category-title">${category.name}</h2>
                </div>
                <div class="space-y-4">
        `;
        
        category.services.forEach(service => {
            html += `
                <div class="service-detail-card">
                    <h3 class="service-name">${service.name}</h3>
                    ${service.description ? `<p class="service-description">${service.description}</p>` : ''}
                    <div class="flex flex-wrap gap-2 mt-2">
                        ${service.service_type === 'both' || service.service_type === 'visit' ? 
                            '<span class="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Visit-Based</span>' : ''}
                        ${service.service_type === 'both' || service.service_type === 'contract' ? 
                            '<span class="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Contract-Based</span>' : ''}
                    </div>
                    ${isAuthenticated() ? `
                        <button onclick="bookService(${service.id})" class="btn-primary mt-4">
                            Book Now
                        </button>
                    ` : `
                        <a href="/auth" class="btn-primary mt-4 inline-block">
                            Sign in to Book
                        </a>
                    `}
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    servicesContent.innerHTML = html;
}

function bookService(serviceId) {
    // Store service ID and redirect to dashboard for booking
    localStorage.setItem('booking_service_id', serviceId);
    window.location.href = '/dashboard';
}
