document.addEventListener("DOMContentLoaded", function() {
    const btn = document.getElementById("btn-AI-search");

    btn.addEventListener("click", async function() {
        const prompt = document.getElementById("txtAIPrompt").value;
        sessionStorage.setItem("user_prompt", prompt); // Store prompt
        window.location.href = "/html/pages/ai_results.html"; // carries to ai_results page
    });
});
