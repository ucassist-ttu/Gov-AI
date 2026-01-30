document.addEventListener("DOMContentLoaded", function() {
    const btn = document.getElementById("btn-AI-search");

    btn.addEventListener("click", async function() {
        const prompt = document.getElementById("txtAIPrompt").value;
        sessionStorage.setItem("user_prompt", prompt); // Stores prompt
        window.location.href = "/html/pages/ai_results.html"; // carries to ai_results page
    });
});

//SIDE BAR AI
// Opens the filter side bar
document.querySelector("#btn-AI-search").addEventListener("click", () => {
    document.getElementById("mySidenav").style.width = "375px";
    overlay.classList.add("active");
});

// Closes the filter side bar
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  overlay.classList.remove("active");
}

// Closes the filter when the overlay is clicked
overlay.addEventListener("click", () => {
  document.getElementById("mySidenav").style.width = "0";
  overlay.classList.remove("active");
})
