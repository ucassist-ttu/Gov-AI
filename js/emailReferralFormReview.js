const params = new URLSearchParams(window.location.search);
const serviceId = params.get("id");



// CALL ENDPOINT TO UPDATE DATABASE
document.addEventListener('DOMContentLoaded', () => {
  // CALL REFERRAL SERVICE ENDPOINT TO GET SERVICE ID
  // getReferralByID(serviceId).then((service) => { http://s1092595647.onlinehome.us/api/index.php?route=/
  fetch(`http://s1092595647.onlinehome.us/api/index.php?route=/referral&id=${serviceId}`)
    .then(response => response.json())
    .then(service => {
      console.log("Found service:", service)

      document.getElementById('emailFirstName').value = service.firstName;
      document.getElementById('emailLastName').value = service.lastName;
      document.getElementById('emailEmail').value = service.email;
      document.getElementById('emailMessage').value = service.message;
    });
})


// `/referral?"firstName"=${"Jane"},
//     "lastName"=${"Doe"},
//     "email"=${"jane@example.com"},
//     "phone"=${"(931) 555-0000"},
//     "message"=${"Referral message"}`)
//     console.log("Found service:", service);
