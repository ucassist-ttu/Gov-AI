document.addEventListener('DOMContentLoaded', () => {
  // Grab form and buttons
  const form = document.querySelector('main form');

  // Use HTML5 form validation and bootstrap styles
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.classList.add('was-validated');

    if (form.checkValidity()) {
      alert('Service referral form submitted successfully!');
      form.reset();
      form.classList.remove('was-validated');
    } else {
      // Scroll to first invalid field
      const firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) firstInvalid.focus();
    }
  });

});