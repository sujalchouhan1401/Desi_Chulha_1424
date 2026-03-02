document.addEventListener("DOMContentLoaded", () => {
    // Logout Logic
    const logoutBtn = document.getElementById("logout-btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            // Show loading state
            const origText = logoutBtn.innerHTML;
            logoutBtn.innerHTML = "Logging out...";
            logoutBtn.style.opacity = 0.8;

            // Remove token/auth state here in a real app
            // localStorage.removeItem("desi_auth");

            setTimeout(() => {
                // Redirect back to login page
                window.location.href = "index.html";
            }, 600);
        });
    }
});
