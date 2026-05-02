const params = new URLSearchParams(window.location.search);
const serviceId = params.get("id");

document.addEventListener('DOMContentLoaded', async () => {
    if (serviceId) {
        await callServicePage(serviceId);
    }

    const btnUpdate = document.getElementById('btnUpdateDatabase');

    btnUpdate.addEventListener('click', async () => {
        await fetchApi("/request-create-service", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        await fetchApi("/request-create-organization", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
    });
});

async function callServicePage(service_id) {
    try {
        const servResponse = await fetchApi(`/service?id=${service_id}`);
        const servCurrData = await servResponse.json();

        const servUpdatedResponse = await fetchApi(`/service-request?id=${service_id}`);
        const servUpdatedData = await servUpdatedResponse.json();

        displayform(servCurrData, servUpdatedData);

    } catch (err) {
        console.error(err);
    }
}

function displayform(currInfo, newInfo) {
    document.getElementById("oldCompanyName").value = currInfo.company_name;
    document.getElementById("oldOrgDescription").value = currInfo.organization_description;
    document.getElementById("oldPhone").value = currInfo.phone;
    document.getElementById("oldWebsite").value = currInfo.website;
    document.getElementById("oldPhysicalAddress").value = currInfo.address1;
    document.getElementById("oldCityPublic").value = currInfo.city_public;
    document.getElementById("oldStatePublic").value = currInfo.state_public;
    document.getElementById("oldZipPublic").value = currInfo.zip_public;
    document.getElementById("oldOrgKeywords").value = currInfo.keywords || "";
    document.getElementById("oldOrgHours").value = currInfo.organization_hours || "";

    document.getElementById("oldPrimaryName").value = currInfo.primary_name;
    document.getElementById("oldPrimaryEmail").value = currInfo.primary_email;
    document.getElementById("oldPrimaryPhone").value = currInfo.primary_phone;
    document.getElementById("oldPrimaryPosition").value = currInfo.primary_orgposition;

    document.getElementById("oldSecondaryName").value = currInfo.secondary_name;
    document.getElementById("oldSecondaryEmail").value = currInfo.secondary_email;
    document.getElementById("oldSecondaryPhone").value = currInfo.secondary_phone;
    document.getElementById("oldSecondaryPosition").value = currInfo.secondary_orgposition;

    document.getElementById("oldServiceName").value = currInfo.service_name;
    document.getElementById("oldServiceDescription").value = currInfo.service_description;
    document.getElementById("oldServiceCriteria").value = currInfo.service_criteria;
    document.getElementById("oldServiceCounties").value = currInfo.service_counties;
    document.getElementById("oldServiceKeywords").value = currInfo.service_keywords;
    document.getElementById("oldServicePhone1").value = currInfo.service_phone;
    document.getElementById("oldServiceAddressStreet1").value = currInfo.service_address_street;
    document.getElementById("oldServiceCity1").value = currInfo.service_city;
    document.getElementById("oldServiceState1").value = currInfo.service_state;
    document.getElementById("oldServiceZip1").value = currInfo.service_zip;
    document.getElementById("oldServiceHours").value = currInfo.organization_hours;

    document.getElementById("updatedCompanyName").value = newInfo.company_name;
    document.getElementById("updatedOrgDescription").value = newInfo.organization_description;
    document.getElementById("updatedPhone").value = newInfo.phone;
    document.getElementById("updatedWebsite").value = newInfo.website;
    document.getElementById("updatedPhysicalAddress").value = newInfo.address1;
    document.getElementById("updatedCityPublic").value = newInfo.city_public;
    document.getElementById("updatedStatePublic").value = newInfo.state_public;
    document.getElementById("updatedZipPublic").value = newInfo.zip_public;
    document.getElementById("updatedOrgKeywords").value = newInfo.keywords || "";
    document.getElementById("updatedOrgHours").value = newInfo.organization_hours || "";

    document.getElementById("updatedPrimaryName").value = newInfo.primary_name;
    document.getElementById("updatedPrimaryEmail").value = newInfo.primary_email;
    document.getElementById("updatedPrimaryPhone").value = newInfo.primary_phone;
    document.getElementById("updatedPrimaryPosition").value = newInfo.primary_orgposition;

    document.getElementById("updatedSecondaryName").value = newInfo.secondary_name;
    document.getElementById("updatedSecondaryEmail").value = newInfo.secondary_email;
    document.getElementById("updatedSecondaryPhone").value = newInfo.secondary_phone;
    document.getElementById("updatedSecondaryPosition").value = newInfo.secondary_orgposition;

    document.getElementById("updatedServiceName").value = newInfo.service_name;
    document.getElementById("updatedServiceDescription").value = newInfo.service_description;
    document.getElementById("updatedServiceCriteria").value = newInfo.service_criteria;
    document.getElementById("updatedServiceCounties").value = newInfo.service_counties;
    document.getElementById("updatedServiceKeywords").value = newInfo.service_keywords;
    document.getElementById("updatedServicePhone1").value = newInfo.service_phone;
    document.getElementById("updatedServiceAddressStreet1").value = newInfo.service_address_street;
    document.getElementById("updatedServiceCity1").value = newInfo.service_city;
    document.getElementById("updatedServiceState1").value = newInfo.service_state;
    document.getElementById("updatedServiceZip1").value = newInfo.service_zip;
    document.getElementById("updatedServiceHours").value = newInfo.organization_hours;
}













// import { getReferralByID } from "../backend/fake_backend/dbReferrals.js";

// const params = new URLSearchParams(window.location.search);
// const serviceId = params.get("id");

// // CALL ENDPOINT TO UPDATE DATABASE
// document.addEventListener('DOMContentLoaded', () => {
//   // CALL REFERRAL SERVICE ENDPOINT TO GET SERVICE ID
//   getReferralByID(serviceId).then((service) => {
//     console.log("Found service:", service);

//     document.getElementById('emailFirstName').value = service.firstName;
//     document.getElementById('emailLastName').value = service.lastName;
//     document.getElementById('emailEmail').value = service.email;
//     document.getElementById('emailPhone').value = service.phone;
//     document.getElementById('emailMessage').value = service.message;
//   });
// })
