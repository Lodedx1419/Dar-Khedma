// Join Us page functionality

document.addEventListener('DOMContentLoaded', function() {
    const providerForm = document.getElementById('providerForm');
    
    if (providerForm) {
        providerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(providerForm);
            
            // Collect skills
            const skills = [];
            const skillCheckboxes = providerForm.querySelectorAll('input[name="skills"]:checked');
            skillCheckboxes.forEach(checkbox => skills.push(checkbox.value));
            
            if (skills.length === 0) {
                showMessage('providerMessage', 'Please select at least one skill', 'error');
                return;
            }
            
            // Collect availability days
            const days = [];
            const dayCheckboxes = providerForm.querySelectorAll('input[name="days"]:checked');
            dayCheckboxes.forEach(checkbox => days.push(checkbox.value));
            
            const data = {
                full_name: formData.get('full_name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                city: formData.get('city'),
                date_of_birth: formData.get('date_of_birth'),
                national_id: formData.get('national_id'),
                skills: skills,
                experience_years: formData.get('experience_years') ? parseInt(formData.get('experience_years')) : null,
                availability: {
                    days: days,
                    hours: formData.get('hours')
                }
            };
            
            try {
                const response = await apiRequest('/providers/apply', {
                    method: 'POST',
                    body: JSON.stringify(data)
                });
                
                if (response.success) {
                    showMessage('providerMessage', response.message, 'success');
                    providerForm.reset();
                }
            } catch (error) {
                showMessage('providerMessage', error.message, 'error');
            }
        });
    }
});
