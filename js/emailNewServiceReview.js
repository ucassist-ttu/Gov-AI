// ASK FOR CHANGED ENDPOINTS - no more pending organization and services
const params = new URLSearchParams(window.location.search);
const serviceId = params.get('uuid');

// CALL ENDPOINT TO ADD TO DATABASE
document.addEventListener('DOMContentLoaded', () => {
  // CALL ORGANIZATION ENDPOINT TO GET INFORMATION
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

async function sendToDB(org, service){
  try{
    //sending to database
    const response = await fetchApi(
      `/create-service-with-organization?uuid=${serviceId}`,
      { method: "POST" }
    );

    // Parse the JSON response
    const result = await response.json();
    console.log('Data sent successfully');

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
