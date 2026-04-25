const dictUpperCumbCounties = {
    'all': 'All Counties',
    'cannon': 'Cannon County',
    'clay': 'Clay County',
    'cumberland': 'Cumberland County',
    'dekalb': 'DeKalb County',
    'fentress': 'Fentress County',
    'jackson': 'Jackson County',
    'macon' : 'Macon County',
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
waitForElement("#txtDisplayCounty", (el) => {
  el.addEventListener("click", getCountyManually);
});
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

function countyKeyFromName(countyName) {
  if (typeof countyName !== "string") {
    return "";
  }

  const normalized = countyName
    .toLowerCase()
    .replace(/\s+county$/, "")
    .replace(/[\s-]+/g, "_")
    .trim();

  if (dictUpperCumbCounties[normalized]) {
    return normalized;
  }

  const match = Object.entries(dictUpperCumbCounties).find(([, label]) => {
    const normalizedLabel = label.toLowerCase().replace(/\s+county$/, "").trim();
    const normalizedCounty = countyName.toLowerCase().replace(/\s+county$/, "").trim();
    return normalizedLabel === normalizedCounty;
  });

  return match?.[0] ?? "";
}

async function getCountyName(position) {
  const latitude = Number(position?.coords?.latitude);
  const longitude = Number(position?.coords?.longitude);

  console.log("Latitude: " + latitude +
  "Longitude: " + longitude)

  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    sessionStorage.setItem("userLatitude", String(latitude));
    sessionStorage.setItem("userLongitude", String(longitude));
  }

  const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
  const geoData = await response.json()
  const administrative = Array.isArray(geoData?.localityInfo?.administrative) ? geoData.localityInfo.administrative : [];
  const countyEntry = administrative.find(entry => typeof entry?.name === "string" && entry.name.toLowerCase().endsWith("county"));
  const strCountyName = countyEntry?.name ?? administrative[3]?.name ?? "";
  const strCountyKey = countyKeyFromName(strCountyName);

  if (!strCountyKey) {
    console.log("County not found in dictionary, clearing stored county")
    sessionStorage.removeItem("currCounty")
    return;
  }

  sessionStorage.setItem("currCounty", strCountyKey)
  displayCounty()
}

function getCountyManually() {
  Swal.fire({
    title: 'Please select your county.',
    icon: 'info',
    input: 'select',
    inputOptions: {
      'all': 'All Counties',
      'cannon': 'Cannon County',
      'clay': 'Clay County',
      'cumberland': 'Cumberland County',
      'dekalb': 'DeKalb County',
      'fentress': 'Fentress County',
      'jackson': 'Jackson County',
      'macon': 'Macon County',
      'overton': 'Overton County',
      'pickett': 'Pickett County',
      'putnam': 'Putnam County',
      'smith': 'Smith County',
      'van_buren': 'Van Buren County',
      'warren': 'Warren County',
      'white': 'White County'
    },
    inputPlaceholder: 'Select a county',
  }).then((result) => {
    if (result.isConfirmed) {
      if (result.value == '') {
        result.value = 'all'
      }
      sessionStorage.setItem("currCounty", result.value)
      sessionStorage.removeItem("userLatitude")
      sessionStorage.removeItem("userLongitude")
      console.log(result.value); // this will be 'value1', 'value2', etc
      location.reload();
    }
  });
}
