// Merge Sort Algorithm
function mergeSort(arr, comparator) {
    if (arr.length <= 1) return arr;

    const middle = Math.floor(arr.length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);

    return merge(mergeSort(left, comparator), mergeSort(right, comparator), comparator);
}

function merge(left, right, comparator) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        if (comparator(left[leftIndex], right[rightIndex]) <= 0) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

// Search functionality
document.getElementById('searchInput').addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const polls = document.querySelectorAll('.poll-item');

    polls.forEach(poll => {
        const title = poll.querySelector('.poll-title').innerText.toLowerCase();
        if (title.includes(searchTerm)) {
            poll.style.display = '';
        } else {
            poll.style.display = 'none';
        }
    });
});

// Sorting functionality
document.getElementById('sortOptions').addEventListener('change', function () {
    const sortOption = this.value;
    const pollsContainer = document.getElementById('pollsContainer');
    const polls = Array.from(pollsContainer.getElementsByClassName('col'));

    const comparator = (a, b) => {
        const pollA = a.querySelector('.poll-title').innerText;
        const pollB = b.querySelector('.poll-title').innerText;
        const deadlineA = new Date(a.querySelector('p:nth-of-type(1)').innerText);
        const deadlineB = new Date(b.querySelector('p:nth-of-type(1)').innerText);

        if (sortOption === 'nameAsc') {
            return pollA.localeCompare(pollB);
        } else if (sortOption === 'nameDesc') {
            return pollB.localeCompare(pollA);
        } else if (sortOption === 'deadlineAsc') {
            return deadlineA - deadlineB;
        } else if (sortOption === 'deadlineDesc') {
            return deadlineB - deadlineA;
        }
    };

    const sortedPolls = mergeSort(polls, comparator);
    sortedPolls.forEach(poll => pollsContainer.appendChild(poll));
});
