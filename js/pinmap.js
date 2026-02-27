import {getCounties} from "../js/iNeed.js"

const sidebarServiceState = {
  mapItems: [],
  currentPage: 0,
  SERVICES_PER_PAGE: 5,
  selectedCounty: null,
  selectedCategories: [],
  MAX_CATEGORIES: 6
};
let allServices = []
let countiesLayer = null;
let categoryColors = ["Blue", "Red", "Green", "Yellow", "Purple", "Orange"]
var map = null;
var foodIcon = L.divIcon({
    className: '',
  html: `<div>
            <i class="bi bi-cup-hot-fill" style="font-size: 20px; color: #880E4F;"></i>
         </div>`,
});
var personalEssentialsIcon = L.divIcon({
    className: '',
  html: `<div>
            <i class="bi bi-person-walking" style="font-size: 20px; color: #006064;"></i>
         </div>`,
});
var housingIcon = L.divIcon({
    className: '',
  html: `<div>
            <i class="bi bi-house-fill" style="font-size: 20px; color: #5D4037;"></i>
         </div>`,
});
var transportationIcon = L.divIcon({
    className: '',
  html: `<div>
            <i class="bi bi-taxi-front-fill" style="font-size: 20px; color: #E65100;"></i>
         </div>`,
});
var healthCareIcon = L.divIcon({
    className: '',
  html: `<div>
            <i class="bi bi-heart-pulse-fill" style="font-size: 20px; color: #C62828;"></i>
         </div>`,
});
var crisisServicesIcon = L.divIcon({
    className: '',
  html: `<div>
            <i class="bi bi-tornado" style="font-size: 20px; color: #B71C1C;"></i>
         </div>`,
});
var familyIcon = L.divIcon({
    className: '',
  html: `<div>
            <i class="bi bi-people-fill" style="font-size: 20px; color: #1565C0;"></i>
         </div>`,
});
var educationIcon = L.divIcon({
    className: '',
  html: `<div>
            <i class="bi bi-mortarboard-fill" style="font-size: 20px; color: #0D47A1;"></i>
         </div>`,
});
var employementIcon = L.divIcon({
    className: '',
  html: `<div>
            <i class="bi bi-building-fill" style="font-size: 20px; color: #2E7D32;"></i>
         </div>`,
});
var communityIcon = L.divIcon({
    className: '',
  html: `<div>
            <i class="bi bi-globe" style="font-size: 20px; color: #004D40;"></i>
         </div>`,
});
var legalIcon = L.divIcon({
    className: '',
  html: `<div>
            <i class="bi bi-bank" style="font-size: 20px; color: #263238;"></i>
         </div>`,
});
var seniorServicesIcon = L.divIcon({
    className: '',
  html: `<div>
            <i class="bi bi-tree-fill" style="font-size: 20px; color: #1B5E20;"></i>
         </div>`,
});
var veteranServicesIcon = L.divIcon({
    className: '',
  html: `<div>
            <i class="bi bi-star-fill" style="font-size: 20px; color: #4A148C;"></i>
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

// -- Call to backend --

async function getServices() {
    try{
        let servResponse = await fetch(`https://ucassist.duckdns.org/services`)
        let servData = await servResponse.json()
        return servData
    }
    catch (objError) {
        console.log("Error fetching service data")
    }
}

// -- Handles marker clicks and matches them to a service --

function markerClick(e) {
    for (let i = 0; i < allServices.length; i++) {
        if (e.target === allServices[i].marker) {
            console.log(getCountyList(allServices[i].service))
        }
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

  // Add the map as the base layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    noWrap: true,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & CartoDB',
  }).addTo(map);

  loadAndMaskCounties()
}

var arrMarkers = []
// marks the services per county
function markServices () {
  geocodes.forEach(address => {
    let marker = L.marker(address, { icon: healthCareIcon }).addTo(map);
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

function loadServicesIntoSidebar() {

  sidebarServiceState.mapItems = allServices
  sidebarServiceState.mapItems = filterServicesByCounties()
  sidebarServiceState.mapItems = filterServicesByCategories()

  sidebarServiceState.currentPage = 0;
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

      /*
      // County names using polylabel
      if (feature.properties && feature.properties.NAME) {
        let center;

        const geom = feature.geometry;

        if (geom.type === "Polygon") {
          // polylabel expects [ [ [lng, lat], ... ] ] for a single polygon
          center = window.polylabel([geom.coordinates[0]], 1.0);
        } else if (geom.type === "MultiPolygon") {
          // pick largest polygon by number of points
          let largest = geom.coordinates[0];
          geom.coordinates.forEach(polygon => {
            if (polygon[0].length > largest[0].length) largest = polygon;
          });
          center = polylabel([largest], 1.0);
        }

        // Polylabel returns [lng, lat]
        const latlng = L.latLng(center[1], center[0]);

        // Bind tooltip at centroid
        const tooltip = L.tooltip({
          permanent: true,
          direction: "center",
          className: "bg-transparent border-0 shadow-none p-0",
          interactive: false
        })
        .setLatLng(latlng)
        .setContent(`
          <div class="fw-bold text-dark text-center small">
            ${feature.properties.NAME}
          </div>
        `);

        layer.bindTooltip(tooltip);
      }
        */

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
          if (layer !== sidebarServiceState.selectedCounty) {
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
  markServices ()

  // sets bounds of the map to a leaflet layer (county boundary) with 20 padding --
  map.fitBounds(layer.getBounds(), { padding: [20, 20], maxZoom: 14, animate: true })
  
  loadServicesIntoSidebar()
  // removeAllMarkers()
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

// -- takes an array of county strings and returns an array of the filtered global array --
function filterServicesByCounties() {
  let filteredServices = []
  if (!sidebarServiceState.selectedCounty) return sidebarServiceState.mapItems

  for (let i = 0; i < sidebarServiceState.mapItems.length; i++) {
    let countiesAvailable = getCountyList(sidebarServiceState.mapItems[i].service) || []
    countiesAvailable.forEach(county => {
      if (sidebarServiceState.selectedCounty.feature.properties.NAME == county && !filteredServices.includes(sidebarServiceState.mapItems[i])) {
        filteredServices.push(sidebarServiceState.mapItems[i])
      }
    })
  }
  return filteredServices
}

// -- Gets the list of tags for each service --
// from services.js
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

// -- takes an array of category strings and an array of services and returns an array of filtered services
function filterServicesByCategories(mapItems) {
  let filteredServices = []
  if (sidebarServiceState.selectedCategories.length === 0) return sidebarServiceState.mapItems

  for (let i = 0; i < sidebarServiceState.mapItems.length; i++) {
    let serviceCategories = getTagList(sidebarServiceState.mapItems[i].service) || []
    for (let j = 0; j < serviceCategories.length; j++) {
      if (sidebarServiceState.selectedCategories.includes(serviceCategories[j]) && !filteredServices.includes(sidebarServiceState.mapItems[i])) {
        filteredServices.push(sidebarServiceState.mapItems[i])
        break
      }
    }
  }
  console.log(filteredServices)
  return filteredServices
}

window.addEventListener('load', (event) => {
  fetch('partials/pinmap.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('pinmap').innerHTML = data;

      loadServices();
    });
});