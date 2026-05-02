// ASK FOR CHANGED ENDPOINTS - no more pending organization and services
const params = new URLSearchParams(window.location.search);
const serviceId = params.get('uuid');

console.log("hello")
console.log(serviceId)

// CALL ENDPOINT TO ADD TO DATABASE
document.addEventListener('DOMContentLoaded', () => {
  // CALL ORGANIZATION ENDPOINT TO GET INFORMATION
  // getOrgForService(serviceId).then((organization) => { http://s1092595647.onlinehome.us/api/index.php?route=/create-service-with-organization&uuid=NOSd976337be3274fb4
  // const orgResponse = fetchAPI(`/create-service-with-organization&uuid=NOSd976337be3274fb4`)
  // console.log(orgResponse)
  const data = loadService()
  const serviceData = data.service
  const orgData = data.organization
  // adds service to database once aprove button is clicked
  document.getElementById('btnUpdateDatabase').addEventListener('click', async (e) => {
    sendToDB(orgData,serviceData)
  });
})


async function loadService() {
  const response = await fetch(
    `http://s1092595647.onlinehome.us/api/index.php?route=/create-service-with-organization&uuid=${serviceId}`
  );

  const data = await response.json();
  const service = data.services
  const org = data.organization
  console.log(data)
  console.log(service);
  console.log(org);
  // DISPLAYING NEW INFORMATION
  // company information
  document.getElementById('newCompanyName').value = org.company_name;
  document.getElementById('newOrgDescription').value = org.organization_description;
  document.getElementById('newPhone').value = org.phone;
  document.getElementById('newWebsite').value = org.website;
  document.getElementById('newPhysicalAddress').value = org.address1;
  document.getElementById('newCityPublic').value = org.city_public;
  document.getElementById('newStatePublic').value = org.state_public;
  document.getElementById('newZipPublic').value = org.zip_public;
  document.getElementById('newOrgKeywords').value = org.organization_description;
  document.getElementById('newOrgHours').value = org.phone;

  document.getElementById('newPrimaryName').value = org.primary_name;
  document.getElementById('newPrimaryEmail').value = org.primary_email;
  document.getElementById('newPrimaryPhone').value = org.primary_phone;
  document.getElementById('newPrimaryPosition').value = org.primary_position;

  document.getElementById('newSecondaryName').value = org.secondary_name;
  document.getElementById('newSecondaryEmail').value = org.secondary_email;
  document.getElementById('newSecondaryPhone').value = org.secondary_phone;
  document.getElementById('newSecondaryPosition').value = org.secondary_position;
  
  // service organization
  document.getElementById('newServiceName').value = service[0].service_name;
  document.getElementById('newServiceDescription').value = service[0].service_description;
  document.getElementById('newServiceCriteria').value = service[0].service_criteria;
  document.getElementById('newServiceCounties').value = service[0].service_county;
  document.getElementById('newServiceKeywords').value = service[0].service_keywords;
  document.getElementById('newServicePhone1').value = service[0].service_phone;
  document.getElementById('newServiceAddressStreet1').value = service[0].service_address_street;
  document.getElementById('newServiceCity1').value = service[0].service_city;
  document.getElementById('newServiceState1').value = service[0].service_state;
  document.getElementById('newServiceZip1').value = service[0].service_zip;
  document.getElementById('newServiceHours').value = service[0].service_phone;
  document.getElementById('newLogoFile').value = service[0].logo_file;

  return data
}


// service = id
// org id = 


async function sendToDB(org, service){
  try{
    //sending to database
    const response = await fetchApi(
      `/create-service-with-organization?uuid=${serviceId}`,
      { method: "POST" }
    );
    // const orgResponse = await fetch(`http://s1092595647.onlinehome.us/api/index.php?route=/create-organization`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify(org)
    // })
    // console.log(orgResponse)

    // Parse the JSON response
    const result = await response.json();
    console.log('Data sent successfully:', result);

    // const serviceResponse = await fetch(`http://s1092595647.onlinehome.us/api/index.php?route=/create-service&uuid=${org.id}`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify(service)
    // })
    // console.log(serviceResponse)

    // // Parse the JSON response
    // const finalResult =  await serviceResponse.json();
    // console.log('Data sent successfully:', finalResult);


  }catch(err){
    console.error("ERROR:", err);
  }

  Swal.fire({
          title: "Success",
          text: "This service had been approved and will now be available for people to access.",
          icon: "success"
        }).then((result) => {
          window.location.href = `registration_landing.html`
        })
}














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

//          addServiceToServicesDB(serviceId)

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