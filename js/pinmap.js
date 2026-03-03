let allServices = []
var arrMarkers = []
let countiesLayer = null;
var map = null;
const countyLabelCoords = {
  "Cannon": [35.8000, -86.1000],
  "Clay": [36.5457, -85.5458],
  "Cumberland": [35.9523, -85.1000],
  "DeKalb": [35.9864, -85.8800],
  "Fentress": [36.3698, -85.0000],
  "Jackson": [36.3542, -85.7300],
  "Macon": [36.5377, -86.0500],
  "Overton": [36.3500, -85.3300],
  "Pickett": [36.5593, -85.1757],
  "Putnam": [36.1500, -85.5016],
  "Smith": [36.2556, -85.9920],
  "Van Buren": [35.7100, -85.4600],
  "Warren": [35.6782, -85.8100],
  "White": [35.9300, -85.4700]
};
var foodIcon = L.divIcon({
    className: '',
  html: `<div>
            <i class="bi bi-cup-hot-fill" style="font-size: 14px; color: #880E4F;"></i>
         </div>`,
});
var personalEssentialsIcon = L.divIcon({
    className: '',
  html: `<div>
            <i class="bi bi-person-walking" style="font-size: 14px; color: #006064;"></i>
         </div>`,
});
var housingIcon = L.divIcon({
    className: '',
  html: `<div>
            <i class="bi bi-house-fill" style="font-size: 14px; color: #5D4037;"></i>
         </div>`,
});
var transportationIcon = L.divIcon({
    className: '',
  html: `<div>
            <i class="bi bi-taxi-front-fill" style="font-size: 14px; color: #E65100;"></i>
         </div>`,
});
var healthCareIcon = L.divIcon({
    className: '',
  html: `<div>
            <i class="bi bi-heart-pulse-fill" style="font-size: 14px; color: #C62828;"></i>
         </div>`,
});
var crisisServicesIcon = L.divIcon({
    className: '',
  html: `<div>
            <i class="bi bi-tornado" style="font-size: 14px; color: #B71C1C;"></i>
         </div>`,
});
var familyIcon = L.divIcon({
    className: '',
  html: `<div>
            <i class="bi bi-people-fill" style="font-size: 14px; color: #1565C0;"></i>
         </div>`,
});
var educationIcon = L.divIcon({
    className: '',
  html: `<div>
            <i class="bi bi-mortarboard-fill" style="font-size: 14px; color: #0D47A1;"></i>
         </div>`,
});
var employementIcon = L.divIcon({
    className: '',
  html: `<div>
            <i class="bi bi-building-fill" style="font-size: 14px; color: #2E7D32;"></i>
         </div>`,
});
var communityIcon = L.divIcon({
    className: '',
  html: `<div>
            <i class="bi bi-globe" style="font-size: 14px; color: #004D40;"></i>
         </div>`,
});
var legalIcon = L.divIcon({
    className: '',
  html: `<div>
            <i class="bi bi-bank" style="font-size: 14px; color: #263238;"></i>
         </div>`,
});
var seniorServicesIcon = L.divIcon({
    className: '',
  html: `<div>
            <i class="bi bi-tree-fill" style="font-size: 14px; color: #1B5E20;"></i>
         </div>`,
});
var veteranServicesIcon = L.divIcon({
    className: '',
  html: `<div>
            <i class="bi bi-star-fill" style="font-size: 14px; color: #4A148C;"></i>
         </div>`,
});
var multiIcon = L.divIcon({
    className: '',
  html: `<div>
            <i class="bi bi-rainbow" style="font-size: 14px;"></i>
         </div>`,
});

let geocodes = [
    [0, 0],
    [0, 0],
    [35.827681355002, -86.07134699457],
    [36.547651968101, -85.505520538483],
    [35.956764219755, -85.033665113544],
    [35.952943369458, -85.812418421547],
    [36.429184470621, -84.931849164913],
    [36.345632604262, -85.655101296157],
    [36.519872318029, -86.032668534536],
    [36.386137921089, -85.316098564752],
    [36.57176665495, -85.133106940821],
    [36.136266648459, -85.487149440991],
    [36.257682753761, -85.970036766074],
    [0, 0],
    [35.681457381861, -85.774497703979],
    [35.95809112807, -85.476827422985],
    [36.150279379955, -85.500613844216],
    [36.150279379955, -85.500613844216],
    [35.82417488809, -86.077090362361],
    [36.555323520735, -85.507341135937],
    [36.337613277505, -85.656995943053],
    [36.52118398789, -86.024959860955],
    [36.383444392403, -85.324775225413]
]

