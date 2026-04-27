//servicesDB

const servicesDB = [
  {
    service_id: 'S1',
    company_id: 'C1',

    // --- SERVICE ---
    service_name: "Emergency Food Assistance",
    service_description: "Provides weekly food boxes to individuals and families experiencing food insecurity.",
    service_criteria: "Must reside in Putnam County and provide proof of income.",

    service_phone: "(931) 555-1234",
    service_address_street: "123 Main St",
    service_city: "Cookeville",
    service_state: "TN",
    service_zip: "38501",

    // --- FILE ---
    logo_file: "foodbank_logo.png"
  },

  {
    service_id: 'S2',
    company_id: 'C2',
    // --- SERVICE ---
    service_name: "Rental Assistance Program",
    service_description: "Provides short-term rental assistance for individuals facing eviction.",
    service_criteria: "Must show proof of financial hardship and lease agreement.",

    service_phone: "(931) 555-2222",
    service_address_street: "456 Oak Ave",
    service_city: "Cookeville",
    service_state: "TN",
    service_zip: "38501",

    // --- FILE ---
    logo_file: "housing_logo.png"
  },
];

const pendingServiceDB = [
  {
  service_id: 'S3',
  company_id: 'C1',
  // --- SERVICE ---
  service_name: "Free Health Clinic",
  service_description: "Provides basic medical care, screenings, and referrals at no cost.",
  service_criteria: "Open to uninsured or underinsured individuals.",

  service_phone: "(931) 555-9999",
  service_address_street: "789 Pine Rd",
  service_city: "Cookeville",
  service_state: "TN",
  service_zip: "38506",

  // --- FILE ---
  logo_file: "health_logo.png"
}]

// FAKE ENDPOINTS

//ADDS SERVICE TO PENDINGDB
export function addServiceToPendingDB({company_name, organization_description, phone, website, address1, city_public, state_public, zip_public, primary_name, primary_email, primary_phone, primary_position, secondary_name, secondary_email, secondary_phone, secondary_position, service_name, service_description, service_criteria, service_phone, service_address_street, service_city, service_state, service_zip, logo_file}) {
   const newService = {
    id: Date.now(),
    service_name, 
    service_description, 
    service_criteria, 
    service_phone, 
    service_address_street, 
    service_city, 
    service_state, 
    service_zip, 
    logo_file
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      pendingServiceDB.push(newService);

      localStorage.setItem(
        "newService",
        JSON.stringify(pendingServiceDB)
      );
      resolve(newService);
    }, 300);
  });
}

// ADDS SERVICE TO SERVICES DB, REMOVES FROM PENDING DB VIA ID (in website link)
export function addServiceToServicesDB(pendingID){
  //search pendingServiceDB for service using ID
  const pendingService = pendingServiceDB.find(service => service.id === newID);

  return new Promise((resolve) => {
    setTimeout(() => {
      //removes from pendingdb 
      pendingServiceDB.pop(pendingService);
      //moves to servicesDB
      servicesDB.push(pendingService);

      localStorage.setItem(
        "newService",
        JSON.stringify(pendingServiceDB)
      );
      resolve(currService);
    }, 300);
  });
}

// FIND SERVICE BY ID (for website link)
export function getServiceForReview(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const referral = pendingServiceDB.find(item => item.id == id);
      resolve(referral);
    }, 500);
  });
}

export default pendingServiceDB;