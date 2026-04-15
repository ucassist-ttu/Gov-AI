emailjs.init("YOUR_PUBLIC_KEY");

document.addEventListener('DOMContentLoaded', () => {
  const steps = ['step-1', 'step-2', 'step-3'];
  let currentStep = 0;
  const progressSteps = document.querySelectorAll('.progress-step');

  // Service list and tab functionality
  const step3Container = document.getElementById('services-container');
  const addServiceBtn = document.getElementById('addServiceBtn');
  let serviceCount = 1;

  if (step3Container && addServiceBtn) {
    const serviceListContainer = document.createElement('div');
    serviceListContainer.id = 'service-list';
    serviceListContainer.className = 'mb-3 d-flex flex-column gap-2';

    const firstServiceBlock = step3Container.querySelector('.service-block');
    if (firstServiceBlock) step3Container.insertBefore(serviceListContainer, firstServiceBlock);

    function createServiceTab(num) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-light text-start service-tab shadow-sm';
      btn.dataset.service = num;
      btn.style.width = '100%';
      btn.innerHTML = `Service ${num}`;
      return btn;
    }

    function updateActiveTab(selectedNum) {
      const tabs = serviceListContainer.querySelectorAll('.service-tab');
      tabs.forEach(tab => {
        const num = parseInt(tab.dataset.service, 10);
        tab.innerHTML = `Service ${num}`;
        if (num === selectedNum) {
          tab.classList.remove('btn-light');
          tab.classList.add('btn-dark', 'active');
        } else {
          tab.classList.remove('btn-dark', 'active');
          tab.classList.add('btn-light');
        }
      });
    }

    function showService(num) {
      const allServices = step3Container.querySelectorAll('.service-block');
      allServices.forEach(svc => { svc.style.display = 'none'; });
      const selected = step3Container.querySelector(`.service-block[data-service="${num}"]`);
      if (selected) {
        selected.style.display = 'block';
        serviceListContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      updateActiveTab(num);
    }

    const existingServices = step3Container.querySelectorAll('.service-block');
    existingServices.forEach((serviceBlock, index) => {
      const num = index + 1;
      serviceBlock.setAttribute('data-service', num);
      serviceBlock.style.display = num === 1 ? 'block' : 'none';
    });
    serviceListContainer.innerHTML = '';
    serviceListContainer.appendChild(createServiceTab(1));
    updateActiveTab(1);
    serviceListContainer.addEventListener('click', e => {
      const tab = e.target.closest('.service-tab');
      if (tab) {
        const num = parseInt(tab.dataset.service, 10);
        showService(num);
      }
    });
  }

  function showStep(index) {
    steps.forEach((stepId, i) => {
      const section = document.getElementById(stepId);
      if (section) {
        section.classList.toggle('d-none', i !== index);
      }
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

  // NEW: Event delegation for ALL checkboxes (phone, address, hours)
  function setupCheckboxEventDelegation() {
    document.addEventListener('change', function(e) {
      const checkbox = e.target;
      
      // Separate phone checkbox
      if (checkbox.matches('input[id^="separatePhone"]')) {
        const serviceBlock = checkbox.closest('.service-block');
        if (!serviceBlock) return;
        const phoneContainer = serviceBlock.querySelector('.service-phone-container');
        if (phoneContainer) {
          phoneContainer.style.display = checkbox.checked ? 'block' : 'none';
          if (!checkbox.checked) {
            const phoneInput = phoneContainer.querySelector('input[type="tel"]');
            if (phoneInput) phoneInput.value = '';
          }
        }
      }
      
      // Separate address checkbox
      else if (checkbox.matches('input[id^="separateAddress"]')) {
        const serviceBlock = checkbox.closest('.service-block');
        if (!serviceBlock) return;
        const addressContainer = serviceBlock.querySelector('.service-address-container');
        if (addressContainer) {
          addressContainer.style.display = checkbox.checked ? 'block' : 'none';
          if (!checkbox.checked) {
            addressContainer.querySelectorAll('input, select').forEach(field => {
              field.value = '';
            });
          }
        }
      }
      
      // Separate hours checkbox ✅ THIS WILL NOW WORK!
      else if (checkbox.matches('input[id^="separateHours"]')) {
        const serviceBlock = checkbox.closest('.service-block') || document;
        if (!serviceBlock) return;
        const hoursContainer = serviceBlock.querySelector('.service-hours-container');
        if (hoursContainer) {
          hoursContainer.style.display = checkbox.checked ? 'block' : 'none';
          if (!checkbox.checked) {
            hoursContainer.querySelectorAll('select').forEach(sel => sel.value = '');
          }
        }
      }
    });
  }
  setupCheckboxEventDelegation();

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
  
  const step1AddBtn = document.querySelector('#step-1 .add-hours');
  if (step1AddBtn) {
    const step1Container = step1AddBtn.parentElement;
    setupAddHours(step1AddBtn, step1Container, '.time-range');
  }

  // Add service button
  if (addServiceBtn) {
    addServiceBtn.addEventListener('click', () => {
      serviceCount++;
      const firstService = document.querySelector('.service-block');
      if (!firstService) return;

      const newService = firstService.cloneNode(true);
      suffixIds(newService, serviceCount);
      newService.setAttribute('data-service', serviceCount);
      const servicesContainer = document.getElementById('services-container');
      servicesContainer.insertBefore(newService, addServiceBtn);

      const serviceListContainer = document.getElementById('service-list');
      if (serviceListContainer) {
        serviceListContainer.appendChild(createServiceTab(serviceCount));
        showService(serviceCount);
        updateActiveTab(serviceCount);
      }

      populateHourSelects();
      setupDropdownTogglePairs([
        { buttonId: `btnCountiesReg${serviceCount}`, containerId: `divOuterCountiesReg${serviceCount}` },
        { buttonId: `btnKeywordsReg${serviceCount}`, containerId: `divOuterKeywordsReg${serviceCount}` }
      ]);

      const newAddBtn = newService.querySelector('.add-hours');
      if (newAddBtn) {
        const newContainer = newAddBtn.parentElement;
        setupAddHours(newAddBtn, newContainer, '.time-range');
      }
    });
  }

  function suffixIds(element, suffix) {
    if (element.id) element.id += suffix;
    if (element.name) element.name += suffix;
    if (element.htmlFor) element.htmlFor += suffix;
    if (element.getAttribute('for')) element.setAttribute('for', element.getAttribute('for') + suffix);

    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
      element.value = '';
      if (element.type === 'checkbox') element.checked = false;
    }
    Array.from(element.children).forEach(child => suffixIds(child, suffix));
  }

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

    const requiredFields = Array.from(form.querySelectorAll('[required]')).filter(field => {
      if (field.id && (field.id.startsWith('serviceName') || field.id.startsWith('serviceDescription'))) {
        return false;
      }
      return true;
    });

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
    }

    if (form.id === 'form-step-3') {
      const services = form.querySelectorAll('.service-block');
      services.forEach((block, index) => {
        const serviceNum = index + 1;
        const name = block.querySelector('input[id^="serviceName"]');
        if (!name || !name.value.trim()) errors.push(`Service Name for Service ${serviceNum}`);
        const desc = block.querySelector('textarea[id^="serviceDescription"]');
        if (!desc || !desc.value.trim()) errors.push(`Service Description for Service ${serviceNum}`);
        if (!isGroupChecked('[id^="divCountiesReg"]', block)) errors.push(`Counties for Service ${serviceNum}`);
        if (!isGroupChecked('[id^="divKeywordsReg"]', block)) errors.push(`Keywords for Service ${serviceNum}`);
      });
    }

    return errors;
  }

  // Form submissions
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
        Swal.fire({
          title: "Missing Information",
          icon: "error",
          html: `
            <div style="text-align: left;">
              Please complete the following:<br><br>
              ${errorList.replace(/\n/g, "<br>")}
            </div>
          `
        });
      }
    });
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
        Swal.fire({
          title: "Missing Information",
          icon: "error",
          html: `
            <div style="text-align: left;">
              Please complete the following:<br><br>
              ${errorList.replace(/\n/g, "<br>")}
            </div>
          `
        });
      }
    });
  }

  const formStep3 = document.getElementById('form-step-3');
  if (formStep3) {
    formStep3.addEventListener('submit', e => {
      e.preventDefault();
      formStep3.classList.add('was-validated');
      const errors = collectFormErrors(formStep3);
      if (errors.length === 0) {
        Swal.fire({
          title: "Success",
          text: "Registration form submitted successfully!",
          icon: "success"
        });
      } else {
        const errorList = errors.map(err => `• ${err}`).join('\n');
        Swal.fire({
          title: "Missing Information",
          icon: "error",
          html: `
            <div style="text-align: left;">
              Please complete the following:<br><br>
              ${errorList.replace(/\n/g, "<br>")}
            </div>
          `
        });
      }
    });
  }

  // Cancel/Back buttons
  document.querySelector('#step-1 .cancel-btn')?.addEventListener('click', () => window.location.href = 'registration_landing.html');
  document.querySelector('#step-2 .cancel-btn')?.addEventListener('click', () => {
    currentStep = 0;
    showStep(currentStep);
  });
  document.querySelector('#step-3 .cancel-btn')?.addEventListener('click', () => {
    currentStep = 1;
    showStep(currentStep);
  });

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

  if (clearLogoBtn) {
    clearLogoBtn.addEventListener('click', () => {
      if (uploadInput) uploadInput.value = '';
      logoImage.src = '';
      logoPreview.style.display = 'none';
    });
  }

  showStep(currentStep);

  // Create checkboxes for counties/keywords
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