// -- Class connects a service to its marker --
class MapItem {
  constructor({ service, marker }) {
    this.service = service
    this.marker = marker
  }
}

getServices()
// -- Call to backend --
async function getServices() {
    try{
        let servResponse = await fetch(`https://ucassist.duckdns.org/services`)
        let servData = await servResponse.json()
        servData.forEach(service => {
          if (service.ServiceAddress != 'N/A' || service.CityStateZip != 'N/A') {
            allServices.push(service)
          }
        })
    }
    catch (objError) {
        console.log("Error fetching service data")
    }
}

// -- Pushes service data to global variables
function loadServices() {
  // Create the map
  map = L.map('map', {
    zoomSnap: 0,
    zoomDelta: 0.2
  }).setView([36.162838, -85.501640], 9);
  map.setMinZoom(9)

  map.createPane('labelsPane');
  map.getPane('labelsPane').style.zIndex = 650;
  map.getPane('labelsPane').style.pointerEvents = 'none';

  // Add the map as the base layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    noWrap: true,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & CartoDB',
  }).addTo(map);

  loadAndMaskCounties()
}

// marks the services per county
function markServices (iconTag) {
  geocodes.forEach(address => {
    let marker = L.marker(address, { icon: iconTag }).addTo(map)
    marker.bindPopup("You clicked me!")
    arrMarkers.push(marker)
  })
}

// Removes all markers 
function removeAllMarkers() {
  for (var i = 0; i < arrMarkers.length; i++) {
    map.removeLayer(arrMarkers[i]);
  }
  arrMarkers = [];
}

// -- Loads boundary data from geojson file to draw county borders --

async function loadAndMaskCounties() {
  const data = await fetch('/Gov-AI/assets/data/UC_counties.geojson')
  const jsonData = await data.json()

  // set style for boundary and fill of county layers
  countiesLayer = L.geoJSON(jsonData, {
    style: {
      color: '#AA8A41',
      weight: 1.5,
      fillOpacity: 0.05
    },
  
    // set event handlers for each county layer
    onEachFeature: (feature, layer) => {
      const countyName = feature.properties.NAME;
      const coords = countyLabelCoords[countyName];

      if (coords) {
        L.marker(coords, {
          pane: 'labelsPane',
          icon: L.divIcon({
            className: 'county-label',
            html: countyName
          }),
          interactive: false
        }).addTo(map);
      }
      layer.on({
        click: () => {
          zoomToCounty(layer, feature)
        },
        // set styling when mouse over
        mouseover: () => {
          layer.setStyle({ fillOpacity: 0.35 }); // highlight selected county
          map.getContainer().style.cursor = 'pointer'; // set mouse to pointer for clarity of function
        },
        // reset styling when mouse out
        mouseout: () => {
          if (layer !== null) {
            countiesLayer.resetStyle(layer);
          }
          map.getContainer().style.cursor = '';
        }
      })
    }
  }).addTo(map)

  // set zoom to upper cumberland
  const bounds = countiesLayer.getBounds();
  const isMobile = window.innerWidth < 768;
  map.fitBounds(isMobile ? bounds.pad(5) : bounds.pad(0.2));

  map.setMaxBounds(bounds);
  map.options.maxBoundsViscosity = 1;


  // sets the area to be masked (whole map)
  const world = [
    [-90, -180],
    [-90, 180],
    [90, 180],
    [90, -180]
  ];

  // sets areas to be excluded from mask
  const holes = jsonData.features.flatMap(f => {
    const { type, coordinates } = f.geometry;
    if (type === 'Polygon') return [coordinates[0].map(([lng, lat]) => [lat, lng])];
    if (type === 'MultiPolygon') return coordinates.map(p => p[0].map(([lng, lat]) => [lat, lng]));
    return [];
  });

  // applies mask
  L.polygon([world, ...holes], {
    stroke: false,
    fillColor: '#fff',
    fillOpacity: 1,
    interactive: false, // important to let zoom/pan pass through
    pane: 'overlayPane' // ensures it stays above tiles but below controls
  }).addTo(map);
}

