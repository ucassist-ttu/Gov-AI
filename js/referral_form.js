document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('main form');
  function getFieldLabel(input) {
    if (input.id) {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label) return label.textContent.replace('*', '').trim();
    }
    return input.name || input.id || 'Field';
  }
  function collectFormErrors(form) {
    let errors = [];
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      if (field.type === 'checkbox') return;
      
      if (!field.checkValidity()) {
        errors.push(getFieldLabel(field));
      }
    });
    return errors;
  }
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 0) {
        if (value.length <= 3) {
          value = `(${value}`;
        } else if (value.length <= 6) {
          value = `(${value.substring(0, 3)}) ${value.substring(3)}`;
        } else {
          value = `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6, 10)}`;
        }
      }
      e.target.value = value;
    });
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.classList.add('was-validated');

    const errors = collectFormErrors(form);

    if (errors.length === 0) {
      swal("Success", "Service referral form submitted successfully!", "success");
      form.reset();
      form.classList.remove('was-validated');
    } else {
      const errorList = errors.map(err => `• ${err}`).join('\n');
      swal("Missing Information", `Please complete the following:\n\n${errorList}`, "error");
      const firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) firstInvalid.focus();
    }
  });
});