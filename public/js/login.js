document.getElementById('form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    const errorElement = document.getElementById('error');
    const successElement = document.getElementById('success');

    if (result.status === 'error') {
        errorElement.style.display = 'block';
        successElement.style.display = 'none';
        errorElement.innerHTML = result.error;
    } else {
        errorElement.style.display = 'none';
        successElement.style.display = 'block';
        successElement.innerHTML = result.success;
        // Redirect to the appropriate page based on the role
        setTimeout(() => {
            window.location.href = result.redirectUrl;
        }, 1000);
    }
});