// -- Takes a leaflet layer object and fits the bounds of the map to the bounds of the layer --

function zoomToCounty(layer, feature) {
  // sets bounds of the map to a leaflet layer (county boundary) with 20 padding --
  map.fitBounds(layer.getBounds(), { padding: [20, 20], maxZoom: 14, animate: true })
}

// -- takes a service and returns an array of county names --
// taken from services.js
function getCountyList(service) {
  let strCounties = service.CountiesAvailable
  if (typeof strCounties === 'string') {
      strCounties = JSON.parse(strCounties);
  }
  if (Array.isArray(strCounties)) {
      return strCounties;
  }
}

window.addEventListener('load', (event) => {
  fetch('partials/pinmap.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('pinmap').innerHTML = data;

      loadServices();
    });
});

// Opens the filter side bar
document.querySelector("#btnFilterSort").addEventListener("click", () => {
    document.getElementById("mySidenav").style.width = "375px";
    overlay.classList.add("active");
});

// Closes the filter side bar
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  overlay.classList.remove("active");
}

// Closes the filter when the overlay is clicked
overlay.addEventListener("click", () => {
  closeNav()
})

// Closes the filter side bar when btnSeeResults is clicked
document.querySelector("#btnSeeResults").addEventListener("click", () => {
    closeNav()
})

// Closes the filter side bar when btnSeeResults is clicked
document.querySelector("#btnTopClose").addEventListener("click", () => {
    closeNav()
})

// Removes all filters when btnClearFilter is clicked
document.querySelector("#btnClearFilter").addEventListener("click", () => {
    let selectedCheckboxes = document.querySelectorAll(`#divAllFilter input[type="checkbox"]:checked`)
    selectedCheckboxes.forEach(box => {
        box.checked = false;
    });
    removeAllMarkers ()
})

// Opens the Food filter options
document.querySelector("#btnFood").addEventListener("click", () => {
    if (document.querySelector('#divOuterFood').style.display === 'none') {
        document.querySelector('#divOuterFood').style.display = 'block';
        document.querySelector('#btnFood').innerHTML = `<i class="bi bi-cup-hot-fill" style="font-size: 20px; color: #880E4F;"></i> Food <i class="bi bi-caret-up-fill"></i>`;
    } else {
        document.querySelector('#divOuterFood').style.display = 'none';
        document.querySelector('#btnFood').innerHTML = `<i class="bi bi-cup-hot-fill" style="font-size: 20px; color: #880E4F;"></i> Food <i class="bi bi-caret-down-fill"></i>`;
    }
});

// Opens the Personal Essentials filter options
document.querySelector("#btnPersonalEssentials").addEventListener("click", () => {
    if (document.querySelector('#divOuterPersonalEssentials').style.display === 'none') {
        document.querySelector('#divOuterPersonalEssentials').style.display = 'block';
        document.querySelector('#btnPersonalEssentials').innerHTML = `<i class="bi bi-person-walking" style="font-size: 20px; color: #006064;"></i> Personal Essentials <i class="bi bi-caret-up-fill"></i>`;
    } else {
        document.querySelector('#divOuterPersonalEssentials').style.display = 'none';
        document.querySelector('#btnPersonalEssentials').innerHTML = `<i class="bi bi-person-walking" style="font-size: 20px; color: #006064;"></i> Personal Essentials <i class="bi bi-caret-down-fill"></i>`;
    }
});

// Opens the Housing filter options
document.querySelector("#btnHousing").addEventListener("click", () => {
    if (document.querySelector('#divOuterHousing').style.display === 'none') {
        document.querySelector('#divOuterHousing').style.display = 'block';
        document.querySelector('#btnHousing').innerHTML = `<i class="bi bi-house-fill" style="font-size: 20px; color: #5D4037;"></i> Housing <i class="bi bi-caret-up-fill"></i>`;
    } else {
        document.querySelector('#divOuterHousing').style.display = 'none';
        document.querySelector('#btnHousing').innerHTML = `<i class="bi bi-house-fill" style="font-size: 20px; color: #5D4037;"></i> Housing <i class="bi bi-caret-down-fill"></i>`;
    }
});

