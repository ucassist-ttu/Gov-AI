import { getReferralByID } from "../backend/fake_backend/dbReferrals.js";

const params = new URLSearchParams(window.location.search);
const serviceId = params.get("id");

// CALL ENDPOINT TO UPDATE DATABASE
document.addEventListener('DOMContentLoaded', () => {
  // CALL REFERRAL SERVICE ENDPOINT TO GET SERVICE ID
  getReferralByID(serviceId).then((service) => {
    console.log("Found service:", service);

    document.getElementById('emailFirstName').value = service.firstName;
    document.getElementById('emailLastName').value = service.lastName;
    document.getElementById('emailEmail').value = service.email;
    document.getElementById('emailPhone').value = service.phone;
    document.getElementById('emailMessage').value = service.message;
  });
})