// Fetch and populate data
async function fetchAndPopulateAllData() {
  try {
    const response = await fetch('https://ucassist.duckdns.org/services');
    const data = await response.json();
    const cities = [];
    data.forEach(service => {
      if (service.CityStateZip) {
        const parts = service.CityStateZip.split(',');
        const city = parts[0].trim();
        if (city) cities.push(city);
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
    
    // Step 1 city
    const cityStep1 = document.getElementById('cityPublic');
    if (cityStep1) {
      uniqueCities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        cityStep1.appendChild(option);
      });
    }
    
    // Step 3 cities
    const cityStep3Selects = document.querySelectorAll('.service-city-select');
    cityStep3Selects.forEach(select => {
      uniqueCities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        select.appendChild(option);
      });
    });
    
    // Counties
    const countiesContainer = document.getElementById("divCountiesReg");
    if (countiesContainer) {
      uniqueCounties.forEach(county => createCheckbox(county, countiesContainer));
    }
    
    // Keywords Step 1
    const keywordsContainerStep1 = document.getElementById("divKeywordsReg1");
    if (keywordsContainerStep1) {
      uniqueServiceTypes.forEach(keyword => createCheckbox(keyword, keywordsContainerStep1, '-step1'));
    }
    
    // Keywords Step 3
    const keywordsContainerStep3 = document.getElementById("divKeywordsReg");
    if (keywordsContainerStep3) {
      uniqueServiceTypes.forEach(keyword => createCheckbox(keyword, keywordsContainerStep3, '-step3'));
    }

  } catch (error) {
    console.error('Error fetching data for registration filters', error);
  }
}
fetchAndPopulateAllData();
// Phone and Zip formatting
  document.addEventListener('input', e => {
    const target = e.target;
    
    // Phone formatting
    const isPhone = target.matches('input[type="tel"]');
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
    
    // Zip formatting
    const isZip = target.id === 'zipPublic' || target.id.startsWith('serviceZip');
    if (isZip) {
      let value = target.value.replace(/\D/g, '');
      if (value.length > 5) value = value.substring(0, 5);
      target.value = value;
    }
  });
});

