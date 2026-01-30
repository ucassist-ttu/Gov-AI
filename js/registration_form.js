document.addEventListener('DOMContentLoaded', () => {
  const steps = ['step-1', 'step-2', 'step-3'];
  let currentStep = 0;

  const progressSteps = document.querySelectorAll('.progress-step');
  const progressLines = document.querySelectorAll('.progress-line');

  // Show the step section by index and update progress
  function showStep(index) {
    steps.forEach((stepId, i) => {
      const section = document.getElementById(stepId);
      if (section) {
        section.classList.toggle('d-none', i !== index);
      }
      // Update circle active state
      if (progressSteps[i]) {
        if (i === index) {
          progressSteps[i].classList.add('active');
          progressSteps[i].setAttribute('aria-current', 'step');
        } else {
          progressSteps[i].classList.remove('active');
          progressSteps[i].removeAttribute('aria-current');
        }
      }
    });
    // Scroll to top smoothly when step changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Validate form using browser built in constraints API and Bootstrap styles
  function validateForm(form) {
    form.classList.add('was-validated');
    return form.checkValidity();
  }

  // Handle step 1 form submit (Next)
  const formStep1 = document.getElementById('form-step-1');
  if (formStep1) {
    formStep1.addEventListener('submit', e => {
      e.preventDefault();
      if (validateForm(formStep1)) {
        currentStep = 1;
        showStep(currentStep);
      }
    });
  }

  // Handle step 2 form submit (Next)
  const formStep2 = document.getElementById('form-step-2');
  if (formStep2) {
    formStep2.addEventListener('submit', e => {
      e.preventDefault();
      if (validateForm(formStep2)) {
        currentStep = 2;
        showStep(currentStep);
      }
    });
  }

  // Handle back button on step 2
  const backBtnStep2 = document.querySelector('#step-2 .cancel-btn');
  if (backBtnStep2) {
    backBtnStep2.addEventListener('click', () => {
      currentStep = 0;
      showStep(currentStep);
    });
  }

  // Handle step 3 form submit 
  const formStep3 = document.getElementById('form-step-3');
  if (formStep3) {
    formStep3.addEventListener('submit', e => {
      e.preventDefault();
      if (validateForm(formStep3)) {
        alert('Registration form submitted successfully!');
      }
    });
  }

  // Toggle service hours container visibility on checkbox change
  const hoursDifferCheckbox = document.getElementById('hoursDiffer');
  const serviceHoursContainer = document.getElementById('serviceHoursContainer');
  if (hoursDifferCheckbox && serviceHoursContainer) {
    hoursDifferCheckbox.addEventListener('change', () => {
      if (hoursDifferCheckbox.checked) {
        serviceHoursContainer.style.display = 'block';
      } else {
        serviceHoursContainer.style.display = 'none';
        // Clear all inputs inside service hours
        serviceHoursContainer.querySelectorAll('input').forEach(input => input.value = '');
      }
    });
  }

  // Initialize to show first step on page load
  showStep(currentStep);
});