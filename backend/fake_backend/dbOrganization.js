//organizationDB, pendingOrganizationDB

// company_name, 
//     organization_description, 
//     phone, 
//     website, 
//     address1, 
//     city_public, 
//     state_public, 
//     zip_public, 
//     primary_name, 
//     primary_email, 
//     primary_phone, 
//     primary_position, 
//     secondary_name, 
//     secondary_email, 
//     secondary_phone, 
//     secondary_position,
const organizationsDB = [
    {
    id: 'C1',

    // --- ORG PUBLIC ---
    company_name: "Upper Cumberland Food Bank",
    organization_description: "Provides food assistance and emergency grocery support to families in need.",
    phone: "(931) 555-1234",
    website: "https://ucfoodbank.org",
    address1: "123 Main St",
    city_public: "Cookeville",
    state_public: "TN",
    zip_public: "38501",

    // --- CONTACTS ---
    primary_name: "Sarah Johnson",
    primary_email: "sarah.johnson@ucfoodbank.org",
    primary_phone: "(931) 555-5678",
    primary_position: "Program Director",

    secondary_name: "Mark Ellis",
    secondary_email: "mark.ellis@ucfoodbank.org",
    secondary_phone: "(931) 555-8765",
    secondary_position: "Coordinator",

    // --- FILE ---
    logo_file: "foodbank_logo.png"
  },

  {
    id: 'C2',

    // --- ORG PUBLIC ---
    company_name: "Hope Housing Services",
    organization_description: "Offers temporary housing and rental assistance programs.",
    phone: "(931) 555-2222",
    website: "https://hopehousing.org",
    address1: "456 Oak Ave",
    city_public: "Cookeville",
    state_public: "TN",
    zip_public: "38501",

    // --- CONTACTS ---
    primary_name: "David Ramirez",
    primary_email: "david@hopehousing.org",
    primary_phone: "(931) 555-3333",
    primary_position: "Housing Manager",

    secondary_name: "Emily Clark",
    secondary_email: "emily@hopehousing.org",
    secondary_phone: "(931) 555-4444",
    secondary_position: "Case Worker",

    // --- FILE ---
    logo_file: "housing_logo.png"
  }
]


const pendingOrganizationDB = [
  {
    service_id: 'S3',
    company_id: 'C3',
    // --- ORG PUBLIC ---
    company_name: "Community Health Outreach",
    organization_description: "Delivers free and low-cost healthcare services to underserved populations.",
    phone: "(931) 555-9999",
    website: "https://communityhealthoutreach.org",
    address1: "789 Pine Rd",
    city_public: "Cookeville",
    state_public: "TN",
    zip_public: "38506",

    // --- CONTACTS ---
    primary_name: "Lisa Nguyen",
    primary_email: "lisa@healthoutreach.org",
    primary_phone: "(931) 555-8888",
    primary_position: "Clinic Director",

    secondary_name: "",
    secondary_email: "",
    secondary_phone: "",
    secondary_position: "",

  }
];