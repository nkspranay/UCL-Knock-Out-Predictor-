document.addEventListener("DOMContentLoaded", () => {

    // UCL INTRO ANIMATION FLOW
    setTimeout(() => {
        const introSection = document.getElementById("intro");
        const dashboardSection = document.getElementById("dashboard");

        introSection.style.opacity = "0";
        introSection.style.visibility = "hidden";

        setTimeout(() => {
            dashboardSection.classList.remove("hidden");
            introSection.style.display = "none";
        }, 1500);

    }, 3000);
    // Show Intro for 3 seconds then fade out
});
