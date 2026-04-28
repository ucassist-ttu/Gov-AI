const dbEditServices = {
//   ...referralBE.find(entry => entry.id === 2),

  id: 'ES5',
  oldID: 'S2',

  // --- UPDATED ORG INFO ---
  company_name: "Hope Housing & Support Services",
  organization_description: "Provides housing assistance, case management, and long-term stability programs.",
  phone: "",
  website: "",
  address1: "",
  city_public: "",
  state_public: "",
  zip_public: "",

  // --- UPDATED CONTACT ---
  primary_name: "David Ramirez",
  primary_email: "d.ramirez@hopehousing.org",
  primary_phone: "",
  primary_position: "",

  secondary_name: "",
  secondary_email: "",
  secondary_phone: "",
  secondary_position: "",

  // --- UPDATED SERVICE ---
  service_name: "Expanded Rental & Utility Assistance",
  service_description: "Offers rental, utility, and emergency housing assistance for qualifying individuals.",
  service_criteria: "Must demonstrate financial hardship and reside in Upper Cumberland region.",
  service_phone: "",
  // --- UPDATED ADDRESS ---
  service_address_street: "789 New Hope Ave",
  service_city: "",
  service_state: "",
  service_zip: "38502",

  // --- UPDATED FILE ---
  logo_file: "hopehousing_updated_logo.png"
};


// FAKE ENDPOINTS
export function addService({ firstName, lastName, email, phone, message }) {
  const newReferral = {
    id: Date.now(),
    firstName,
    lastName,
    email,
    phone,
    message
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      referralReviewDB.push(newReferral);

      localStorage.setItem(
      "referrals",
      JSON.stringify(referralReviewDB)
    );
      resolve(newReferral);
    }, 300);
  });
}

export function getService(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const referral = referralReviewDB.find(item => item.id == id);
      resolve(referral);
    }, 500);
  });
}
export default dbEditServices;