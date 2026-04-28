import {getServiceForReview, servicesDB } from "../backend/fake_backend/dbNewServices.js";
import { getOrgForService } from "../backend/fake_backend/dbOrganization.js";

const params = new URLSearchParams(window.location.search);
const serviceId = params.get("id");
console.log(servicesDB)

// CALL ENDPOINT TO UPDATE DATABASE
document.addEventListener('DOMContentLoaded', () => {
  // CALL ORGANIZATION ENDPOINT TO GET INFORMATION
  getOrgForService(serviceId).then((organization) => {
    console.log("Found organization:", organization);

    document.getElementById('newCompanyName').value = organization.company_name;
    document.getElementById('newOrgDescription').value = organization.organization_description;
    document.getElementById('newPhone').value = organization.phone;
    document.getElementById('newWebsite').value = organization.website;
    document.getElementById('newPhysicalAddress').value = organization.address1;
    document.getElementById('newCityPublic').value = organization.city_public;
    document.getElementById('newStatePublic').value = organization.state_public;
    document.getElementById('newZipPublic').value = organization.zip_public;
    document.getElementById('newOrgKeywords').value = organization.organization_description;
    document.getElementById('newOrgHours').value = organization.phone;

    document.getElementById('newPrimaryName').value = organization.primary_name;
    document.getElementById('newPrimaryEmail').value = organization.primary_email;
    document.getElementById('newPrimaryPhone').value = organization.primary_phone;
    document.getElementById('newPrimaryPosition').value = organization.primary_position;

    document.getElementById('newSecondaryName').value = organization.secondary_name;
    document.getElementById('newSecondaryEmail').value = organization.secondary_email;
    document.getElementById('newSecondaryPhone').value = organization.secondary_phone;
    document.getElementById('newSecondaryPosition').value = organization.secondary_position;
  })

  getServiceForReview(serviceId).then((service) => {
    document.getElementById('newServiceName').value = service.service_name;
    document.getElementById('newServiceDescription').value = service.service_description;
    document.getElementById('newServiceCriteria').value = service.service_criteria;
    document.getElementById('newServiceCounties').value = service.service_county;
    document.getElementById('newServiceKeywords').value = service.service_keywords;
    document.getElementById('newServicePhone1').value = service.service_phone;
    document.getElementById('newServiceAddressStreet1').value = service.service_address_street;
    document.getElementById('newServiceCity1').value = service.service_city;
    document.getElementById('newServiceState1').value = service.service_state;
    document.getElementById('newServiceZip1').value = service.service_zip;
    document.getElementById('newServiceHours').value = service.service_phone;
    document.getElementById('newLogoFile').value = service.logo_file;});
  
  })



















// import { addServiceToPendingDB, addServiceToServicesDB, getServiceForReview} from "../backend/fake_backend/dbNewServices.js";

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

// document.addEventListener('DOMContentLoaded', () => {
//   const form = document.querySelector('main form');

//   // collecting information 
//   getServiceForReview(serviceId).then((service) => {
//       console.log("Found service:", service);
  
//       document.getElementById('emailFirstName').value = service.firstName;
//       document.getElementById('emailLastName').value = service.lastName;
//       document.getElementById('emailEmail').value = service.email;
//       document.getElementById('emailPhone').value = service.phone;
//       document.getElementById('emailMessage').value = service.message;
//     });

// document.getElementById('btnUpdateDatabase').addEventListener('click', async (e) => {
//     e.preventDefault();
//     form.classList.add('was-validated');
//     const errors = collectFormErrors(form);
//     if (errors.length === 0) {
//       try{

//         await addServiceToServicesDB(serviceId)

//         swal("Success", "Service(s) submitted successfully!", "success");
//         form.reset();
//         form.classList.remove('was-validated');
//       } catch (err) {
//         swal("Error", "Something went wrong saving the service(s).", "error");
//         console.error(err);
//       }
//     } else {
//       const errorList = errors.map(err => `• ${err}`).join('\n');
//       swal("Missing Information", `Please complete the following:\n\n${errorList}`, "error");
//       // const firstInvalid = form.querySelector(':invalid');
//       // if (firstInvalid) firstInvalid.focus();
//     }
//   });
// });