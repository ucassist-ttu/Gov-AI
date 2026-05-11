document.addEventListener("DOMContentLoaded", () => { // waits for the DOM to load before running the script

  // MAIN AI SEARCH FUNCTION
  async function runAISearch(e) {
    e.preventDefault();

    const input = document.getElementById("txtAIPrompt");
    const prompt = input.value.trim();

    if (prompt.length < 1) {
      Swal.fire({
        title: "Uh Oh!",
        text: "Please enter a search prompt.",
        icon: "error"
      });
      return;
    }

    sessionStorage.setItem("user_prompt", prompt);
    window.location.href = "html/pages/ai_results.html";
  }

  // CLICK EVENT
  document.addEventListener("click", async function (e) {
    const searchBtn = e.target.closest("#btn-AI-search");
    if (!searchBtn) return;

    runAISearch(e);
  });

  // ENTER KEY EVENT
  document.querySelector("#txtAIPrompt").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      runAISearch(event);
    }
  });
})
