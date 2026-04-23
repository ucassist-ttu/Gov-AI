import { addService } from "../backend/fake_backend/dbNewServices.js";

async function addServiceToDB(id) {  
    //LOADING TO DATABASE
    addService(id);

    // connect service to organization foreign key maybe???
    //   formData.id

    console.log("Service added to database:", formData);

    // remove later
    localStorage.setItem(
    "pendingService",
    JSON.stringify(formData)
    );
}

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
  const phoneInput = document.getElementById('referPhone');
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
  document.getElementById('referSubmit').addEventListener('click', async (e) => {
-    e.preventDefault();
    form.classList.add('was-validated');
    const errors = collectFormErrors(form);
    if (errors.length === 0) {
      try{

        await addReferralToDB()

        swal("Success", "Service referral form submitted successfully!", "success");
        form.reset();
        form.classList.remove('was-validated');
      } catch (err) {
        swal("Error", "Something went wrong saving the referral.", "error");
        console.error(err);
      }
    } else {
      const errorList = errors.map(err => `• ${err}`).join('\n');
      swal("Missing Information", `Please complete the following:\n\n${errorList}`, "error");
      // const firstInvalid = form.querySelector(':invalid');
      // if (firstInvalid) firstInvalid.focus();
    }
  });
});

//SEND EMAIL JS

//CHANGE THESE IDs AS SOON
emailjs.init("6IcAOL0TqI6UDHL-b");// EmailJS public key - found on https://dashboard.emailjs.com/admin/account
function sendEmail(){
  logFormData(); // 👈 run this before sending email

  emailjs.send(
    "service_9byagl9",  // EmailJS service ID - found on https://dashboard.emailjs.com/admin under UCAssist Test
    "template_204azdh", // EmailJS template ID - found on https://dashboard.emailjs.com/admin/templates under Auto-Reply
    {
      first_name: document.getElementById('referFirstName').value,
      last_name: document.getElementById('referLastName').value,
      email: document.getElementById("referEmail").value,
      phone: edocument.getElementById("referPhone").value,
      message: document.getElementById("referMessage").value
    }
  );
}