document.addEventListener("DOMContentLoaded", function() {
  const printLink = document.querySelector('a[aria-label="Print this page"]');

  if (printLink) {
    printLink.addEventListener("click", function(event) {
      event.preventDefault();

      document.body.classList.add("print-color-mode");

      window.print();

      window.onafterprint = function() {
        document.body.classList.remove("print-color-mode");
      };
    });
  }
});