document.addEventListener("click", async function (e) {
  const searchBtn = e.target.closest("#btnAISearch");
  if (!searchBtn) return;

  e.preventDefault();

  const input = document.getElementById("txtAIPrompt");


  const prompt = input.value.trim();

  if (prompt.length < 1) {
    swal.fire({
      title: "Uh Oh!",
      text: "Please enter a search prompt.",
      icon: "error"
    });
    return;
  }

  sessionStorage.setItem("user_prompt", prompt);
  window.location.href = "html/pages/ai_results.html";
});

// //SIDE BAR AI

