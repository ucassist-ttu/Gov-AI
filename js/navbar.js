const dictUCCounties = {
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

waitForElement('#txtDisplayCounty', getGeoLocation)

// geolocation to get current county
function getGeoLocation() {
  if(sessionStorage.getItem("currCounty") == null)
    {getLocation()}
    // DISPLAY COUNTY BY LOGO
    let strStoredCounty = sessionStorage.getItem("currCounty")

    // look through dictionary to match key
    Object.keys(dictUCCounties).forEach(key => {
        if (strStoredCounty == key){
            strStoredCounty = dictUCCounties[key] // key to str to definition
        }
    })

    if (strStoredCounty != null){
        document.querySelector('#txtDisplayCounty').innerHTML = strStoredCounty
    } 
    else{
        // console.log("else")
    }
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getCounty, getCountyManually)
  } else {
    console.log("Geolocation is not supported by this browser.")
  }
}

async function getCounty(position) {

  console.log("Latitude: " + position.coords.latitude +
  "Longitude: " + position.coords.longitude)

  const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`);
  const geoData = await response.json()
  strCountyName = geoData.localityInfo.administrative[3].name

  Object.keys(dictUCCounties).forEach(key => {
    if (strCountyName == dictUCCounties[key])
      strCountyName = key
  })

  sessionStorage.setItem("currCounty", strCountyName)
  

  
  // return strCountyName
  console.log(strCountyName)
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
    }
  });
}