//EMAILJS CODE - UPDATE TO COLLECT MULTIPLE SERVICES
document.getElementById("form-step-3").addEventListener("submit", function (e) {
  e.preventDefault();

  // --- Collect Step 1 data ---
  const companyName = document.querySelector('[data-name="Company Name Input"]').value;
  const description = document.querySelector('[data-name="Organization Description Input"]').value;
  const phone = document.getElementById("phone").value;
  const website = document.getElementById("website").value;

  // --- Collect Step 2 data ---
  const primaryName = document.getElementById("primaryName").value;
  const primaryEmail = document.getElementById("primaryEmail").value;
  const primaryPhone = document.getElementById("primaryPhone").value;

  // --- Collect Step 3 (first service only for now) ---
  const serviceName = document.getElementById("serviceName").value;
  const serviceDescription = document.getElementById("serviceDescription").value;

  // --- Build template params ---
  const templateParams = {
    action: "New Submission",

    company_name: companyName,
    company_description: description,
    company_phone: phone,
    company_website: website,

    name: primaryName,
    email: primaryEmail,
    primary_phone: primaryPhone,

    services: services.join("\n"),

    admin_link: "http://127.0.0.1:5500/Gov-AI/html/pages/view_submissions.html", // or dynamic link
    reference_id: "REQ-" + Date.now(),

    platform_name: "UCAssist" // or your actual name
  };

  // --- Send email ---
  emailjs.send(
    "YOUR_SERVICE_ID",
    "YOUR_TEMPLATE_ID",
    templateParams
  )
  .then(function (response) {
    Swal.fire({
      icon: "success",
      title: "Submitted!",
      text: "Your registration has been received.",
      // confirmButtonColor: "#0d6efd"
    });

    document.getElementById("form-step-3").reset();
  })
  .catch(function (error) {
    console.error("EmailJS Error:", error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong. Please try again."
    });
  });
});