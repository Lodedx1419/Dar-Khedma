// Authentication utilities

const API_BASE_URL = window.location.origin + '/api';

// Get token from localStorage
function getToken() {
    return localStorage.getItem('auth_token');
}

// Set token in localStorage
function setToken(token) {
    localStorage.setItem('auth_token', token);
}

// Remove token from localStorage
function removeToken() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
}

// Get user info from localStorage
function getUserInfo() {
    const userJson = localStorage.getItem('user_info');
    return userJson ? JSON.parse(userJson) : null;
}

// Set user info in localStorage
function setUserInfo(user) {
    localStorage.setItem('user_info', JSON.stringify(user));
}

// Check if user is authenticated
function isAuthenticated() {
    return !!getToken();
}

// Check if user is admin
function isAdmin() {
    const user = getUserInfo();
    return user && user.role === 'admin';
}

// Logout user
function logout() {
    removeToken();
    window.location.href = '/';
}

// Update navigation based on authentication status
function updateNavigation() {
    const authBtn = document.getElementById('authBtn');
    const authBtnMobile = document.getElementById('authBtnMobile');
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutBtnMobile = document.getElementById('logoutBtnMobile');
    const dashboardBtn = document.getElementById('dashboardBtn');
    const dashboardBtnMobile = document.getElementById('dashboardBtnMobile');
    
    if (isAuthenticated()) {
        const user = getUserInfo();
        
        // Hide auth buttons
        if (authBtn) authBtn.style.display = 'none';
        if (authBtnMobile) authBtnMobile.style.display = 'none';
        
        // Show logout buttons
        if (logoutBtn) {
            logoutBtn.style.display = 'inline-block';
            logoutBtn.onclick = logout;
        }
        if (logoutBtnMobile) {
            logoutBtnMobile.style.display = 'block';
            logoutBtnMobile.onclick = logout;
        }
        
        // Show dashboard button
        if (dashboardBtn) {
            dashboardBtn.style.display = 'inline-block';
            dashboardBtn.href = user.role === 'admin' ? '/admin' : '/dashboard';
            dashboardBtn.textContent = user.role === 'admin' ? 'Admin' : 'Dashboard';
        }
        if (dashboardBtnMobile) {
            dashboardBtnMobile.style.display = 'block';
            dashboardBtnMobile.href = user.role === 'admin' ? '/admin' : '/dashboard';
            dashboardBtnMobile.textContent = user.role === 'admin' ? 'Admin' : 'Dashboard';
        }
    } else {
        // Show auth buttons
        if (authBtn) authBtn.style.display = 'inline-block';
        if (authBtnMobile) authBtnMobile.style.display = 'block';
        
        // Hide logout and dashboard buttons
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (logoutBtnMobile) logoutBtnMobile.style.display = 'none';
        if (dashboardBtn) dashboardBtn.style.display = 'none';
        if (dashboardBtnMobile) dashboardBtnMobile.style.display = 'none';
    }
}

// Make authenticated API request
async function apiRequest(url, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(API_BASE_URL + url, {
            ...options,
            headers
        });
        
        if (response.status === 401) {
            // Token expired or invalid
            removeToken();
            if (window.location.pathname !== '/auth' && window.location.pathname !== '/') {
                window.location.href = '/auth';
            }
            throw new Error('Unauthorized');
        }
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
});
