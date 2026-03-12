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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Populate hour options for start/end selects
  function populateHourSelects() {
    const ranges = document.querySelectorAll('.time-range');
    ranges.forEach(range => {
      const selects = range.querySelectorAll('select');
      if (selects.length > 3) {
        const startSelect = selects[1];
        const endSelect = selects[3];

        const fillSelect = (select) => {
          if (select && select.options.length <= 1) {
            for (let i = 1; i <= 12; i++) {
              const option = document.createElement('option');
              option.value = i;
              option.textContent = i;
              select.appendChild(option);
            }
          }
        };
        fillSelect(startSelect);
        fillSelect(endSelect);
      }
    });
  }
  populateHourSelects();

  // Unified dropdown toggle setup
  function setupDropdownTogglePairs(pairs) {
    pairs.forEach(({ buttonId, containerId }) => {
      const button = document.getElementById(buttonId);
      const container = document.getElementById(containerId);
      if (container) container.style.display = 'none';

      if (button) {
        document.addEventListener('click', e => {
          if (button.contains(e.target)) {
            if (container.style.display === 'none' || container.style.display === '') {
              container.style.display = 'block';
              button.querySelector('i').className = 'bi bi-caret-up-fill';
            } else {
              container.style.display = 'none';
              button.querySelector('i').className = 'bi bi-caret-down-fill';
            }
          } else if (container && !container.contains(e.target) && !button.contains(e.target)) {
            container.style.display = 'none';
            button.querySelector('i').className = 'bi bi-caret-down-fill';
          }
        });
      }
    });
  }
  setupDropdownTogglePairs([
    { buttonId: 'btnKeywordsReg1', containerId: 'divOuterKeywordsReg1' },
    { buttonId: 'btnKeywordsReg', containerId: 'divOuterKeywordsReg' },
    { buttonId: 'btnCountiesReg', containerId: 'divOuterCountiesReg' }
  ]);

  function setupHoursDiffer(checkbox, container) {
    if (checkbox && container) {
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) container.style.display = 'block';
        else {
          container.style.display = 'none';
          container.querySelectorAll('select').forEach(sel => sel.value = '');
        }
      });
    }
  }
  const hoursDifferCheckbox = document.getElementById('hoursDiffer');
  const serviceHoursContainer = document.getElementById('serviceHoursContainer');
  setupHoursDiffer(hoursDifferCheckbox, serviceHoursContainer);

  function setupAddHours(button, container, rangeSelector) {
    if (!button || !container) return;
    button.addEventListener('click', () => {
      const firstRange = container.querySelector(rangeSelector);
      if (!firstRange) return;
      const newRange = firstRange.cloneNode(true);
      newRange.querySelectorAll('select').forEach(s => s.value = '');
      container.insertBefore(newRange, button);
      updateRemoveButtons(container, rangeSelector);
      populateHourSelects();
    });
    updateRemoveButtons(container, rangeSelector);
  }
  function updateRemoveButtons(container, rangeSelector) {
    const ranges = container.querySelectorAll(rangeSelector);
    ranges.forEach(range => {
      const removeBtn = range.querySelector('.remove-range');
      if (removeBtn) {
        if (ranges.length > 1) {
          removeBtn.style.display = 'inline-block';
          removeBtn.onclick = () => {
            range.remove();
            updateRemoveButtons(container, rangeSelector);
          };
        } else {
          removeBtn.style.display = 'none';
        }
      }
    });
  }

  // Setup add/remove hours for Step 1 and 3
  const step1AddBtn = document.querySelector('#step-1 .add-hours');
  if (step1AddBtn) {
    const step1Container = step1AddBtn.parentElement;
    setupAddHours(step1AddBtn, step1Container, '.time-range');
  }
  const step3AddBtns = document.querySelectorAll('#step-3 .add-hours');
  step3AddBtns.forEach(btn => {
    const container = btn.parentElement;
    setupAddHours(btn, container, '.time-range');
  });

  // Handle adding another service dynamically
  const addServiceBtn = document.getElementById('addServiceBtn');
  let serviceCount = 1;

  addServiceBtn.addEventListener('click', () => {
    serviceCount++;
    const firstService = document.querySelector('.service-block');
    const newService = firstService.cloneNode(true);
    const label = newService.querySelector('label.required');
    if (label) {
      label.textContent = `Service ${serviceCount}`;
    }

    newService.setAttribute('data-service', serviceCount);

    // Update IDs, names, and for attributes with suffix
    function updateElementIds(element, suffix) {
      if (element.id) element.id += suffix;
      if (element.name) element.name += suffix;
      if (element.htmlFor) element.htmlFor += suffix;
      if (element.getAttribute('for')) element.setAttribute('for', element.getAttribute('for') + suffix);

      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
        element.value = '';
        if (element.type === 'checkbox') element.checked = false;
      }
      Array.from(element.children).forEach(child => updateElementIds(child, suffix));
    }
    updateElementIds(newService, serviceCount);
    const servicesContainer = document.getElementById('services-container');
    servicesContainer.insertBefore(newService, addServiceBtn);
    const buttonContainer = document.querySelector('#form-step-3 .d-flex.gap-3');
    if (buttonContainer) {
      servicesContainer.appendChild(buttonContainer);
    }
    const newHoursDiffer = newService.querySelector(`#hoursDiffer${serviceCount}`);
    const newServiceHoursContainer = newService.querySelector(`#serviceHoursContainer${serviceCount}`);
    setupHoursDiffer(newHoursDiffer, newServiceHoursContainer);
    populateHourSelects();
    setupDropdownTogglePairs([
      { buttonId: `btnCountiesReg${serviceCount}`, containerId: `divOuterCountiesReg${serviceCount}` },
      { buttonId: `btnKeywordsReg${serviceCount}`, containerId: `divOuterKeywordsReg${serviceCount}` }
    ]);

    // Setup add hours button functionality for new service
    const newAddBtn = newService.querySelector('.add-hours');
    if (newAddBtn) {
      const newContainer = newAddBtn.parentElement;
      setupAddHours(newAddBtn, newContainer, '.time-range');
    }
  });

  function getFieldLabel(input) {
    if (input.id === 'physicalAddress') return 'Physical Address (Street)';
    if (input.id === 'cityPublic') return 'Physical Address (City)';
    if (input.id === 'statePublic') return 'Physical Address (State)';
    if (input.id === 'zipPublic') return 'Physical Address (Zip Code)';
    if (input.tagName === 'SELECT' && input.closest('.time-range')) {
      const selects = Array.from(input.closest('.time-range').querySelectorAll('select'));
      const index = selects.indexOf(input);
      if (index === 0) return 'Hours (Day)';
      if (index === 1) return 'Hours (Start Time)';
      if (index === 2) return 'Hours (Start AM/PM)';
      if (index === 3) return 'Hours (End Time)';
      if (index === 4) return 'Hours (End AM/PM)';
    }
    if (input.id) {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label) return label.textContent.replace('*', '').trim();
    }
    const parent = input.closest('.mb-3, fieldset');
    if (parent) {
      const label = parent.querySelector('label');
      if (label) return label.textContent.replace('*', '').trim();
    }
    return input.name || input.id || 'Field';
  }

  function isGroupChecked(selector, parent) {
    const container = parent.querySelector(selector);
    if (!container) return true;
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    return Array.from(checkboxes).some(cb => cb.checked);
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
    if (form.id === 'form-step-1') {
      if (!isGroupChecked('#divKeywordsReg1', form)) {
        errors.push("Keywords (Step 1)");
      }
    } else if (form.id === 'form-step-3') {
      const services = form.querySelectorAll('.service-block');
      services.forEach((block, index) => {
        const serviceNum = index + 1;
        if (!isGroupChecked('[id^="divCountiesReg"]', block)) {
          errors.push(`Counties for Service ${serviceNum}`);
        }
        if (!isGroupChecked('[id^="divKeywordsReg"]', block)) {
          errors.push(`Keywords for Service ${serviceNum}`);
        }
      });
    }
    return errors;
  }

  const formStep1 = document.getElementById('form-step-1');
  if (formStep1) {
    formStep1.addEventListener('submit', e => {
      e.preventDefault();
      formStep1.classList.add('was-validated');
      const errors = collectFormErrors(formStep1);
      if (errors.length === 0) {
        currentStep = 1;
        showStep(currentStep);
      } else {
        const errorList = errors.map(err => `• ${err}`).join('\n');
        swal("Missing Information", `Please complete the following:\n\n${errorList}`, "error");
      }
    });
  }
  const cancelBtnStep1 = document.querySelector('#step-1 .cancel-btn');
  if (cancelBtnStep1) {
    cancelBtnStep1.addEventListener('click', () => window.location.href = 'registration_landing.html');
  }

  const formStep2 = document.getElementById('form-step-2');
  if (formStep2) {
    formStep2.addEventListener('submit', e => {
      e.preventDefault();
      formStep2.classList.add('was-validated');
      const errors = collectFormErrors(formStep2);
      if (errors.length === 0) {
        currentStep = 2;
        showStep(currentStep);
      } else {
        const errorList = errors.map(err => `• ${err}`).join('\n');
        swal("Missing Information", `Please complete the following:\n\n${errorList}`, "error");
      }
    });
  }
  const backBtnStep2 = document.querySelector('#step-2 .cancel-btn');
  if (backBtnStep2) {
    backBtnStep2.addEventListener('click', () => {
      currentStep = 0;
      showStep(currentStep);
    });
  }

  const formStep3 = document.getElementById('form-step-3');
  if (formStep3) {
    formStep3.addEventListener('submit', e => {
      e.preventDefault();
      formStep3.classList.add('was-validated');
      const errors = collectFormErrors(formStep3);
      if (errors.length === 0) {
        swal("Success", "Registration form submitted successfully!", "success");
      } else {
        const errorList = errors.map(err => `• ${err}`).join('\n');
        swal("Missing Information", `Please complete the following:\n\n${errorList}`, "error");
      }
    });
  }
  const cancelBtnStep3 = document.querySelector('#step-3 .cancel-btn');
  if (cancelBtnStep3) {
    cancelBtnStep3.addEventListener('click', () => {
      currentStep = 1;
      showStep(currentStep);
    });
  }

  // Logo upload
  const uploadInput = document.getElementById('upload');
  const logoPreview = document.getElementById('logo-preview');
  const logoImage = document.getElementById('logo-image');
  const clearLogoBtn = document.getElementById('clear-logo');

  if (uploadInput) {
    uploadInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          alert('Please select a valid image file (e.g., JPG, PNG).');
          uploadInput.value = '';
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          alert('File size must be less than 5MB.');
          uploadInput.value = '';
          return;
        }
        const reader = new FileReader();
        reader.onload = e => {
          logoImage.src = e.target.result;
          logoPreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    });
  }
  const fileUploadLabel = document.querySelector('.file-upload');
  if (fileUploadLabel && uploadInput) {
    fileUploadLabel.addEventListener('dragover', e => {
      e.preventDefault();
      fileUploadLabel.classList.add('bg-light');
    });
    fileUploadLabel.addEventListener('dragleave', () => fileUploadLabel.classList.remove('bg-light'));
    fileUploadLabel.addEventListener('drop', e => {
      e.preventDefault();
      fileUploadLabel.classList.remove('bg-light');
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        uploadInput.files = files;
        uploadInput.dispatchEvent(new Event('change'));
      }
    });
  }
  if (clearLogoBtn) {
    clearLogoBtn.addEventListener('click', () => {
      if (uploadInput) uploadInput.value = '';
      logoImage.src = '';
      logoPreview.style.display = 'none';
    });
  }

  showStep(currentStep);

  // Function to create checkboxes for counties/keywords
  function createCheckbox(labelText, container, suffix = '') {
    const value = labelText.toLowerCase().replace(/\s+/g, "-");
    const wrapper = document.createElement("div");
    wrapper.className = "checkbox mb-1";
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

  async function fetchAndPopulateAllData() {
    try {
      const response = await fetch('https://ucassist.duckdns.org/services');
      const data = await response.json();
      const cities = [];
      data.forEach(service => {
        if (service.CityStateZip) {
          const parts = service.CityStateZip.split(',');
          const city = parts[0].trim();
          if (city) {
            cities.push(city);
          }
        }
      });
      const uniqueCities = [...new Set(cities)].sort();
      const arrCounties = [];
      const arrServiceType = [];

      data.forEach(element => {
        let strKeywords = element.Keywords;
        if (typeof strKeywords === 'string') {
          try { strKeywords = JSON.parse(strKeywords); } catch (e) { strKeywords = []; }
        }
        if (Array.isArray(strKeywords)) {
          strKeywords.forEach(tag => arrServiceType.push(tag));
        }
        let strCounties = element.CountiesAvailable;
        if (typeof strCounties === 'string') {
          try { strCounties = JSON.parse(strCounties); } catch (e) { strCounties = []; }
        }
        if (Array.isArray(strCounties)) {
          strCounties.forEach(county => arrCounties.push(county));
        }
      });

      const uniqueCounties = [...new Set(arrCounties.filter(c => typeof c === "string" && c.trim()))].sort((a, b) => a.localeCompare(b));
      const uniqueServiceTypes = [...new Set(arrServiceType.filter(c => typeof c === "string" && c.trim()))].sort((a, b) => a.localeCompare(b));
      const cityStep1 = document.getElementById('cityPublic');
      if (cityStep1) {
        uniqueCities.forEach(city => {
          const option = document.createElement('option');
          option.value = city;
          option.textContent = city;
          cityStep1.appendChild(option);
        });
      }
      const cityStep3Selects = document.querySelectorAll('select[id="serviceCity"]');
      cityStep3Selects.forEach(select => {
        uniqueCities.forEach(city => {
          const option = document.createElement('option');
          option.value = city;
          option.textContent = city;
          select.appendChild(option);
        });
      });
      const countiesContainer = document.getElementById("divCountiesReg");
      if (countiesContainer) {
        uniqueCounties.forEach(county => {
          createCheckbox(county, countiesContainer);
        });
      }
      const keywordsContainerStep1 = document.getElementById("divKeywordsReg1");
      if (keywordsContainerStep1) {
        uniqueServiceTypes.forEach(keyword => {
          createCheckbox(keyword, keywordsContainerStep1, '-step1');
        });
      }
      const keywordsContainerStep3 = document.getElementById("divKeywordsReg");
      if (keywordsContainerStep3) {
        uniqueServiceTypes.forEach(keyword => {
          createCheckbox(keyword, keywordsContainerStep3, '-step3');
        });
      }

    } catch (error) {
      console.error('Error fetching data for registration filters', error);
    }
  }
  fetchAndPopulateAllData();

  // Phone and Zip masking
  document.addEventListener('input', e => {
    const target = e.target;
    const isPhone = target.id === 'phone' || target.id === 'primaryPhone' || target.id === 'secondaryPhone' || target.id.startsWith('servicePhone');
    if (isPhone) {
      let value = target.value.replace(/\D/g, '');
      if (value.length > 0) {
        if (value.length <= 3) {
          value = `(${value}`;
        } else if (value.length <= 6) {
          value = `(${value.substring(0, 3)}) ${value.substring(3)}`;
        } else {
          value = `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6, 10)}`;
        }
      }
      target.value = value;
    }
    const isZip = target.id === 'zipPublic' || target.id.startsWith('zipCode');
    if (isZip) {
      let value = target.value.replace(/\D/g, '');
      if (value.length > 5) {
        value = value.substring(0, 5);
      }
      target.value = value;
    }
  });
});