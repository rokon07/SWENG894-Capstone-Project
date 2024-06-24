document.addEventListener('DOMContentLoaded', () => {
    function showPollCodeInput(pollId) {
        // Create poll code input form
        const pollCodeForm = `
            <form id="pollCodeForm">
                <label for="pollCodeInput">Enter Poll Code</label>
                <input type="text" class="form-control" id="pollCodeInput" placeholder="Enter 6-digit code" required>
                <input type="hidden" id="pollId" value="${pollId}">
                <button type="submit" class="btn btn-success mt-2" style="width: 100%;">Submit Code <i class="fa fa-unlock" style="font-size:18px"></i></button>
                <button type="button" class="btn btn-secondary mt-2" style="width: 100%;" onclick="hidePollCodeForm()">View poll details <i class="fa fa-info-circle" style="font-size:18px"></i></button>
            </form>
        `;

        // Find the card body
        const cardBody = document.querySelector(`[data-poll-id="${pollId}"] .card-body`);
        if (cardBody) {
            cardBody.innerHTML = pollCodeForm;

            // Add event listener to the form
            document.getElementById('pollCodeForm').addEventListener('submit', function (event) {
                event.preventDefault();
                verifyPollCode();
            });
        } else {
            console.error(`Card body not found for poll ID ${pollId}`);
        }
    }

    async function verifyPollCode() {
        const pollId = document.getElementById('pollId').value;
        const pollCode = document.getElementById('pollCodeInput').value.trim();

        try {
            const response = await fetch('/api/verify_poll_code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ pollId, pollCode })
            });
            const data = await response.json();

            if (data.status === 'success') {
                window.location.href = `/vote?pollId=${pollId}&userId=${userId}&userEmail=${userEmail}`;
            } else {
                alert('Invalid poll code.');
            }
        } catch (error) {
            console.error('Error verifying poll code:', error);
            alert('An error occurred while verifying the poll code.');
        }
    }


    window.showPollCodeInput = showPollCodeInput;
});
