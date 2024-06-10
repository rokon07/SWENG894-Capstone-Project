document.addEventListener('DOMContentLoaded', (event) => {
    let candidateCount = 0;

    document.getElementById('addCandidate').addEventListener('click', () => {
        candidateCount++;
        const candidateDiv = document.createElement('div');
        candidateDiv.className = 'mb-3';
        candidateDiv.innerHTML = `
            <label for="candidate_${candidateCount}" class="form-label">Candidate ${candidateCount}</label>
            <input type="text" class="form-control" id="candidate_${candidateCount}" autocomplete="off" required>
        `;
        document.getElementById('candidates').appendChild(candidateDiv);
    });

    document.getElementById('form').addEventListener('submit', async function (event) {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const admin_email = window.location.search.slice(1);
        const deadline = document.getElementById('deadline').value;
        const age = document.getElementById('age').value;
        const candidates = [];

        for (let i = 1; i <= candidateCount; i++) {
            const candidate = document.getElementById(`candidate_${i}`).value;
            if (candidate) {
                candidates.push({ id: i, name: candidate });
            }
        }

        const response = await fetch('api/poll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, admin_email, deadline, age, candidates })
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
        }
    });
});
