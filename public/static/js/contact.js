// Contact form functionality

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };
            
            try {
                const response = await apiRequest('/contact', {
                    method: 'POST',
                    body: JSON.stringify(data)
                });
                
                if (response.success) {
                    showMessage('contactMessage', response.message, 'success');
                    contactForm.reset();
                }
            } catch (error) {
                showMessage('contactMessage', error.message, 'error');
            }
        });
    }
});
