// Auth page functionality

// Handle tab switching
document.addEventListener('DOMContentLoaded', function() {
    const authTabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabType = this.dataset.tab;
            
            // Update active tab
            authTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide forms
            if (tabType === 'login') {
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
            } else {
                loginForm.classList.add('hidden');
                registerForm.classList.remove('hidden');
            }
        });
    });
});

// Handle account type change
function handleAccountTypeChange(event) {
    const businessFields = document.getElementById('businessFields');
    const businessNameInput = document.querySelector('input[name="business_name"]');
    
    if (event.target.value === 'business') {
        businessFields.classList.remove('hidden');
        businessNameInput.setAttribute('required', 'required');
    } else {
        businessFields.classList.add('hidden');
        businessNameInput.removeAttribute('required');
    }
}

// Handle login
async function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    try {
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        if (response.success) {
            setToken(response.token);
            setUserInfo(response.user);
            
            // Redirect based on role
            if (response.user.role === 'admin') {
                window.location.href = '/admin';
            } else {
                window.location.href = '/dashboard';
            }
        }
    } catch (error) {
        showMessage('loginMessage', error.message, 'error');
    }
}

// Handle registration
async function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
        full_name: formData.get('full_name'),
        phone: formData.get('phone'),
        account_type: formData.get('account_type'),
        address: formData.get('address'),
        city: formData.get('city')
    };
    
    // Add business fields if business account
    if (data.account_type === 'business') {
        data.business_name = formData.get('business_name');
        data.business_registration = formData.get('business_registration');
    }
    
    try {
        const response = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        if (response.success) {
            setToken(response.token);
            setUserInfo(response.user);
            
            // Redirect to dashboard
            window.location.href = '/dashboard';
        }
    } catch (error) {
        showMessage('registerMessage', error.message, 'error');
    }
}
