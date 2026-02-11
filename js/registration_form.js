document.addEventListener('DOMContentLoaded', () => {
  const steps = ['step-1', 'step-2', 'step-3'];
  let currentStep = 0;

  const progressSteps = document.querySelectorAll('.progress-step');

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

  // Helper for validating county/keyword selections in any service
  function validateSelection(containerAttrSelector, buttonAttrSelector, serviceBlock) {
    const checkboxes = serviceBlock.querySelectorAll(`${containerAttrSelector} input[type="checkbox"]`);
    const hasSelected = Array.from(checkboxes).some(cb => cb.checked);
    const button = serviceBlock.querySelector(buttonAttrSelector);
    if (!hasSelected) {
      button.classList.add('is-invalid');
      return false;
    } else {
      button.classList.remove('is-invalid');
      return true;
    }
  }

  // Validate form using browser built-in constraints API and Bootstrap styles
  function validateForm(form) {
    form.classList.add('was-validated');
    let isValid = form.checkValidity();

    const serviceBlocks = form.querySelectorAll('.service-block');
    serviceBlocks.forEach(block => {
      isValid = validateSelection('[id^="divCountiesReg"]', '[id^="btnCountiesReg"]', block) && isValid;
      isValid = validateSelection('[id^="divKeywordsReg"]', '[id^="btnKeywordsReg"]', block) && isValid;
    });
    return isValid;
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

  // Handle cancel button on step 1
  const cancelBtnStep1 = document.querySelector('#step-1 .cancel-btn');
    if (cancelBtnStep1) {
      cancelBtnStep1.addEventListener('click', () => {
      window.location.href = 'registration_landing.html';
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

  // Handle cancel button on step 3
  const cancelBtnStep3 = document.querySelector('#step-3 .cancel-btn');
  if (cancelBtnStep3) {
    cancelBtnStep3.addEventListener('click', () => {
      currentStep = 1;
      showStep(currentStep);
    });
  }

// Handle logo file upload and preview
const uploadInput = document.getElementById('upload');
const logoPreview = document.getElementById('logo-preview');
const logoImage = document.getElementById('logo-image');
const clearLogoBtn = document.getElementById('clear-logo');

if (uploadInput) {
  uploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate: Check if it's an image
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (e.g., JPG, PNG).');
        uploadInput.value = ''; // Clear the input
        return;
      }
      
      // Validate: Check file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('File size must be less than 5MB.');
        uploadInput.value = '';
        return;
      }
      
      // Read and display the image
      const reader = new FileReader();
      reader.onload = (e) => {
        logoImage.src = e.target.result; 
        logoPreview.style.display = 'block'; 
      };
      reader.readAsDataURL(file); 
    }
  });
}

//drag and drop
const fileUploadLabel = document.querySelector('.file-upload');
fileUploadLabel.addEventListener('dragover', (e) => {
  e.preventDefault();
  fileUploadLabel.classList.add('bg-light'); // Visual feedback
});
fileUploadLabel.addEventListener('dragleave', () => {
  fileUploadLabel.classList.remove('bg-light');
});
fileUploadLabel.addEventListener('drop', (e) => {
  e.preventDefault();
  fileUploadLabel.classList.remove('bg-light');
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    uploadInput.files = files; // Simulate input change
    uploadInput.dispatchEvent(new Event('change')); // Trigger the change event
  }
});


