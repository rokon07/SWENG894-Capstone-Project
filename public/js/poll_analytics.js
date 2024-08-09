document.addEventListener('DOMContentLoaded', () => {
    const colors_list = [
        '#faa356', '#7ce38b', '#a2d2fb', '#fa7970', '#77bdfb', '#cea5fb', '#c6cdd5', '#FF204E', '#78A083'
    ];

    try {
        const pollResults = JSON.parse(document.getElementById('pollResults').textContent);
        const timeSeriesData = JSON.parse(document.getElementById('timeSeriesData').textContent);
        const genderData = JSON.parse(document.getElementById('genderData').textContent);
        const raceData = JSON.parse(document.getElementById('raceData').textContent);
        const ageGroupData = JSON.parse(document.getElementById('ageGroupData').textContent);
        const raceCandidateVotesData = JSON.parse(document.getElementById('raceCandidateVotesData').textContent);

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
                    backgroundColor: colors_list,
                    hoverOffset: 4
                }]
            },
            options: {
                scales: {
                    y: {
                        grid: {
                            color: "#161b22"
                        },
                        ticks: {
                            color: "#89929b"
                        },
                        title: {
                            display: true,
                            text: 'Votes',
                            color: '#ecf2f8',
                            font: {
                                size: 14
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: "#161b22"
                        },
                        ticks: {
                            color: "#89929b"
                        },
                        title: {
                            display: true,
                            text: 'Candidates',
                            color: '#ecf2f8',
                            font: {
                                size: 14
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false,
                    },
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
                    backgroundColor: colors_list,
                    borderWidth: 0,
                    fontColor: "#161b22"
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'left',
                    },
                },

            },
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
                    backgroundColor: colors_list,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        "labels": {
                            "fontSize": 12,
                        }
                    },
                },
            },
        });

        const ageGroupLabels = Object.keys(ageGroupData);
        const ageGroupCounts = Object.values(ageGroupData);

        const ctx5 = document.getElementById('ageGroupChart').getContext('2d');
        const ageGroupChart = new Chart(ctx5, {
            type: 'bar',
            data: {
                labels: ageGroupLabels,
                datasets: [{
                    label: 'Age Group Distribution',
                    data: ageGroupCounts,
                    backgroundColor: colors_list,
                }]
            },
            options: {
                scales: {
                    y: {
                        grid: {
                            color: "#161b22"
                        },
                        ticks: {
                            color: "#89929b"
                        },
                        title: {
                            display: true,
                            text: 'Votes',
                            color: '#ecf2f8',
                            font: {
                                size: 14
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: "#161b22"
                        },
                        ticks: {
                            color: "#89929b"
                        },
                        title: {
                            display: true,
                            text: 'Age Group',
                            color: '#ecf2f8',
                            font: {
                                size: 14
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                }
            }
        });

        const raceCandidateLabels = Object.keys(raceCandidateVotesData);
        const datasets = pollResults.map((candidate, index) => {
            const candidateData = raceCandidateLabels.map(race => raceCandidateVotesData[race][candidate.id] || 0);
            return {
                label: candidate.name,
                data: candidateData,
                backgroundColor: colors_list[index % colors_list.length],
            };
        });

        const ctx6 = document.getElementById('raceCandidateChart').getContext('2d');
        const raceCandidateChart = new Chart(ctx6, {
            type: 'bar',
            data: {
                labels: raceCandidateLabels,
                datasets: datasets
            },
            options: {
                indexAxis: 'y',

                scales: {
                    y: {
                        grid: {
                            color: "#161b22"
                        },
                        ticks: {
                            callback: function (value, index, values) {
                                if ((this.getLabelForValue(index)) == "Black or African American") {
                                    return "Black"
                                }
                                else if((this.getLabelForValue(index)) == "Hispanic or Latino") {
                                    return "Hispanic"
                                }
                                else if ((this.getLabelForValue(index)) == "Native Hawaiian or Other Pacific Islander") {
                                    return "Native/Islander"
                                }
                                else {
                                    return this.getLabelForValue(index)
                                }
                            },
                            color: "#89929b",
                            font: {
                                size: 10,
                            }
                        },
                        title: {
                            display: true,
                            text: 'Race/Ethnicity',
                            color: '#ecf2f8',
                            font: {
                                size: 14,
                            }
                        }
                    },
                    x: {
                        beginAtZero: true,
                        grid: {
                            color: "#161b22"
                        },
                        ticks: {
                            color: "#89929b"
                        },
                        title: {
                            display: true,
                            text: 'Votes',
                            color: '#ecf2f8',
                            font: {
                                size: 14
                            }
                        }
                    }
                }
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
