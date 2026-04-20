//CHANGE THESE IDs AS SOON
emailjs.init("6IcAOL0TqI6UDHL-b");// EmailJS public key - found on https://dashboard.emailjs.com/admin/account

logFormData(); // 👈 run this before sending email


emailjs.send(
    "service_9byagl9",  // EmailJS service ID - found on https://dashboard.emailjs.com/admin under UCAssist Test
    "template_204azdh", // EmailJS template ID - found on https://dashboard.emailjs.com/admin/templates under Auto-Reply
    {
    company_name: document.querySelector('[data-name="Company Name Input"]').value,
    organization_description: document.querySelector('[data-name="Organization Description Input"]').value,
    phone: document.getElementById("phone").value,
    website: document.getElementById("website").value,
    address1: document.getElementById("physicalAddress").value,
    city_public: document.getElementById("cityPublic").value,
    state_public: document.getElementById("statePublic").value,
    zip_public: document.getElementById("zipPublic").value,

    primary_name: document.getElementById("primaryName").value,
    primary_email: document.getElementById("primaryEmail").value,
    primary_phone: document.getElementById("primaryPhone").value,
    primary_position: document.getElementById("primaryPosition").value,

    secondary_name: document.getElementById("secondaryName").value,
    secondary_email: document.getElementById("secondaryEmail").value,
    secondary_phone: document.getElementById("secondaryPhone").value,
    secondary_position: document.getElementById("secondaryPosition").value,

    service_name: document.getElementById("serviceName").value,
    service_description: document.getElementById("serviceDescription").value,
    service_criteria: document.getElementById("serviceCriteria").value,

    // you'll need to build these manually:
    org_keywords: getSelectedKeywords(),
    service_keywords: getSelectedServiceKeywords(),
    service_counties: getSelectedCounties(),
    org_hours: getOrgHours(),
    service_hours: getServiceHours(),

    service_phone: document.getElementById("servicePhone1")?.value || "",
    service_address_street: document.getElementById("serviceAddressStreet1")?.value || "",
    service_city: document.getElementById("serviceCity1")?.value || "",
    service_state: document.getElementById("serviceState1")?.value || "",
    service_zip: document.getElementById("serviceZip1")?.value || "",

    logo_file: document.getElementById("upload")?.files[0]?.name || "No file uploaded"
    });

    function logFormData() {
  const data = {
    // --- ORG PUBLIC ---
    company_name: document.querySelector('[data-name="Company Name Input"]')?.value,
    organization_description: document.querySelector('[data-name="Organization Description Input"]')?.value,
    phone: document.getElementById("phone")?.value,
    website: document.getElementById("website")?.value,
    address1: document.getElementById("physicalAddress")?.value,
    city_public: document.getElementById("cityPublic")?.value,
    state_public: document.getElementById("statePublic")?.value,
    zip_public: document.getElementById("zipPublic")?.value,

    // --- CONTACTS ---
    primary_name: document.getElementById("primaryName")?.value,
    primary_email: document.getElementById("primaryEmail")?.value,
    primary_phone: document.getElementById("primaryPhone")?.value,
    primary_position: document.getElementById("primaryPosition")?.value,

    secondary_name: document.getElementById("secondaryName")?.value,
    secondary_email: document.getElementById("secondaryEmail")?.value,
    secondary_phone: document.getElementById("secondaryPhone")?.value,
    secondary_position: document.getElementById("secondaryPosition")?.value,

    // --- SERVICE (FIRST BLOCK) ---
    service_name: document.getElementById("serviceName")?.value,
    service_description: document.getElementById("serviceDescription")?.value,
    service_criteria: document.getElementById("serviceCriteria")?.value,

    service_phone: document.getElementById("servicePhone1")?.value,
    service_address_street: document.getElementById("serviceAddressStreet1")?.value,
    service_city: document.getElementById("serviceCity1")?.value,
    service_state: document.getElementById("serviceState1")?.value,
    service_zip: document.getElementById("serviceZip1")?.value,

    // --- FILE ---
    logo_file: document.getElementById("upload")?.files[0]?.name || "No file"
  };

  console.log("====== FORM DATA DEBUG ======");
  console.table(data);

  // OPTIONAL: log complex stuff separately
  console.log("Org Keywords:", getSelectedKeywords?.());
  console.log("Service Keywords:", getSelectedServiceKeywords?.());
  console.log("Counties:", getSelectedCounties?.());
  console.log("Org Hours:", getOrgHours?.());
  console.log("Service Hours:", getServiceHours?.());

  console.log("============================");
}