// Handle clearing the logo preview
if (clearLogoBtn) {
  clearLogoBtn.addEventListener('click', () => {
    uploadInput.value = ''; 
    logoImage.src = ''; 
    logoPreview.style.display = 'none'; 
  });
}

  // Event delegation for toggle buttons (counties and keywords) across all services
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[id^="btnCountiesReg"]') || e.target.closest('[id^="btnKeywordsReg"]');
    if (btn) {
      const outerDiv = btn.nextElementSibling;
      const icon = btn.querySelector('i');
      if (outerDiv.style.display === 'none' || outerDiv.style.display === '') {
        outerDiv.style.display = 'block';
        icon.className = 'bi bi-caret-up-fill';
      } else {
        outerDiv.style.display = 'none';
        icon.className = 'bi bi-caret-down-fill';
      }
    }
  });

  // Helper for setting up "hours differ" toggling
  function setupHoursDiffer(checkbox, container) {
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        container.style.display = 'block';
      } else {
        container.style.display = 'none';
        container.querySelectorAll('input').forEach(input => input.value = '');
      }
    });
  }

  // Set up "hours differ" for the first service
  const hoursDifferCheckbox = document.getElementById('hoursDiffer');
  const serviceHoursContainer = document.getElementById('serviceHoursContainer');
  if (hoursDifferCheckbox && serviceHoursContainer) {
    setupHoursDiffer(hoursDifferCheckbox, serviceHoursContainer);
  }

  // Initialize to show first step on page load
  showStep(currentStep);

  // Function to create checkboxes
  function createCheckbox(labelText, container, suffix = '') {
    const value = labelText.toLowerCase().replace(/\s+/g, "-");

    const wrapper = document.createElement("div");
    wrapper.className = "checkbox";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.className = "form-check-input";
    input.id = `${value}-checkbox${suffix}`; 
    input.value = labelText.toLowerCase();

    const label = document.createElement("label");
    label.className = "form-check-label";
    label.htmlFor = input.id;
    label.textContent = labelText;

    wrapper.appendChild(input);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
  }

  // Fetch services and populate registration form checkboxes
  async function populateRegistrationFilters() {
    let arrCounties = [];
    let arrServiceType = [];

    try {
      let servResponse = await fetch(`https://ucassist.duckdns.org/services`);
      let servData = await servResponse.json();

      servData.forEach(element => {
        let strKeywords = element.Keywords;
        if (typeof strKeywords === 'string') {
          strKeywords = JSON.parse(strKeywords);
        }
        if (Array.isArray(strKeywords)) {
          strKeywords.forEach(tag => {
            arrServiceType.push(tag);
          });
        }

        let strCounties = element.CountiesAvailable;
        if (typeof strCounties === 'string') {
          strCounties = JSON.parse(strCounties);
        }
        if (Array.isArray(strCounties)) {
          strCounties.forEach(county => {
            arrCounties.push(county);
          });
        }
      });

      let uniqueCounties = [...new Set(arrCounties.filter(c => typeof c === "string" && c.trim().length >= 1))].sort((a, b) => a.localeCompare(b));
      let uniqueServiceTypes = [...new Set(arrServiceType.filter(c => typeof c === "string" && c.trim().length >= 1))].sort((a, b) => a.localeCompare(b));

      const countiesContainer = document.getElementById("divCountiesReg");
      uniqueCounties.forEach(county => {
        createCheckbox(county, countiesContainer);
      });

      const keywordsContainerStep1 = document.getElementById("divKeywordsReg1");
      const keywordsContainerStep3 = document.getElementById("divKeywordsReg");
      uniqueServiceTypes.forEach(keyword => {
        createCheckbox(keyword, keywordsContainerStep1, '-step1');
        createCheckbox(keyword, keywordsContainerStep3, '-step3');
      });

    } catch (objError) {
      console.log('Error fetching data for registration filters', objError);
    }
  }

  // Populate the registration filters on load
  populateRegistrationFilters();

  // Handle adding another service
  const addServiceBtn = document.getElementById('addServiceBtn');
  let serviceCount = 1;

  addServiceBtn.addEventListener('click', () => {
    serviceCount++;
    const firstService = document.querySelector('.service-block');
    const newService = firstService.cloneNode(true);

    newService.querySelector('.form-label').textContent = `Service ${serviceCount}`;
    newService.setAttribute('data-service', serviceCount);

    // Update IDs, names, for attributes
    function updateElementIds(element, suffix) {
      if (element.id) element.id += suffix;
      if (element.name) element.name += suffix;
      if (element.htmlFor) element.htmlFor += suffix;
      if (element.getAttribute('for')) element.setAttribute('for', element.getAttribute('for') + suffix);
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.value = '';
        if (element.type === 'checkbox') element.checked = false;
      }
      Array.from(element.children).forEach(child => updateElementIds(child, suffix));
    }
    updateElementIds(newService, serviceCount);

    document.getElementById('services-container').appendChild(newService);

    // Set up "hours differ" for the new service
    const newHoursDiffer = newService.querySelector(`#hoursDiffer${serviceCount}`);
    const newServiceHoursContainer = newService.querySelector(`#serviceHoursContainer${serviceCount}`);
    if (newHoursDiffer && newServiceHoursContainer) {
      setupHoursDiffer(newHoursDiffer, newServiceHoursContainer);
    }
  });
});