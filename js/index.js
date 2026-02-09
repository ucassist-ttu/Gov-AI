console.log("[index.js] Delegated search listener active");

document.addEventListener("click", async function (e) {

  const searchBtn = e.target.closest("#btn-AI-search");
  if (!searchBtn) return;

  e.preventDefault();

  const input = document.getElementById("txtAIPrompt");

  if (!input) {
    console.warn("[index.js] txtAIPrompt not found");
    return;
  }

  const prompt = input.value.trim();

  if (prompt.length < 1) {
    swal({
      title: "Uh Oh!",
      text: "Please enter a search prompt.",
      icon: "error"
    });
    return;
  }

  sessionStorage.setItem("user_prompt", prompt);
  window.location.href = "/html/pages/ai_results.html";
});



// //SIDE BAR AI
// // Opens the filter side bar
// document.querySelector("#btn-AI-search").addEventListener("click", () => {
//     document.getElementById("mySidenav").style.width = "375px";
//     overlay.classList.add("active");
// });

// // Closes the filter side bar
// function closeNav() {
//   document.getElementById("mySidenav").style.width = "0";
//   overlay.classList.remove("active");
// }

// // Closes the filter when the overlay is clicked
// overlay.addEventListener("click", () => {
//   document.getElementById("mySidenav").style.width = "0";
//   overlay.classList.remove("active");
// })
