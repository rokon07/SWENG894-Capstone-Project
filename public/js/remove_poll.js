document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('remove_poll').addEventListener('submit', async (event) => {
        event.preventDefault();

        const pollSelect = document.getElementById('pollSelect');
        const pollId = pollSelect.value;

        const response = await fetch(`/api/remove_poll`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pollId })
        });

        const result = await response.json();
        const errorElement = document.getElementById('error');
        const successElement = document.getElementById('success');

        if (result.status === 'error') {
            errorElement.style.display = 'block';
            successElement.style.display = 'none';
            errorElement.textContent = result.error;
        } else {
            errorElement.style.display = 'none';
            successElement.style.display = 'block';
            successElement.textContent = result.success;
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    });
});
