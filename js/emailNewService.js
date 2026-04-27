import { getServiceForReview } from "../backend/fake_backend/dbNewServices.js";

const params = new URLSearchParams(window.location.search);
const serviceId = params.get("id");

// CALL ENDPOINT TO UPDATE DATABASE
document.addEventListener('DOMContentLoaded', () => {
  // CALL REFERRAL SERVICE ENDPOINT TO GET SERVICE ID
  getServiceForReview(serviceId).then((service) => {
    console.log("Found service:", service);

    document.getElementById('newCompanyName').value = service.firstName;
    document.getElementById('newOrgDescription').value = service.lastName;
    document.getElementById('newPhone').value = service.email;
    document.getElementById('newWebsite').value = service.phone;
    document.getElementById('newPhysicalAddress').value = service.message;
    document.getElementById('newCityPublic').value = service.firstName;
    document.getElementById('newStatePublic').value = service.lastName;
    document.getElementById('newZipPublic').value = service.email;
    document.getElementById('newOrgKeywords').value = service.phone;
    document.getElementById('newOrgHours').value = service.message;

    document.getElementById('newPrimaryName').value = service.firstName;
    document.getElementById('newPrimaryEmail').value = service.email;
    document.getElementById('newPrimaryPhone').value = service.phone;
    document.getElementById('newPrimaryPosition').value = service.message;

    document.getElementById('newSecondaryName').value = service.firstName;
    document.getElementById('newSecondaryEmail').value = service.email;
    document.getElementById('newSecondaryPhone').value = service.phone;
    document.getElementById('newSecondaryPosition').value = service.message;
  })

  getServiceForReview(serviceId).then((service) => {
    console.log("Found service:", service);

    document.getElementById('newServiceName').value = service.firstName;
    document.getElementById('newServiceDescription').value = service.email;
    document.getElementById('newServiceCriteria').value = service.phone;
    document.getElementById('newServiceCounties').value = service.message;
    document.getElementById('newServiceKeywords').value = service.firstName;
    document.getElementById('newServicePhone1').value = service.email;
    document.getElementById('newServiceAddressStreet1').value = service.phone;
    document.getElementById('newServiceCity1').value = service.message;
    document.getElementById('newServiceState1').value = service.firstName;
    document.getElementById('newServiceZip1').value = service.email;
    document.getElementById('newServiceHours').value = service.phone;
    document.getElementById('newLogoFile').value = service.message;});
  
  })



















import { addServiceToPendingDB, addServiceToServicesDB, getServiceForReview} from "../backend/fake_backend/dbNewServices.js";

// async function addServiceToDB(id) {  
//     //LOADING TO DATABASE
//     addServiceToServicesDB(id);

//     // connect service to organization foreign key maybe???
//     //   formData.id

//     console.log("Service added to database:", formData);

//     // remove later
//     localStorage.setItem(
//     "pendingService",
//     JSON.stringify(formData)
//     );
// }

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('main form');

  // collecting information 
  getReferralByID(serviceId).then((service) => {
      console.log("Found service:", service);
  
      document.getElementById('emailFirstName').value = service.firstName;
      document.getElementById('emailLastName').value = service.lastName;
      document.getElementById('emailEmail').value = service.email;
      document.getElementById('emailPhone').value = service.phone;
      document.getElementById('emailMessage').value = service.message;
    });

  // function getFieldLabel(input) {
  //   if (input.id) {
  //     const label = document.querySelector(`label[for="${input.id}"]`);
  //     if (label) return label.textContent.replace('*', '').trim();
  //   }
  //   return input.name || input.id || 'Field';
  // }
  // function collectFormErrors(form) {
  //   let errors = [];
  //   const requiredFields = form.querySelectorAll('[required]');
  //   requiredFields.forEach(field => {
  //     if (field.type === 'checkbox') return;
  //     if (!field.checkValidity()) {
  //       errors.push(getFieldLabel(field));
  //     }
  //   });
  //   return errors;
  // }
  // const phoneInput = document.getElementById('servicePhone');
  // if (phoneInput) {
  //   phoneInput.addEventListener('input', (e) => {
  //     let value = e.target.value.replace(/\D/g, '');
  //     if (value.length > 0) {
  //       if (value.length <= 3) {
  //         value = `(${value}`;
  //       } else if (value.length <= 6) {
  //         value = `(${value.substring(0, 3)}) ${value.substring(3)}`;
  //       } else {
  //         value = `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6, 10)}`;
  //       }
  //     }
  //     e.target.value = value;
  //   });
  // }



  document.getElementById('serviceSubmit').addEventListener('click', async (e) => {
-    e.preventDefault();
    form.classList.add('was-validated');
    const errors = collectFormErrors(form);
    if (errors.length === 0) {
      try{

        await addServiceToPendingDB()

        swal("Success", "Service(s) submitted successfully!", "success");
        form.reset();
        form.classList.remove('was-validated');
      } catch (err) {
        swal("Error", "Something went wrong saving the service(s).", "error");
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
      first_name: document.getElementById('orgContactFirstName').value,
      last_name: document.getElementById('serviceLastName').value,
      email: document.getElementById("serviceEmail").value,
      phone: edocument.getElementById("servicePhone").value,
      message: document.getElementById("serviceMessage").value
    }
  );
}