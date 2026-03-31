// const input = document.getElementById("txtAIPrompt");

// if (window.innerWidth < 576) {
//     input.placeholder = "I need...";
// } else {
//     input.placeholder = "What do you need help with?";
// }

document.querySelector('#btnLearnSearchBar').addEventListener("click", (e) => {
  let strDiv = `
    <ol style="text-align:left; padding-left: 20px;">
        <li>Describe what you need in the search bar.</li>
        <li>Be as specific as you'd like (e.g., <b>"I need food assistance for a family of four."</b>).</li>
        <li>The AI will use your location to find the most relevant nearby services.</li>
        <li>Browse the suggested results.</li>
        <li>Click on a service to see more details.</li>
    </ol>
  `;
  Swal.fire({
    title: "How do I use AI search bar?",
    html: strDiv,
    icon: "question"
  });
})