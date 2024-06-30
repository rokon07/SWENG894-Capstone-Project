document.addEventListener('DOMContentLoaded', () => {
    const backgroundColors = [
        'rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'
    ];
    const borderColors = [
        'rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'
    ];

    try {
        const pollResults = JSON.parse(document.getElementById('pollResults').textContent);
        const timeSeriesData = JSON.parse(document.getElementById('timeSeriesData').textContent);
        const genderData = JSON.parse(document.getElementById('genderData').textContent);
        const raceData = JSON.parse(document.getElementById('raceData').textContent);

        const labels = pollResults.map(result => result.name);
        const data = pollResults.map(result => result.votes);

        const ctx = document.getElementById('pollChart').getContext('2d');
        const pollChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Votes',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        const timeLabels = timeSeriesData.map(result => new Date(result.vote_time).toLocaleString());
        const timeData = timeSeriesData.map(result => result.votes);

        const ctx2 = document.getElementById('timeSeriesChart').getContext('2d');
        const timeSeriesChart = new Chart(ctx2, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [{
                    label: 'Votes Over Time',
                    data: timeData,
                    fill: false,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'hour'
                        }
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        const genderLabels = Object.keys(genderData);
        const genderCounts = Object.values(genderData);

        const ctx3 = document.getElementById('genderChart').getContext('2d');
        const genderChart = new Chart(ctx3, {
            type: 'pie',
            data: {
                labels: genderLabels,
                datasets: [{
                    label: 'Gender Distribution',
                    data: genderCounts,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1
                }]
            }
        });

        const raceLabels = Object.keys(raceData);
        const raceCounts = Object.values(raceData);

        const ctx4 = document.getElementById('raceChart').getContext('2d');
        const raceChart = new Chart(ctx4, {
            type: 'pie',
            data: {
                labels: raceLabels,
                datasets: [{
                    label: 'Race Distribution',
                    data: raceCounts,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1
                }]
            }
        });

    } catch (error) {
        console.error('Error parsing JSON data:', error);
    }

    window.showPollTable = function showPollTable() {
        const pollTableContainer = document.getElementById('pollTableContainer');
        pollTableContainer.style.display = pollTableContainer.style.display === 'none' ? 'block' : 'none';
    }

    window.downloadPollData = function downloadPollData() {
        const table = document.getElementById('pollTable');
        const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
        XLSX.writeFile(wb, 'poll_data.xlsx');
    }
});
