//CHANGE THESE IDs AS SOON
emailjs.init("6IcAOL0TqI6UDHL-b");// EmailJS public key - found on https://dashboard.emailjs.com/admin/account

async function addReferralToDB() {  
  //LOADING TO DATABASE
  const formData = {
    newFirstName: document.getElementById('referFirstName').value,
    newLastName: document.getElementById('referLastName').value,
    newEmail: document.getElementById("referEmail").value,
    newMessage: document.getElementById("referMessage").value
  }
  addReferral(formData);

  console.log("Referral added to database:", formData);

  // remove later
  localStorage.setItem(
    "referrals",
    JSON.stringify(formData)
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('main form');

  function getFieldLabel(input) {
    if (input.id) {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label) return label.textContent.replace('*', '').trim();
    }
    return input.name || input.id || 'Field';
  }
  function collectFormErrors(form) {
    let errors = [];
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      if (field.type === 'checkbox') return;
      if (!field.checkValidity()) {
        errors.push(getFieldLabel(field));
      }
    });
    return errors;
  }
  console.log("i work")
  document.getElementById('referSubmit').addEventListener('click', async (e) => {
    e.preventDefault();
    form.classList.add('was-validated');
    const errors = collectFormErrors(form);
    console.log
    if (errors.length === 0) {
      try{
        //SEND EMAIL JS
        sendDBAndEmail();

        //sweet alert for successful sending
        Swal.fire({
          title: "Missing Information",
          icon: "error",
          html: `
            <div style="text-align: left;">
              Please complete the following:<br><br>
            </div>
          `
        });
        // form.reset();
        form.classList.remove('was-validated');
      } catch (err) {
        console.error(err);
      }
    } else {
      const errorList = errors.map(err => `• ${err}`).join('\n');
      //sweet alert for unsucessful sending
      Swal.fire({
        title: "Missing Information", 
        content: `Please complete the following:\n\n${errorList}`,
        html: `<div style="text-align: left;">error</div>`
      });
    }
  });
});

const getValue = (id) => {
  const value = document.getElementById(id)?.value.trim();
  return value === "n/a" ? null : value;
};

async function sendDBAndEmail(){
  try{
    console.log(document.getElementById('referLastName').value)
    const data = {
      firstName: getValue("referFirstName"),
      lastName: getValue("referLastName"),
      email: getValue("referEmail"),
      message: getValue("referMessage"),
      phone: ""
    };
    //sending to database
    console.log("fN: ", data)
    const response = await fetch("http://s1092595647.onlinehome.us/api/index.php?route=/referral", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    console.log(response)

    // Parse the JSON response
    const result = await response.json();
    console.log('Data sent successfully:', result);

    // sending to emailJS to construct email
    const emailResponse = await emailjs.send(
      "service_9byagl9",
      "template_ad1m3hq",{
      first_name: result.firstName,
      last_name: result.lastName,
      email: result.email,
      phone_number: result.phone,
      message: result.message,
      id: result.id,
    });
  }catch(err){
    console.error("ERROR:", err);
  }
}