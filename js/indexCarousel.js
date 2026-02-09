const input = document.getElementById("txtAIPrompt");

if (window.innerWidth < 576) {
    input.placeholder = "I need...";
} else {
    input.placeholder = "What do you need help with?";
}