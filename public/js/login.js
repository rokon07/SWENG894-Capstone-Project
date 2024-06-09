form.addEventListener("submit", () => {
    const login = {
        email: email.value,
        password: password.value
    }
    fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(login),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.json())
        .then(data => {
            if (data.status == "error") {
                success.style.display = "none"
                error.style.display = "block"
                error.innerText = data.error
            }
            else {
                success.style.display = "block"
                error.style.display = "none"
                error.innerText = data.success
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            }
        })
})