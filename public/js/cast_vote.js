document.addEventListener('DOMContentLoaded', (event) => {
    const urlParams = new URLSearchParams(window.location.search);
    const pollId = urlParams.get('pollId');
    const userId = urlParams.get('userId');
    const userEmail = urlParams.get('userEmail');
    const pollTitleElement = document.getElementById('pollTitle');
    const pollDetailsElement = document.getElementById('pollDetails');
    const candidatesContainer = document.getElementById('candidatesContainer');
    const candidatesDiv = document.getElementById('candidates');
    const voteForm = document.getElementById('voteForm');
    document.getElementById('pollId').value = pollId;
    document.getElementById('userId').value = userId;
    document.getElementById('userEmail').value = userEmail;

    fetch(`/polls/${pollId}`)
        .then(response => response.json())
        .then(data => {
            const poll = data.poll;
            pollTitleElement.textContent = poll.title;
            pollDetailsElement.innerHTML = `
                Deadline Date: <a style="color: #89929b">${new Date(poll.deadline).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: '2-digit', year: 'numeric' })}</a><br>
                Time: <a style="color: #89929b">${new Date(poll.deadline).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'long' })}</a><br>
                Age Requirement: <a style="color: #89929b">${calculateAgeRequirement(poll.age_requirement)} years</a>
            `;
            fetch(`/polls/${pollId}/candidates`)
                .then(response => response.json())
                .then(data => {
                    data.candidates.forEach(candidate => {
                        const candidateOption = document.createElement('div');
                        candidateOption.className = 'form-check';
                        candidateOption.innerHTML = `
                            <input class="form-check-input" type="radio" name="candidate" id="candidate_${candidate.id}" value="${candidate.id}" data-candidate-name="${candidate.name}">
                            <label class="form-check-label" for="candidate_${candidate.id}">${candidate.name}</label>
                        `;
                        candidatesDiv.appendChild(candidateOption);
                    });
                });
        });

    function calculateAgeRequirement(birthdate) {
        const dob = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    }

    voteForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const selectedCandidate = document.querySelector('input[name="candidate"]:checked');
        if (!selectedCandidate) {
            showError('Please select a candidate.');
            return;
        }

        const candidateId = selectedCandidate.value;
        const candidateName = selectedCandidate.getAttribute('data-candidate-name');

        fetch('/vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pollId, candidateId, candidateName, userId, userEmail })
        })
            .then(response => response.json())
            .then(data => {
                const errorElement = document.getElementById('error');
                const successElement = document.getElementById('success');

                if (data.status === 'error') {
                    errorElement.style.display = 'block';
                    successElement.style.display = 'none';
                    errorElement.textContent = data.error;
                    setTimeout(() => {
                        window.location.href = data.redirectUrl;
                    }, 1500);
                } else {
                    errorElement.style.display = 'none';
                    successElement.style.display = 'block';
                    successElement.textContent = data.success;
                    setTimeout(() => {
                        window.location.href = data.redirectUrl;
                    }, 1500);
                }
            });
    });

    function showError(message) {
        const errorElement = document.getElementById('error');
        const successElement = document.getElementById('success');
        errorElement.style.display = 'block';
        successElement.style.display = 'none';
        errorElement.textContent = message;
    }
});
