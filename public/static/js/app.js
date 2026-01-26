// Main application JavaScript

// Show message in element
function showMessage(elementId, message, type = 'success') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.classList.remove('hidden', 'alert-success', 'alert-error', 'alert-info');
    element.classList.add('alert', `alert-${type}`);
    element.textContent = message;
    element.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        element.classList.add('hidden');
    }, 5000);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format currency
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

// Get status badge HTML
function getStatusBadge(status) {
    const statusClasses = {
        'pending': 'status-pending',
        'confirmed': 'status-confirmed',
        'in_progress': 'status-in_progress',
        'completed': 'status-completed',
        'cancelled': 'status-cancelled',
        'approved': 'status-confirmed',
        'rejected': 'status-cancelled',
        'suspended': 'status-cancelled',
        'new': 'status-pending',
        'read': 'status-confirmed',
        'responded': 'status-completed'
    };
    
    const statusLabels = {
        'pending': 'Pending',
        'confirmed': 'Confirmed',
        'in_progress': 'In Progress',
        'completed': 'Completed',
        'cancelled': 'Cancelled',
        'approved': 'Approved',
        'rejected': 'Rejected',
        'suspended': 'Suspended',
        'new': 'New',
        'read': 'Read',
        'responded': 'Responded'
    };
    
    const className = statusClasses[status] || 'status-pending';
    const label = statusLabels[status] || status;
    
    return `<span class="status-badge ${className}">${label}</span>`;
}

// Loading state
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('hidden');
    }
}

function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('hidden');
    }
}
