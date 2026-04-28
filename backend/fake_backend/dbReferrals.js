const saved = localStorage.getItem("referrals");


const referralReviewDB = 
// saved
//   ? JSON.parse(saved)
//   : 
  [
  {
    id: 1,
    firstName: "Ashley",
    lastName: "Porter",
    email: "ashley.porter@example.com",
    phone: "(931) 555-1201",
    message: "I would like to refer Olivia Henry's Tutoring Services. You can reach her at (931) 555-8899."
  },
  {
    id: 2,
    firstName: "Michael",
    lastName: "Reed",
    email: "michael.reed@example.com",
    phone: "(931) 555-2233",
    message: "Referring Hope Housing Services. They provide rental assistance and have been very helpful to our community."
  },
  {
    id: 3,
    firstName: "Jessica",
    lastName: "Lane",
    email: "jessica.lane@example.com",
    phone: "(931) 555-3344",
    message: "I recommend Community Health Outreach. They offer free clinics and health screenings for those in need."
  },
  {
    id: 4,
    firstName: "Daniel",
    lastName: "Brooks",
    email: "daniel.brooks@example.com",
    phone: "(931) 555-4455",
    message: "Please consider adding Upper Cumberland Food Bank. They provide weekly food assistance and support programs."
  }
];

console.log(referralReviewDB)




// FAKE ENDPOINTS
export function addReferral({ firstName, lastName, email, phone, message }) {
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

export function getReferralByID(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const referral = referralReviewDB.find(item => item.id == id);
      resolve(referral);
    }, 500);
  });
}


export default referralReviewDB;