let strEditorName
let strEditorEmail
let strEditorPhoneNumber
let strEditorOrgPosition

let strCompanyName
let strOrgDescription
let strPhoneNumber
let strWebsite
let strPhysicalAddress
let strAddressCity
let strAddressState
let strAddressZip
let strLogo

let strPreOrgID = 'Test Org ID'
let strPreOrgDescription = 'Test Org Discription'
let strPrePhoneNumber = 'Test Org Phone Number'
let strPreWebsite = 'Test Org Website'
let strPrePhysicalAddress = 'Test Org Physical Address'
let strPreAddressCity = 'Test Org City'
let strPreAddressState = 'Test Org State'
let strPreAddressZip ='Test Org Zip'
let strPreLogo = 'Test Org Logo'

let strPrimaryName
let strPrimaryEmail
let strPrimaryPhoneNumber
let strPrimaryOrgPosition
let strSecondaryName
let strSecondaryEmail
let strSecondaryPhoneNumber
let strSecondaryOrgPosition

let strPreSecondaryName = 'Test Secondary Contact Name'
let strPreSecondaryEmail = 'Test Secondary Contact Email'
let strPreSecondaryPhoneNumber = 'Test Secondary Contact Phone'
let strPreSecondaryOrgPosition = 'Test Secondary Contact Org Position'

let strEditServiceName
let strEditServiceDescription
let strEditServiceElegibility
let strEditServiceCounties
let strEditServiceKeywords
let strEditServicePhoneNumber
let strEditServicePhysicalAddress
let strEditServiceAddressCity
let strEditServiceAddressState
let strEditServiceAddressZip
let strEditServiceWebsite
let strEditServiceHours

let strPreEditServiceName = 'Test Service Name'
let strPreEditServiceDescription = 'Test Service Description'
let strPreEditServiceElegibility = 'Test Service Elegibility'
let strPreEditServiceCounties = ['Putnam']
let strPreEditServiceKeywords = ['abuse']
let strPreEditServicePhoneNumber = 'Test Service Phone Number'
let strPreEditServicePhysicalAddress = 'Test Service Address'
let strPreEditServiceAddressCity = 'Test Service City'
let strPreEditServiceAddressState = 'Test Service State'
let strPreEditServiceAddressZip = 'Test Zip'
let strPreEditServiceWebsite = 'Test Service Website'
let strPreEditServiceHours = 'Test Service Hours'

let strAddServiceName
let strAddServiceDescription
let strAddServiceElegibility
let strAddServiceCounties
let strAddServiceKeywords
let strAddServicePhoneNumber
let strAddServicePhysicalAddress
let strAddServiceAddressCity
let strAddServiceAddressState
let strAddServiceAddressZip
let strAddServiceWebsite
let strHoursAdd

let orgArray = []
let serviceArray = []

