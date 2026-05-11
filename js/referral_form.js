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

  console.log("Referral added to database");

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
  document.getElementById('referSubmit').addEventListener('click', async (e) => {
    e.preventDefault();
    form.classList.add('was-validated');
    const errors = collectFormErrors(form);
    if (errors.length === 0) {
      try{
        //SEND EMAIL JS
        sendDBAndEmail();

        //sweet alert for successful sending
        Swal.fire({
          title: "Thank You",
          icon: "success",
          html: `
            <div style="text-align: left;">
              UCAssist will contact the person you recommeneded.
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
    const data = {
      firstName: getValue("referFirstName"),
      lastName: getValue("referLastName"),
      email: getValue("referEmail"),
      message: getValue("referMessage"),
      phone: ""
    };
    //sending to database
    const response = await fetch("http://s1092595647.onlinehome.us/api/index.php?route=/referral", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    // Parse the JSON response
    const result = await response.json();
    console.log('Data sent successfully:', result);

    // sending to emailJS to construct email
    const emailResponse = await emailjs.send(
      "service_9byagl9",   // EmailJS service ID - found on https://dashboard.emailjs.com/admin under UCAssist Test
      "template_ad1m3hq",{ // EmailJS template ID - found on https://dashboard.emailjs.com/admin/templates under Auto-Reply
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
