
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');

    form.addEventListener('submit', (event) => {
        event.preventDefault(); 
        const formData = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            successMessage.style.display = 'block';
            successMessage.textContent = "Your message was submitted successfully!";
            form.reset(); 
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
    });
});