// Opens the Transportation filter options
document.querySelector("#btnTransportation").addEventListener("click", () => {
    if (document.querySelector('#divOuterTransportation').style.display === 'none') {
        document.querySelector('#divOuterTransportation').style.display = 'block';
        document.querySelector('#btnTransportation').innerHTML = `<i class="bi bi-taxi-front-fill" style="font-size: 20px; color: #E65100;"></i> Transportation <i class="bi bi-caret-up-fill"></i>`;
    } else {
        document.querySelector('#divOuterTransportation').style.display = 'none';
        document.querySelector('#btnTransportation').innerHTML = `<i class="bi bi-taxi-front-fill" style="font-size: 20px; color: #E65100;"></i> Transportation <i class="bi bi-caret-down-fill"></i>`;
    }
});

// Opens the Health Care filter options
document.querySelector("#btnHealthCare").addEventListener("click", () => {
    if (document.querySelector('#divOuterHealthCare').style.display === 'none') {
        document.querySelector('#divOuterHealthCare').style.display = 'block';
        document.querySelector('#btnHealthCare').innerHTML = `<i class="bi bi-heart-pulse-fill" style="font-size: 20px; color: #C62828;"></i> Health Care <i class="bi bi-caret-up-fill"></i>`;
    } else {
        document.querySelector('#divOuterHealthCare').style.display = 'none';
        document.querySelector('#btnHealthCare').innerHTML = `<i class="bi bi-heart-pulse-fill" style="font-size: 20px; color: #C62828;"></i> Health Care <i class="bi bi-caret-down-fill"></i>`;
    }
});

// Opens the Crisis Services filter options
document.querySelector("#btnCrisisServices").addEventListener("click", () => {
    if (document.querySelector('#divOuterCrisisServices').style.display === 'none') {
        document.querySelector('#divOuterCrisisServices').style.display = 'block';
        document.querySelector('#btnCrisisServices').innerHTML = `<i class="bi bi-tornado" style="font-size: 20px; color: #B71C1C;"></i> Crisis Services <i class="bi bi-caret-up-fill"></i>`;
    } else {
        document.querySelector('#divOuterCrisisServices').style.display = 'none';
        document.querySelector('#btnCrisisServices').innerHTML = `<i class="bi bi-tornado" style="font-size: 20px; color: #B71C1C;"></i> Crisis Services <i class="bi bi-caret-down-fill"></i>`;
    }
});

// Opens the Family filter options
document.querySelector("#btnFamily").addEventListener("click", () => {
    if (document.querySelector('#divOuterFamily').style.display === 'none') {
        document.querySelector('#divOuterFamily').style.display = 'block';
        document.querySelector('#btnFamily').innerHTML = `<i class="bi bi-people-fill" style="font-size: 20px; color: #1565C0;"></i> Family <i class="bi bi-caret-up-fill"></i>`;
    } else {
        document.querySelector('#divOuterFamily').style.display = 'none';
        document.querySelector('#btnFamily').innerHTML = `<i class="bi bi-people-fill" style="font-size: 20px; color: #1565C0;"></i> Family <i class="bi bi-caret-down-fill"></i>`;
    }
});

// Opens the Education filter options
document.querySelector("#btnEducation").addEventListener("click", () => {
    if (document.querySelector('#divOuterEducation').style.display === 'none') {
        document.querySelector('#divOuterEducation').style.display = 'block';
        document.querySelector('#btnEducation').innerHTML = `<i class="bi bi-mortarboard-fill" style="font-size: 20px; color: #0D47A1;"></i> Education <i class="bi bi-caret-up-fill"></i>`;
    } else {
        document.querySelector('#divOuterEducation').style.display = 'none';
        document.querySelector('#btnEducation').innerHTML = `<i class="bi bi-mortarboard-fill" style="font-size: 20px; color: #0D47A1;"></i> Education <i class="bi bi-caret-down-fill"></i>`;
    }
  })

// Opens the Employment filter options
document.querySelector("#btnEmployment").addEventListener("click", () => {
    if (document.querySelector('#divOuterEmployment').style.display === 'none') {
        document.querySelector('#divOuterEmployment').style.display = 'block';
        document.querySelector('#btnEmployment').innerHTML = `<i class="bi bi-building-fill" style="font-size: 20px; color: #2E7D32;"></i> Employment <i class="bi bi-caret-up-fill"></i>`;
    } else {
        document.querySelector('#divOuterEmployment').style.display = 'none';
        document.querySelector('#btnEmployment').innerHTML = `<i class="bi bi-building-fill" style="font-size: 20px; color: #2E7D32;"></i> Employment <i class="bi bi-caret-down-fill"></i>`;
    }
});

