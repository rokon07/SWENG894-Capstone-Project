document.addEventListener('DOMContentLoaded', (event) => {
    let candidateCount = 0;

    document.getElementById('addCandidate').addEventListener('click', () => {
        candidateCount++;
        const candidateDiv = document.createElement('div');
        candidateDiv.className = 'mb-3 candidate-div';
        candidateDiv.id = `candidateDiv_${candidateCount}`;
        candidateDiv.innerHTML = `
            <label for="candidate_${candidateCount}" class="form-label">Option ${candidateCount}</label>
            <input type="text" class="form-control" id="candidate_${candidateCount}" autocomplete="off" placeholder="Enter poll candidate name ..." required>
            <button type="button" class="btn btn-danger mt-2" onclick="removeCandidate(${candidateCount})">Remove Option &nbsp; <i class='fas fa-times' style='font-size:16px'></i></button>
        `;
        document.getElementById('candidates').appendChild(candidateDiv);
    });

    document.getElementById('form').addEventListener('submit', async function (event) {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const admin_email = window.location.search.slice(1);
        const deadline = document.getElementById('deadline').value;
        const age = document.getElementById('age').value;
        const polltype = document.getElementById('polltype').value;
        const enableAnonymous = document.getElementById('enableAnonymous').checked;
        const candidates = [];

        // Validate deadline
        const now = new Date();
        const deadlineDate = new Date(deadline);
        if (isNaN(deadlineDate.getTime()) || deadlineDate <= now) {
            showError('Deadline must be a valid future date and time!');
            return;
        }

        // Validate age requirement
        const ageRequirementDate = new Date(age);
        if (isNaN(ageRequirementDate.getTime()) || ageRequirementDate >= now) {
            showError('Age requirement must be a valid date in the past!');
            return;
        }

        for (let i = 1; i <= candidateCount; i++) {
            const candidate = document.getElementById(`candidate_${i}`);
            if (candidate && candidate.value) {
                candidates.push(candidate.value);
            }
        }

        // Ensure there are at least 2 candidates
        if (candidates.length < 2) {
            showError('Please add at least two options.');
            return;
        }

        const response = await fetch('/api/poll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, admin_email, deadline, age, polltype, enableAnonymous, candidates })
        });

        const result = await response.json();

        if (result.status === 'error') {
            showError(result.error);
        } else {
            showSuccess(result.success);
            setTimeout(() => {
                window.location.href = result.redirectUrl;
            }, 1000);
        }
    });

    function showError(message) {
        const errorElement = document.getElementById('error');
        const successElement = document.getElementById('success');
        errorElement.style.display = 'block';
        successElement.style.display = 'none';
        errorElement.innerHTML = message;
    }

    function showSuccess(message) {
        const errorElement = document.getElementById('error');
        const successElement = document.getElementById('success');
        errorElement.style.display = 'none';
        successElement.style.display = 'block';
        successElement.innerHTML = message;
    }
});

function removeCandidate(id) {
    const candidateDiv = document.getElementById(`candidateDiv_${id}`);
    if (candidateDiv) {
        candidateDiv.remove();
    }
}

function toggle_visibility(id) {
    var e = document.getElementById(id);
    if (e.style.display == 'block')
        e.style.display = 'none';
    else
        e.style.display = 'block';
}