document.addEventListener('DOMContentLoaded', () => {
  const steps = ['step-1', 'step-2', 'step-3', 'step-4'];
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
    { buttonId: 'btnKeywordsRegAdd', containerId: 'divOuterKeywordsRegAdd' },
    { buttonId: 'btnCountiesReg', containerId: 'divOuterCountiesReg' },
    { buttonId: 'btnCountiesRegAdd', containerId: 'divOuterCountiesRegAdd' }
  ]);

  function setupAllServiceCheckboxes() {
    document.querySelectorAll('.service-block').forEach(serviceBlock => {
      setupSingleServiceCheckboxes(serviceBlock);
    });

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && node.matches('.service-block')) {
              setTimeout(() => setupSingleServiceCheckboxes(node), 100);
            }
          });
        }
      });
    });
    
    observer.observe(document.getElementById('services-container'), {
      childList: true,
      subtree: true
    });
  }

  function setupSingleServiceCheckboxes(serviceBlock) {
    const phoneCheckbox = serviceBlock.querySelector('input[id^="separatePhone"]');
    const phoneContainer = serviceBlock.querySelector('.service-phone-container');
    if (phoneCheckbox && phoneContainer) {
      phoneCheckbox.removeEventListener('change', phoneCheckbox._listener);
      const handler = () => {
        phoneContainer.style.display = phoneCheckbox.checked ? 'block' : 'none';
        if (!phoneCheckbox.checked) {
          const phoneInput = phoneContainer.querySelector('input[type="tel"]');
          if (phoneInput) phoneInput.value = '';
        }
      };
      phoneCheckbox.addEventListener('change', handler);
      phoneCheckbox._listener = handler;
      handler();
    }

    const addressCheckbox = serviceBlock.querySelector('input[id^="separateAddress"]');
    const addressContainer = serviceBlock.querySelector('.service-address-container');
    if (addressCheckbox && addressContainer) {
      addressCheckbox.removeEventListener('change', addressCheckbox._listener);
      const handler = () => {
        addressContainer.style.display = addressCheckbox.checked ? 'block' : 'none';
        if (!addressCheckbox.checked) {
          addressContainer.querySelectorAll('input, select').forEach(field => {
            field.value = '';
          });
        }
      };
      addressCheckbox.addEventListener('change', handler);
      addressCheckbox._listener = handler;
      handler(); 
    }

    // document.querySelector("#separateHours1").addEventListener('click', () => {
    //   if (document.querySelector("#separateHours1").checked = true) {
    //     document.querySelector('#divServiceHoursAdd').style.display = 'inline-block'
    //   }
    //   else {
    //     document.querySelector('#divServiceHoursAdd').style.display = 'none'
    //   }
    // })
  }

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
  setupAllServiceCheckboxes();
  populateHourSelects();

  // Add service button
  if (addServiceBtn) {
    addServiceBtn.addEventListener('click', () => {
      serviceCount++;
      const firstService = document.querySelector('.service-block');
      if (!firstService) return;

      const newService = firstService.cloneNode(true);
      suffixIds(newService, serviceCount);
      newService.setAttribute('data-service', serviceCount);
      // const servicesContainer = document.getElementById('services-container');
      // servicesContainer.insertBefore(newService, addServiceBtn);

      const serviceListContainer = document.getElementById('service-list');
      if (serviceListContainer) {
        serviceListContainer.appendChild(createServiceTab(serviceCount));
        showService(serviceCount);
        updateActiveTab(serviceCount);
      }

      populateHourSelects();
      setupDropdownTogglePairs([
        { buttonId: `btnCountiesReg${serviceCount}`, containerId: `divOuterCountiesReg${serviceCount}` },
        { buttonId: `btnCountiesRegAdd${serviceCount}`, containerId: `divOuterCountiesRegAdd${serviceCount}` },
        { buttonId: `btnKeywordsReg${serviceCount}`, containerId: `divOuterKeywordsReg${serviceCount}` },
        { buttonId: `btnKeywordsRegAdd${serviceCount}`, containerId: `divOuterKeywordsRegAdd${serviceCount}` }
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
      // if (field.id && (field.id.startsWith('serviceName') || field.id.startsWith('serviceDescription'))) {
      //   return false;
      // }
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
        if (!isGroupChecked('[id^="divCountiesRegAdd"]', block)) errors.push(`Counties for Service ${serviceNum}`);
        if (!isGroupChecked('[id^="divKeywordsReg"]', block)) errors.push(`Keywords for Service ${serviceNum}`);
        if (!isGroupChecked('[id^="divKeywordsRegAdd"]', block)) errors.push(`Keywords for Service ${serviceNum}`);
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
        strEditorName = document.getElementById('editorName').value
        strEditorEmail = document.getElementById('editorEmail').value
        strEditorPhoneNumber = document.getElementById('editorPhone').value
        if (document.getElementById('orgDescription').value === ''){
          strEditorOrgPosition = 'N/A'
        }
        else {
          strEditorOrgPosition = document.getElementById('editorPosition').value
        }
        console.log(strEditorName, strEditorEmail, strEditorPhoneNumber, strEditorOrgPosition)
        currentStep = 1;
        showStep(currentStep);
      } else {
        const errorList = errors.map(err => `• ${err}`).join('<br>');
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
        strCompanyName = document.getElementById('companyName').value
        if (document.getElementById('orgDescription').value === ''){
          strOrgDescription = strPreOrgDescription
        }
        else {
          strOrgDescription = document.getElementById('orgDescription').value
        }
        if (document.getElementById('phoneNumber').value == ''){
          strPhoneNumber = strPrePhoneNumber
        }
        else {
          strPhoneNumber = document.getElementById('phoneNumber').value
        }
        if (document.getElementById('website').value == ''){
          strWebsite = strPreWebsite
        }
        else {
          strWebsite = document.getElementById('website').value
        }
        if (document.getElementById('physicalAddress').value == ''){
          strPhysicalAddress = strPrePhysicalAddress
        }
        else {
          strPhysicalAddress = document.getElementById('physicalAddress').value
        }
        if (document.getElementById('cityAddress').value == ''){
          strAddressCity = strPreAddressCity
        }
        else {
          strAddressCity = document.getElementById('cityAddress').value
        }
        if (document.getElementById('statePublic').value == ''){
          strAddressState = strPreAddressState
        }
        else {
          strAddressState = document.getElementById('statePublic').value
        }
        if (document.getElementById('zipPublic').value == ''){
          strAddressZip = strPreAddressZip
        }
        else {
          strAddressZip = document.getElementById('zipPublic').value
        }
        if (document.getElementById('oldUpload').value == ''){
          strLogo = strPreLogo
        }
        else {
          strLogo = document.getElementById('oldUpload').value
        }
        console.log(strCompanyName, strOrgDescription, strPhoneNumber, strWebsite, strPhysicalAddress, strAddressCity, strAddressState, strAddressZip, strLogo)
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
        count = 0
        strPrimaryName = document.getElementById('primaryName').value
        strPrimaryEmail = document.getElementById('primaryEmail').value
        strPrimaryPhoneNumber = document.getElementById('primaryPhone').value
        if (document.getElementById('primaryPosition').value == ''){
          strPrimaryOrgPosition = 'N/A'
        }
        else {
          strPrimaryOrgPosition = document.getElementById('primaryPosition').value
        }
        if (document.getElementById('secondaryName').value == ''){
          strSecondaryName = strPreSecondaryName
        }
        else {
          strSecondaryName = document.getElementById('secondaryName').value
          count ++
        }
        if (document.getElementById('secondaryEmail').value == ''){
          strSecondaryEmail = strPreSecondaryEmail
        }
        else {
          strSecondaryEmail = document.getElementById('secondaryEmail').value
          count ++
        }
        if (document.getElementById('secondaryPhone').value == ''){
          strSecondaryPhoneNumber = strPreSecondaryPhoneNumber
        }
        else {
          strSecondaryPhoneNumber = document.getElementById('secondaryPhone').value
          count ++
        }
        if (document.getElementById('secondaryPosition').value == ''){
          strSecondaryOrgPosition = strPreSecondaryOrgPosition
        }
        else if (document.getElementById('secondaryPosition').value == '' && count == 3) {
          strSecondaryOrgPosition = 'N/A'
        }
        else {
          strSecondaryOrgPosition = document.getElementById('secondaryPosition').value
        }
        console.log(strPrimaryName, strPrimaryEmail, strPrimaryPhoneNumber, strPrimaryOrgPosition, strSecondaryName, strSecondaryEmail, strSecondaryPhoneNumber, strSecondaryOrgPosition)
        currentStep = 3;
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

  const formStep4 = document.getElementById('form-step-4');
  if (formStep4) {
    formStep4.addEventListener('submit', e => {
      e.preventDefault();
      formStep4.classList.add('was-validated');
      let errors = collectFormErrors(formStep4);
      const button = e.submitter;
      if (button.id == 'btnUpdateService') {
        errors = []
      }
      else {
        countyLength = getSelectedKeywords("divOuterCountiesRegAdd")
        if (countyLength.length == 0) {
          errors.push('Counties Offered In')
        }
        keyLength = getSelectedKeywords("divOuterKeywordsRegAdd")
        if (keyLength.length == 0) {
          errors.push('Keywords')
        }
      }
      if (errors.length === 0) {
        if (document.getElementById('serviceNameEdit').value == ''){
          strEditServiceName = strPreEditServiceName
        }
        else {
          strEditServiceName = document.getElementById('serviceNameEdit').value
        }
        if (document.getElementById('serviceDescriptionEdit').value == ''){
          strEditServiceDescription = strPreEditServiceDescription
        }
        else {
          strEditServiceDescription = document.getElementById('serviceDescriptionEdit').value
        }
        if (document.getElementById('serviceCriteriaEdit').value == ''){
          strEditServiceElegibility = strPreEditServiceElegibility
        }
        else {
          strEditServiceElegibility = document.getElementById('serviceCriteriaEdit').value
        }
        countyLength = getSelectedKeywords("divOuterCountiesReg")
        if (countyLength.length == 0){
          strEditServiceCounties = strPreEditServiceCounties
        }
        else {
          strEditServiceCounties = getSelectedKeywords("divOuterCountiesReg")
        }
        keyLength = getSelectedKeywords("divOuterKeywordsReg")
        if (keyLength.length == 0){
          strEditServiceKeywords = strPreEditServiceKeywords
        }
        else {
          strEditServiceKeywords = getSelectedKeywords("divOuterKeywordsReg")
        }
        if (document.getElementById('servicePhoneEdit').value == ''){
          strEditServicePhoneNumber = strPreEditServicePhoneNumber
        }
        else {
          strEditServicePhoneNumber = document.getElementById('servicePhoneEdit').value
        }
        if (document.getElementById('servicePhysicalAddressEdit').value == ''){
          strEditServicePhysicalAddress = strPreEditServicePhysicalAddress
        }
        else {
          strEditServicePhysicalAddress = document.getElementById('servicePhysicalAddressEdit').value
        }
        if (document.getElementById('ServicecityAddressEdit').value == ''){
          strEditServiceAddressCity = strPreEditServiceAddressCity
        }
        else {
          strEditServiceAddressCity = document.getElementById('ServicecityAddressEdit').value
        }
        if (document.getElementById('serviceStateEdit').value == ''){
          strEditServiceAddressState = strPreEditServiceAddressState
        }
        else {
          strEditServiceAddressState = document.getElementById('serviceStateEdit').value
        }
        if (document.getElementById('serviceZipEdit').value == ''){
          strEditServiceAddressZip = strPreEditServiceAddressZip
        }
        else {
          strEditServiceAddressZip = document.getElementById('serviceZipEdit').value
        }
        if (document.getElementById('serviceWebisteEdit').value == ''){
          strEditServiceWebsite = strPreEditServiceWebsite
        }
        else {
          strEditServiceWebsite = document.getElementById('serviceWebisteEdit').value
        }
        if (document.getElementById('updateServiceHours').value == ''){
          strEditServiceHours = strPreEditServiceHours
        }
        else {
          strEditServiceHours = document.getElementById('updateServiceHours').value
        }
        strAddServiceName = document.getElementById('serviceNameAdd').value
        strAddServiceDescription = document.getElementById('serviceDescriptionAdd').value
        if (document.getElementById('serviceCriteriaAdd').value === ''){
          strAddServiceElegibility = 'N/A'
        }
        else {
          strAddServiceElegibility = document.getElementById('serviceCriteriaAdd').value
        }
        strAddServiceCounties = getSelectedKeywords("divOuterCountiesRegAdd")
        strAddServiceKeywords = getSelectedKeywords("divOuterKeywordsRegAdd")
        if (document.getElementById('servicePhone1').value === ''){
          strAddServicePhoneNumber = strPhoneNumber
        }
        else {
          strAddServicePhoneNumber = document.getElementById('servicePhone1').value
        }
        if (document.getElementById('serviceAddressStreet1').value === ''){
          strAddServicePhysicalAddress = strPhysicalAddress
        }
        else {
          strAddServicePhysicalAddress = document.getElementById('serviceAddressStreet1').value
        }
        if (document.getElementById('ServicecityAddressAdd').value === ''){
          strAddServiceAddressCity = strAddressCity
        }
        else {
          strAddServiceAddressCity = document.getElementById('ServicecityAddressAdd').value
        }
        if (document.getElementById('serviceStateAdd').value === ''){
          strAddServiceAddressState = strAddressState
        }
        else {
          strAddServiceAddressState = document.getElementById('serviceStateAdd').value
        }
        if (document.getElementById('serviceZipAdd').value === ''){
          strAddServiceAddressZip = strAddressZip
        }
        else {
          strAddServiceAddressZip = document.getElementById('serviceZipAdd').value
        }
        if (document.getElementById('serviceWebisteAdd').value === ''){
          strAddServiceWebsite = 'N/A'
        }
        else {
          strAddServiceWebsite = document.getElementById('serviceWebisteAdd').value
        }
        if (document.getElementById('addServiceHours').value === ''){
          strHoursAdd = 'N/A'
        }
        else {
          strHoursAdd = document.getElementById('addServiceHours').value
        }
        orgArray = [strPreOrgID, strCompanyName, strOrgDescription, strPhoneNumber, strWebsite, strPhysicalAddress, strAddressCity, strAddressState, strAddressZip, strLogo, strPrimaryName, strPrimaryEmail, strPrimaryPhoneNumber, strPrimaryOrgPosition, strSecondaryName, strSecondaryEmail, strSecondaryPhoneNumber, strSecondaryOrgPosition]
        if (button.id == 'btnUpdateService') {
          serviceArray = [strEditServiceName, strEditServiceDescription, strEditServiceElegibility, strEditServiceCounties, strEditServiceKeywords, strEditServicePhoneNumber, strEditServicePhysicalAddress, strEditServiceAddressCity, strEditServiceAddressState, strEditServiceAddressZip, strEditServiceWebsite, strEditServiceHours]
          addService(orgArray, serviceArray)
        }
        else {
          serviceArray = [strAddServiceName, strAddServiceDescription, strAddServiceElegibility, strAddServiceCounties, strAddServiceKeywords, strAddServicePhoneNumber, strAddServicePhysicalAddress, strAddServiceAddressCity, strAddServiceAddressState, strAddServiceAddressZip, strAddServiceWebsite, strHoursAdd]
          addService(orgArray, serviceArray)
        }
        Swal.fire({
          title: "Success",
          text: "Your request has been submitted. It is pending review.",
          icon: "success"
        }).then((result) => {
          document.getElementById('serviceNameEdit').value = ''
          document.getElementById('serviceDescriptionEdit').value = ''
          document.getElementById('serviceCriteriaEdit').value = ''
          document.getElementById('servicePhoneEdit').value = ''
          document.getElementById('servicePhysicalAddressEdit').value = ''
          document.getElementById('ServicecityAddressEdit').value = ''
          document.getElementById('serviceStateEdit').value = ''
          document.getElementById('serviceZipEdit').value = ''
          document.getElementById('serviceWebisteEdit').value = ''
          document.getElementById('updateServiceHours').value = ''
          document.getElementById('selectService').value = ''
          document.getElementById("form-step-4").reset();

          document.getElementById('serviceNameAdd').value = ''
          document.getElementById('serviceDescriptionAdd').value = ''
          document.getElementById('serviceCriteriaAdd').value = ''
          document.getElementById('servicePhone1').value = ''
          document.getElementById('serviceAddressStreet1').value = ''
          document.getElementById('ServicecityAddressAdd').value = ''
          document.getElementById('serviceStateAdd').value = ''
          document.getElementById('serviceZipAdd').value = ''
          document.getElementById('serviceWebisteAdd').value = ''
          document.getElementById('addServiceHours').value = ''
          formStep4.classList.remove('was-validated');

          let activeForm = document.getElementById("divPage4AddServiceInfo");
          let remove = document.getElementById("btnRemoveServiceBtn");
          let inactiveForm = document.getElementById("divPage4EditServiceInfo");
          let btns = document.getElementById("divFinalSubCanBtn");
          activeForm.style.display = "none"; 
          remove.style.display = "none"; 
          inactiveForm.style.display = "none"; 
          btns.classList.remove("d-none");
          btns.classList.add("d-flex");
        })
      } else {
        const errorList = errors.map(err => `• ${err}`).join('\n');
        Swal.fire({
          title: "Missing Information",
          html: `Please complete the following:<br><br>${errorList.replace(/\n/g, "<br>")}`,
          icon: "error"
        });
      }
    });
  }
  document.getElementById('btnLeave').addEventListener('click', () => {
    window.location.href = `registration_landing.html`
  });

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
  document.querySelector('#step-4 .cancel-btn')?.addEventListener('click', () => {
    currentStep = 2;
    showStep(currentStep);
  });
  document.querySelector('#step-4 .cancel-btn-1')?.addEventListener('click', () => {
    let activeForm = document.getElementById("divPage4AddServiceInfo");
    let remove = document.getElementById("btnRemoveServiceBtn");
    let inactiveForm = document.getElementById("divPage4EditServiceInfo");
    let btns = document.getElementById("divFinalSubCanBtn");
    activeForm.style.display = "none"; 
    remove.style.display = "none"; 
    inactiveForm.style.display = "none"; 
    btns.classList.remove("d-none");
    btns.classList.add("d-flex");
  });
  document.querySelector('#step-4 .cancel-btn-2')?.addEventListener('click', () => {
    let activeForm = document.getElementById("divPage4AddServiceInfo");
    let remove = document.getElementById("btnRemoveServiceBtn");
    let inactiveForm = document.getElementById("divPage4EditServiceInfo");
    let btns = document.getElementById("divFinalSubCanBtn");
    activeForm.style.display = "none"; 
    remove.style.display = "none"; 
    inactiveForm.style.display = "none"; 
    btns.classList.remove("d-none");
    btns.classList.add("d-flex");
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
  function createCheckbox(labelText, container, suffix) {
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
      const response = await fetchApi('/services');
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
          try { strKeywords = JSON.parse(strKeywords.replace(/'/g, '"')); } catch (e) { strKeywords = []; }
        }
        if (Array.isArray(strKeywords)) {
          strKeywords.forEach(tag => arrServiceType.push(tag));
        }
        let strCounties = element.CountiesAvailable;
        if (typeof strCounties === 'string') {
          try { strCounties = JSON.parse(strCounties.replace(/'/g, '"')); } catch (e) { strCounties = []; }
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
        uniqueCounties.forEach(county => createCheckbox(county, countiesContainer, '-step3-1'));
      }
      const countiesContainerAdd = document.getElementById("divCountiesRegAdd");
      if (countiesContainerAdd) {
        uniqueCounties.forEach(county => createCheckbox(county, countiesContainerAdd, '-step3-2'));
      }
      
      // Keywords Step 1
      const keywordsContainerStep1 = document.getElementById("divKeywordsReg1");
      if (keywordsContainerStep1) {
        uniqueServiceTypes.forEach(keyword => createCheckbox(keyword, keywordsContainerStep1, '-step1'));
      }
      
      // Keywords Step 3
      const keywordsContainerStep3 = document.getElementById("divKeywordsReg");
      if (keywordsContainerStep3) {
        uniqueServiceTypes.forEach(keyword => createCheckbox(keyword, keywordsContainerStep3, '-step3-1'));
      }
      const keywordsContainerStep3Add = document.getElementById("divKeywordsRegAdd");
      if (keywordsContainerStep3) {
        uniqueServiceTypes.forEach(keyword => createCheckbox(keyword, keywordsContainerStep3Add, '-step3-2'));
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
  document.getElementById('selectService').addEventListener('change', (e) => {
  let activeForm = document.getElementById("divPage4EditServiceInfo");
  let remove = document.getElementById("btnRemoveServiceBtn");
  let inactiveForm = document.getElementById("divPage4AddServiceInfo");
  let btns = document.getElementById("divFinalSubCanBtn");
  console.log(e.target.value)
  if (e.target.value != '') {
    activeForm.style.display = "block"; 
    remove.style.display = "block"; 
    inactiveForm.style.display = "none"; 
    btns.classList.add("d-none");
  }
  else {
    activeForm.style.display = "none"; 
    remove.style.display = "none"; 
    inactiveForm.style.display = "none"; 
    btns.classList.remove("d-none");
    btns.classList.add("d-flex");
  }
})

document.querySelector('#btnRemoveServiceBtn').addEventListener("click", (e) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You are about to delete a service. Once a service has been deleted it cannot be recovered.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Remove Service",
    cancelButtonText: "Cancel"
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleted!",
        text: "This service has been deleted.",
        icon: "success"
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire({
        title: "Cancelled",
        text: "This service will not be removed",
        icon: "error"
      });
    }
  });
})

document.querySelector('#addServiceBtn').addEventListener("click", (e) => {
  let activeForm = document.getElementById("divPage4AddServiceInfo");
  let remove = document.getElementById("btnRemoveServiceBtn");
  let inactiveForm = document.getElementById("divPage4EditServiceInfo");
  let btns = document.getElementById("divFinalSubCanBtn");
  activeForm.style.display = "block"; 
  remove.style.display = "none"; 
  inactiveForm.style.display = "none"; 
  btns.classList.add("d-none");
})

// Returns an array of all selected check boxed from a container
function getSelectedKeywords(containerId) {
    return Array.from(
        document.querySelectorAll(`#${containerId} input[type="checkbox"]:checked`)
    ).map(el => el.value);
}

// document.querySelector('#editOptions').addEventListener("click", (e) => {
//   const name = document.getElementById('primaryName');
//   const email = document.getElementById('primaryEmail');
//   const phone = document.getElementById('primaryPhone');
//   const position = document.getElementById('primaryPosition');
//   const isChecked = document.getElementById('editOptions').checked;
//   console.log(isChecked)
//   if (isChecked) {
//     console(name.value, email.value, phone.value, position.value)
//     name.value = strEditorName;
//     email.value = strEditorEmail;
//     phone.value = strEditorPhoneNumber;
//     position.value = strEditorOrgPosition;

//     // Disable inputs
//     name.disabled = true;
//     email.disabled = true;
//     phone.disabled = true;
//     position.disabled = true;
//   }
// })

// document.getElementById('same-info-checkbox').addEventListener('change', (e) => {
//   const name = document.getElementById('primaryContactName');
//   const email = document.getElementById('primaryContactEmail');
//   const phone = document.getElementById('primaryContactPhone');
//   const position = document.getElementById('primaryContactPosition');
//   const isChecked = e.target.checked;

//   if (isChecked) {
//     // Fill inputs
//     name.value = strEditorName;
//     email.value = strEditorEmail;
//     phone.value = strEditorPhoneNumber;
//     position.value = strEditorOrgPosition;

//     // Disable inputs
//     name.disabled = true;
//     email.disabled = true;
//     phone.disabled = true;
//     position.disabled = true;

//   } else {
//     // Restore previous values
//     name.value = originalValues.name || "";
//     email.value = originalValues.email || "";
//     phone.value = originalValues.phone || "";
//     position.value = originalValues.position || "";

//     // Re-enable inputs
//     name.disabled = false;
//     email.disabled = false;
//     phone.disabled = false;
//     position.disabled = false;
//   }
// });
});

async function addService(orgArray, serviceArray) {
  try{
    let data = {
        "organization": {
          "id": `${orgArray[0]}`,
          "company_name": `${orgArray[1]}`,
          "organization_description": `${orgArray[2]}`,
          "phone": `${orgArray[3]}`,
          "website": `${orgArray[4]}`,
          "address1": `${orgArray[5]}`,
          "city_public": `${orgArray[6]}`,
          "state_public": `${orgArray[7]}`,
          "zip_public": `${orgArray[8]}`,
          "logo": `${orgArray[9]}`,
          "primary_name": `${orgArray[10]}`,
          "primary_email": `${orgArray[11]}`,
          "primary_phone": `${orgArray[12]}`,
          "primary_orgposition": `${orgArray[13]}`,
          "secondary_name": `${orgArray[14]}`,
          "secondary_email": `${orgArray[15]}`,
          "secondary_phone": `${orgArray[16]}`,
          "secondary_orgposition": `${orgArray[17]}`
        },
        "service": {
          "company_id": `${orgArray[0]}`,
          "service_name": `${serviceArray[0]}`,
          "service_description": `${serviceArray[1]}`,
          "service_criteria": `${serviceArray[2]}`,
          "service_counties": `${serviceArray[3]}`,
          "service_keywords": `${serviceArray[4]}`,
          "service_phone": `${serviceArray[5]}`,
          "service_address_street": `${serviceArray[6]}`,
          "service_city": `${serviceArray[7]}`,
          "service_state": `${serviceArray[8]}`,
          "service_zip": `${serviceArray[9]}`,
          "service_website": `${serviceArray[10]}`,
          "organization_hours": `${serviceArray[11]}`,
        } 
      }
    console.log(data)
    const response = await fetchApi(`/request-create-service`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json', // Sending JSON
          'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON response
    const result = await response.json();
    console.log('Data sent successfully:', result);

  } catch (objError){
    console.log('Error sending request', objError)
  }
}