// Opens the Community filter options
document.querySelector("#btnCommunity").addEventListener("click", () => {
    if (document.querySelector('#divOuterCommunity').style.display === 'none') {
        document.querySelector('#divOuterCommunity').style.display = 'block';
        document.querySelector('#btnCommunity').innerHTML = `<i class="bi bi-globe" style="font-size: 20px; color: #004D40;"></i> Community <i class="bi bi-caret-up-fill"></i>`;
    } else {
        document.querySelector('#divOuterCommunity').style.display = 'none';
        document.querySelector('#btnCommunity').innerHTML = `<i class="bi bi-globe" style="font-size: 20px; color: #004D40;"></i> Community <i class="bi bi-caret-down-fill"></i>`;
    }
});

// Opens the Legal filter options
document.querySelector("#btnLegal").addEventListener("click", () => {
    if (document.querySelector('#divOuterLegal').style.display === 'none') {
        document.querySelector('#divOuterLegal').style.display = 'block';
        document.querySelector('#btnLegal').innerHTML = `<i class="bi bi-bank" style="font-size: 20px; color: #263238;"></i> Legal <i class="bi bi-caret-up-fill"></i>`;
    } else {
        document.querySelector('#divOuterLegal').style.display = 'none';
        document.querySelector('#btnLegal').innerHTML = `<i class="bi bi-bank" style="font-size: 20px; color: #263238;"></i> Legal <i class="bi bi-caret-down-fill"></i>`;
    }
});

// Opens the Senior Services filter options
document.querySelector("#btnSeniorServices").addEventListener("click", () => {
    if (document.querySelector('#divOuterSeniorServices').style.display === 'none') {
        document.querySelector('#divOuterSeniorServices').style.display = 'block';
        document.querySelector('#btnSeniorServices').innerHTML = `<i class="bi bi-tree-fill" style="font-size: 20px; color: #1B5E20;"></i> Senior Services <i class="bi bi-caret-up-fill"></i>`;
    } else {
        document.querySelector('#divOuterSeniorServices').style.display = 'none';
        document.querySelector('#btnSeniorServices').innerHTML = `<i class="bi bi-tree-fill" style="font-size: 20px; color: #1B5E20;"></i> Senior Services <i class="bi bi-caret-down-fill"></i>`;
    }
});

// Opens the Veteran Services filter options
document.querySelector("#btnVeteranServices").addEventListener("click", () => {
    if (document.querySelector('#divOuterVeteranServices').style.display === 'none') {
        document.querySelector('#divOuterVeteranServices').style.display = 'block';
        document.querySelector('#btnVeteranServices').innerHTML = `<i class="bi bi-star-fill" style="font-size: 20px; color: #4A148C;"></i> Veteran Services <i class="bi bi-caret-up-fill"></i>`;
    } else {
        document.querySelector('#divOuterVeteranServices').style.display = 'none';
        document.querySelector('#btnVeteranServices').innerHTML = `<i class="bi bi-star-fill" style="font-size: 20px; color: #4A148C;"></i> Veteran Services <i class="bi bi-caret-down-fill"></i>`;
    }
});

