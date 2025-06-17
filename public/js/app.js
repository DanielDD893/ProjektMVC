document.addEventListener('DOMContentLoaded', function() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            if (alert && alert.classList.contains('show')) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, 5000);
    });

    const intensitySlider = document.getElementById('intensity');
    const intensityValue = document.getElementById('intensityValue');
    
    if (intensitySlider && intensityValue) {
        intensitySlider.addEventListener('input', function() {
            intensityValue.textContent = this.value;
            
            intensityValue.className = 'badge';
            if (this.value <= 3) {
                intensityValue.classList.add('bg-success');
            } else if (this.value <= 7) {
                intensityValue.classList.add('bg-warning');
            } else {
                intensityValue.classList.add('bg-danger');
            }
        });
    }

    const forms = document.querySelectorAll('form[method="POST"]');
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            console.log('🚀 [JS DEBUG] Form submit triggered!');
            
            if (!form.checkValidity()) {
                console.log('⚠️ [JS DEBUG] Form has validation issues, but allowing submit anyway');
                
                const invalidFields = form.querySelectorAll(':invalid');
                invalidFields.forEach(field => {
                    console.log(`⚠️ [JS DEBUG] Field "${field.name}" might have issue: ${field.validationMessage}`);
                });
            } else {
                console.log('✅ [JS DEBUG] Form validation passed');
            }
            
            form.classList.add('was-validated');
        });
    });

    const deleteButtons = document.querySelectorAll('button[onclick*="confirm"]');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            if (!confirm('Czy na pewno chcesz usunąć ten trening?')) {
                event.preventDefault();
            }
        });
    });

    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    const dateInput = document.getElementById('date');
    if (dateInput && !dateInput.value) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }

    const trainingsForm = document.querySelector('form[action="/trainings"]');
    if (trainingsForm) {
        const inputs = trainingsForm.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            const savedValue = localStorage.getItem(`form_${input.name}`);
            if (savedValue && !input.value) {
                input.value = savedValue;
            }
        });
        
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                localStorage.setItem(`form_${input.name}`, input.value);
            });
        });
        
        trainingsForm.addEventListener('submit', function() {
            inputs.forEach(input => {
                localStorage.removeItem(`form_${input.name}`);
            });
        });
    }
}); 