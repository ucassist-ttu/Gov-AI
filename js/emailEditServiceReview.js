const params = new URLSearchParams(window.location.search);
const serviceId = params.get("id");

document.addEventListener('DOMContentLoaded', async () => {
    // CALL ORGANIZATION ENDPOINT TO GET INFORMATION
    // calling new information
    const newResponse = await fetch( // US68f12a8c1800246b
        `http://s1092595647.onlinehome.us/api/index.php?route=/update-service&uuid=USf55e056d586e7643`
    );
    const newData = await newResponse.json();
    const editorData = newData.editor // editor information
    const UpdatedOrgData = newData.organization // updated organization information
    const UpdatedServiceData = newData.organization // updated service information
    // calling old information
    const oldResponse = await fetch(
        `http://s1092595647.onlinehome.us/api/index.php?route=/service&id=570`
    );
    const currData = await oldResponse.json();
    const currOrgData = currData.organization // updated organization information
    const currServiceData = currData.organization // updated service information

    console.log(currData)
    console.log(newData)

    loadNew(currData, newData) // populating the content into the forms

    //submit button
    const btnUpdate = document.getElementById('btnUpdateDatabase');

    btnUpdate.addEventListener('click', async () => {
        const data = {

        }

        // calling update endpoint
        await fetchApi("/request-update-service", {
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
        // populate editor & updated information
        const servEditFormResponse = await fetchApi(`/api/index.php?route=/service-request&uuid=${service_id}`);
        const servEditFormData = await servEditFormResponse.json();
        const editorInfo = servEditFormData.editor
        const updatedServiceInfo = servEditFormData.service;
        const servUpdatedData =[]

        if (servEditFormData.organization) {
            servUpdatedData.push(servEditFormData.organization);
        }
        if (servEditFormData.service) {
            servUpdatedData.push(servEditFormData.service);
        }

        // get current service information
        const servResponse = await fetchApi(`/service?id=${service_id}`);
        const servCurrData = await servResponse.json();

        displayform(servCurrData, servUpdatedData);

    } catch (err) {
        console.error(err);
    }
}

function loadNewService(currInfo, newInfo) {
    console.log(currInfo, newInfo);
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

    if (newInfo.length == 2){ // IF there are two sets of new information - service & organization
        document.getElementById("updatedCompanyName").value = newInfo[1].company_name;
        document.getElementById("updatedOrgDescription").value = newInfo[1].organization_description;
        document.getElementById("updatedPhone").value = newInfo[1].phone;
        document.getElementById("updatedWebsite").value = newInfo[1].website;
        document.getElementById("updatedPhysicalAddress").value = newInfo[1].address1;
        document.getElementById("updatedCityPublic").value = newInfo[1].city_public;
        document.getElementById("updatedStatePublic").value = newInfo[1].state_public;
        document.getElementById("updatedZipPublic").value = newInfo[1].zip_public;
        document.getElementById("updatedOrgKeywords").value = newInfo[1].keywords || "";
        document.getElementById("updatedOrgHours").value = newInfo[1].organization_hours || "";

        document.getElementById("updatedPrimaryName").value = newInfo[1].primary_name;
        document.getElementById("updatedPrimaryEmail").value = newInfo[1].primary_email;
        document.getElementById("updatedPrimaryPhone").value = newInfo[1].primary_phone;
        document.getElementById("updatedPrimaryPosition").value = newInfo[1].primary_orgposition;

        document.getElementById("updatedSecondaryName").value = newInfo[1].secondary_name;
        document.getElementById("updatedSecondaryEmail").value = newInfo[1].secondary_email;
        document.getElementById("updatedSecondaryPhone").value = newInfo[1].secondary_phone;
        document.getElementById("updatedSecondaryPosition").value = newInfo[1].secondary_orgposition;
    }
    document.getElementById("updatedServiceName").value = newInfo[0].service_name;
    document.getElementById("updatedServiceDescription").value = newInfo[0].service_description;
    document.getElementById("updatedServiceCriteria").value = newInfo[0].service_criteria;
    document.getElementById("updatedServiceCounties").value = newInfo[0].service_counties;
    document.getElementById("updatedServiceKeywords").value = newInfo[0].service_keywords;
    document.getElementById("updatedServicePhone1").value = newInfo[0].service_phone;
    document.getElementById("updatedServiceAddressStreet1").value = newInfo[0].service_address_street;
    document.getElementById("updatedServiceCity1").value = newInfo[0].service_city;
    document.getElementById("updatedServiceState1").value = newInfo[0].service_state;
    document.getElementById("updatedServiceZip1").value = newInfo[0].service_zip;
    document.getElementById("updatedServiceHours").value = newInfo[0].organization_hours;
}