// Applys the filter anytime a checkbox is updated
document.getElementById('divAllFilter').addEventListener('change', (e) => {
  let selectedFood = getSelectedCheckboxes('divOuterFood')
  let selectedPersonalEssentials = getSelectedCheckboxes('divOuterPersonalEssentials')
  let selectedHousing = getSelectedCheckboxes('divOuterHousing')
  let selectedTransportation = getSelectedCheckboxes('divOuterTransportation')
  let selectedHealthCare = getSelectedCheckboxes('divOuterHealthCare')
  let selectedCrisisServices = getSelectedCheckboxes('divOuterCrisisServices')
  let selectedFamily = getSelectedCheckboxes('divOuterFamily')
  let selectedEducation = getSelectedCheckboxes('divOuterEducation')
  let selectedEmployment = getSelectedCheckboxes('divOuterEmployment')
  let selectedCommunity = getSelectedCheckboxes('divOuterCommunity')
  let selectedLegal = getSelectedCheckboxes('divOuterLegal')
  let selectedSeniorServices = getSelectedCheckboxes('divOuterSeniorServices')
  let selectedVeteranServices = getSelectedCheckboxes('divOuterVeteranServices')
  let arrMatches
  let iconToUse
  
  removeAllMarkers ()
  allServices.forEach(service => {
    arrMatches = []
    let strTags = getTagList(service)
    let lowKey = (strTags).map(c => c.toLowerCase());
    if (selectedFood.length > 0 &&
        selectedFood.some(item => lowKey.includes(item))) {
      arrMatches.push("food");
    }
    else if (selectedPersonalEssentials.length > 0 &&
            selectedPersonalEssentials.some(item => lowKey.includes(item))) {
      arrMatches.push("personal essentials");
    }
    else if (selectedHousing.length > 0 &&
            selectedHousing.some(item => lowKey.includes(item))) {
      arrMatches.push("housing");
    }
    else if (selectedTransportation.length > 0 &&
            selectedTransportation.some(item => lowKey.includes(item))) {
      arrMatches.push("transportation");
    }
    else if (selectedHealthCare.length > 0 &&
            selectedHealthCare.some(item => lowKey.includes(item))) {
      arrMatches.push("health care");
    }
    else if (selectedCrisisServices.length > 0 &&
            selectedCrisisServices.some(item => lowKey.includes(item))) {
      arrMatches.push("crisis services");
    }
    else if (selectedFamily.length > 0 &&
            selectedFamily.some(item => lowKey.includes(item))) {
      arrMatches.push("family");
    }
    else if (selectedEducation.length > 0 &&
            selectedEducation.some(item => lowKey.includes(item))) {
      arrMatches.push("education");
    }
    else if (selectedEmployment.length > 0 &&
            selectedEmployment.some(item => lowKey.includes(item))) {
      arrMatches.push("employment");
    }
    else if (selectedCommunity.length > 0 &&
            selectedCommunity.some(item => lowKey.includes(item))) {
      arrMatches.push("community");
    }
    else if (selectedLegal.length > 0 &&
            selectedLegal.some(item => lowKey.includes(item))) {
      arrMatches.push("legal");
    }
    else if (selectedSeniorServices.length > 0 &&
            selectedSeniorServices.some(item => lowKey.includes(item))) {
      arrMatches.push("senior services");
    }
    else if (selectedVeteranServices.length > 0 &&
            selectedVeteranServices.some(item => lowKey.includes(item))) {
      arrMatches.push("veteran services");
    }
    iconToUse = getMatchIcon(arrMatches);
  })
  if (arrMatches.length > 0) {
    markServices(iconToUse);
  }
})

// Returns an array of all selected check boxed from a container
function getSelectedCheckboxes(containerId) {
    return Array.from(
        document.querySelectorAll(`#${containerId} input[type="checkbox"]:checked`)
    ).map(el => el.value);
}

// Gets the list of tags for each service
function getTagList(service) {
    let strKeywords = service.Keywords
    if (typeof strKeywords === 'string') {
        strKeywords = JSON.parse(strKeywords);
    }
    // Returns keywords seperated by a ','
    if (Array.isArray(strKeywords)) {
        return strKeywords;
    }
}

// Returns the icon that matches the keyword match
function getMatchIcon (arrMatches) {
  let icon
  if (arrMatches.length === 1) {
    if (arrMatches[0] === "food"){
      icon = foodIcon
    }
    if (arrMatches[0] === "personal essentials"){
      icon = personalEssentialsIcon
    }
    if (arrMatches[0] === "housing"){
      icon = housingIcon
    }
    if (arrMatches[0] === "transportation"){
      icon = transportationIcon
    }
    if (arrMatches[0] === "health care"){
      icon = healthCareIcon
    }
    if (arrMatches[0] === "crisis services"){
      icon = crisisServicesIcon
    }
    if (arrMatches[0] === "family"){
      icon = familyIcon
    }
    if (arrMatches[0] === "education"){
      icon = educationIcon
    }
    if (arrMatches[0] === "employment"){
      icon = employementIcon
    }
    if (arrMatches[0] === "community"){
      icon = communityIcon
    }
    if (arrMatches[0] === "legal"){
      icon = legalIcon
    }
    if (arrMatches[0] === "senior services"){
      icon = seniorServicesIcon
    }
    if (arrMatches[0] === "veteran services"){
      icon = veteranServicesIcon
    }
  }
  if (arrMarkers.length > 1) {
    icon = multiIcon
  }
  return icon
}