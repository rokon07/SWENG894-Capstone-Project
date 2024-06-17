document.addEventListener('DOMContentLoaded', (event) => {
    const registerForm = document.getElementById('form');
    const roleSelect = document.getElementById('role');
    const genderContainer = document.getElementById('gender-container');
    const raceContainer = document.getElementById('race-container');
    const errorElement = document.getElementById('error');
    const successElement = document.getElementById('success');

    // Show/hide gender and race based on role selection
    roleSelect.addEventListener('change', (event) => {
        if (event.target.value === 'voter') {
            genderContainer.style.display = 'block';
            raceContainer.style.display = 'block';
        } else {
            genderContainer.style.display = 'none';
            raceContainer.style.display = 'none';
        }
    });

    // Form submission
    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const phone = document.getElementById('phone').value;
        const fname = document.getElementById('fname').value;
        const lname = document.getElementById('lname').value;
        const dob = document.getElementById('dob').value;

        // Email validation: ensure email ends with .com
        if (!email.endsWith('.com')) {
            errorElement.style.display = 'block';
            errorElement.innerText = 'Email must end with .com.';
            return;
        }

        // Password validation: ensure no spaces are present
        if (/\s/.test(password)) {
            errorElement.style.display = 'block';
            errorElement.innerText = 'Password must not contain spaces.';
            return;
        }

        // Phone number validation: ensure it is exactly 10 digits
        if (!/^\d{10}$/.test(phone)) {
            errorElement.style.display = 'block';
            errorElement.innerText = 'Phone number must be exactly 10 digits.';
            return;
        }

        // First name and last name validation: ensure only alphabetic characters
        if (!/^[a-zA-Z]+$/.test(fname)) {
            errorElement.style.display = 'block';
            errorElement.innerText = 'First name must contain only alphabetic characters.';
            return;
        }

        if (!/^[a-zA-Z]+$/.test(lname)) {
            errorElement.style.display = 'block';
            errorElement.innerText = 'Last name must contain only alphabetic characters.';
            return;
        }

        // DOB validation: ensure the date is in the past and in a valid format
        const today = new Date();
        const birthDate = new Date(dob);
        if (birthDate > today || isNaN(birthDate.getTime())) {
            errorElement.style.display = 'block';
            errorElement.innerText = 'Date of birth must be a valid date in the past.';
            return;
        }

        // Set default values for gender and race if role is admin
        const role = document.getElementById('role').value;
        const gender = role === 'admin' ? 'unspecified' : document.getElementById('gender').value;
        const race = role === 'admin' ? 'unspecified' : document.getElementById('race').value;

        const register = {
            email: email,
            password: password,
            fname: fname,
            lname: lname,
            phone: phone,
            dob: dob,
            role: role,
            gender: gender,
            race: race
        };

        fetch("/api/register", {
            method: "POST",
            body: JSON.stringify(register),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => {
                if (data.status === "error") {
                    successElement.style.display = "none";
                    errorElement.style.display = "block";
                    errorElement.innerText = data.error;
                } else {
                    successElement.style.display = "block";
                    errorElement.style.display = "none";
                    successElement.innerText = data.success;
                }
            });
    });
});
