const dictUpperCumbCounties = {
    'bledsoe': 'Bledsoe County',
    'cannon': 'Cannon County',
    'clay': 'Clay County',
    'cumberland': 'Cumberland County',
    'dekalb': 'DeKalb County',
    'fentress': 'Fentress County',
    'jackson': 'Jackson County',
    'overton': 'Overton County',
    'pickett': 'Pickett County',
    'putnam': 'Putnam County',
    'smith': 'Smith County',
    'van_buren': 'Van Buren County',
    'warren': 'Warren County',
    'white': 'White County'
}

function waitForElement(selector, callback) {
    const el = document.querySelector(selector);
    if (el) {
        callback(el);
    } else {
        setTimeout(() => waitForElement(selector, callback), 50);
    }
}

// waits for page to load then displays county in navbar
waitForElement('#txtDisplayCounty', displayCounty)

// for when user wants to change county manually by clicking on county name in navbar
document.querySelector("#txtDisplayCounty").addEventListener("click", getCountyManually)

// geolocation to get current county
async function displayCounty() {
  if(sessionStorage.getItem("currCounty") == null){getCoordinates()} //checking if session storage is already set, if not, it sets it using coordinates

  let strStoredCounty = sessionStorage.getItem("currCounty")

  if (!strStoredCounty) {
    document.querySelector('#txtDisplayCounty').innerHTML = "Select a County";
    return;
  }

  // look through dictionary to match key to county name for display services
  Object.keys(dictUpperCumbCounties).forEach(key => {
    if (strStoredCounty == key){
        strStoredCounty = dictUpperCumbCounties[key]
    }
  })

  document.querySelector('#txtDisplayCounty').innerHTML = strStoredCounty
}

function getCoordinates() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getCountyName, getCountyManually)
    } else {
      console.log("Geolocation is not supported by this browser.")
    }
  })
}

async function getCountyName(position) {

  console.log("Latitude: " + position.coords.latitude +
  "Longitude: " + position.coords.longitude)

  const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`);
  const geoData = await response.json()
  let strCountyName = geoData.localityInfo.administrative[3].name


  if (dictUpperCumbCounties[strStoredCounty]) {
    let strCountyKey = dictUpperCumbCounties[strStoredCounty];
  }
  else{
    console.log("County not found in dictionary, setting county to null")
    sessionStorage.setItem("currCounty", null)
    return;
  }
  
  sessionStorage.setItem("currCounty", strCountyKey)
}

function getCountyManually() {
  Swal.fire({
    title: 'What county are you in?',
    text: 'To better let us service you, tell us what county you live in.',
    icon: 'info',
    input: 'select',
    inputOptions: {
      'bledsoe': 'Bledsoe County',
      'cannon': 'Cannon County',
      'clay': 'Clay County',
      'cumberland': 'Cumberland County',
      'dekalb': 'DeKalb County',
      'fentress': 'Fentress County',
      'jackson': 'Jackson County',
      'overton': 'Overton County',
      'pickett': 'Pickett County',
      'putnam': 'Putnam County',
      'smith': 'Smith County',
      'van_buren': 'Van Buren County',
      'warren': 'Warren County',
      'white': 'White County'
    },
    inputPlaceholder: 'Select a county',
    showCancelButton: true
  }).then((result) => {
    if (result.isConfirmed) {
      console.log(result.value); // this will be 'value1', 'value2', etc
      sessionStorage.setItem("currCounty", result.value)

      displayCounty()
    }
  });
}