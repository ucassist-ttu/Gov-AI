// -- Global variables --

const sidebarServiceState = {
  mapItems: [],
  currentPage: 0,
  SERVICES_PER_PAGE: 5
};
let allServices = []
let countiesLayer = null;
let selectedCounty = null;
var map = null;

// temporary geocode variable
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
        if (e.target == allServices[i].marker) {
            // console.log(getCountyList(allServices[i].service))
        }
    }
}

// -- Pushes service data to global variables

function loadServices() {
  getServices().then(servData => {
    let i = 0;

    servData.forEach(element => {
        try {
            if (!geocodes[i]) return;
            let marker = L.marker(geocodes[i]).addTo(map);
            marker.on('click', markerClick);
            // console.log(`${element.CityStateZip} ${element.ServiceAddress} ${geocodes[i]}`)
            const mapItem = new MapItem ({
              service: element,
              marker: marker
            })

            allServices.push(mapItem);
            i++;
        } catch (err) {
            console.error("Error creating marker", err);
        }
    });
    loadServicesIntoSidebar(allServices);
  });
  // -- HTML variables --
  // recalculates map's size when resizing
  document.getElementById("mapCollapse")
    .addEventListener("shown.bs.collapse", () => {
      map.invalidateSize();
    });
    
  document.getElementById("mapCollapse")
  .addEventListener("hidden.bs.collapse", () => {
    map.invalidateSize();
  });

  // -- Map variables --

  map = L.map('map', {
    zoomSnap: 0,
    zoomDelta: 0.2
  }).setView([36.162838, -85.501640], 9);
  map.setMinZoom(9)
  
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    noWrap: true,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  loadAndMaskCounties()
}

// -- Takes a service and returns a structured div --

function createServiceCard(mapItem) {
  const wrapper = document.createElement("div");
  wrapper.className = "mb-3";

  const card = document.createElement("div");
  card.className = "card border-0 border-start border-4 shadow-sm mapServiceCard";

  const body = document.createElement("div");
  body.className = "card-body py-3 px-3";

  const title = document.createElement("h3");
  title.className = "card-title mb-3 fw-semibold";
  title.textContent = mapItem.service.NameOfService;

  const desc = document.createElement("p");
  desc.className = "card-text mb-3 fs-5";
  desc.textContent = mapItem.service.ServiceDescription;

  const button = document.createElement("a");
  button.className = "btn btn-outline-dark";
  button.textContent = "View service";
  button.href = "#";

  body.appendChild(title);
  body.appendChild(desc);
  body.appendChild(button);

  card.appendChild(body);
  wrapper.appendChild(card);

  return wrapper;
}

// -- Calls createServiceCard for each service and implements pagination logic

function renderSidebarServices() {
  const sidebarBody = document.querySelector("#mapCollapse .card-body");
  const collapseEl = document.getElementById("mapCollapse");

  if (!sidebarBody) return;

  const { mapItems, currentPage, SERVICES_PER_PAGE } = sidebarServiceState;

  sidebarBody.innerHTML = "";

  const start = currentPage * SERVICES_PER_PAGE;
  const end = start + SERVICES_PER_PAGE;

  // Render service cards
  mapItems.forEach(mapItem => {
    const card = createServiceCard(mapItem);
    sidebarBody.appendChild(card);
  });

  // Pagination controls
  if (mapItems.length > SERVICES_PER_PAGE) {
    const controls = document.createElement("div");
    controls.className = "d-flex justify-content-between align-items-center mt-3";

    const prevBtn = document.createElement("button");
    prevBtn.className = "btn btn-sm btn-outline-secondary";
    prevBtn.innerHTML = '<i class="bi bi-chevron-left"></i>';
    prevBtn.disabled = currentPage === 0;

    const nextBtn = document.createElement("button");
    nextBtn.className = "btn btn-sm btn-outline-secondary";
    nextBtn.innerHTML = '<i class="bi bi-chevron-right"></i>';
    nextBtn.disabled = end >= mapItems.length;

    const pageIndicator = document.createElement("small");
    pageIndicator.className = "text-muted";
    pageIndicator.textContent = `Page ${currentPage + 1} of ${Math.ceil(
      mapItems.length / SERVICES_PER_PAGE
    )}`;

    prevBtn.addEventListener("click", () => {
      sidebarServiceState.currentPage--;
      renderSidebarServices();
    });

    nextBtn.addEventListener("click", () => {
      sidebarServiceState.currentPage++;
      renderSidebarServices();
    });

    controls.appendChild(prevBtn);
    controls.appendChild(pageIndicator);
    controls.appendChild(nextBtn);

    sidebarBody.appendChild(controls);
  }

  // Ensure sidebar is open
  if (collapseEl && !collapseEl.classList.contains("show")) {
    new bootstrap.Collapse(collapseEl, { show: true });
  }
}

// -- Updates global variables before calling renderSidebarServices --

function loadServicesIntoSidebar(services) {

  sidebarServiceState.mapItems = services;
  sidebarServiceState.currentPage = 0;

  renderSidebarServices();
}

// -- Loads boundary data from geojson file to draw county borders --

async function loadAndMaskCounties() {
  const data = await fetch('/Gov-AI/assets/data/UC_counties.geojson')
  const jsonData = await data.json()

  // set style for boundary and fill of county layers
  countiesLayer = L.geoJSON(jsonData, {
    style: {
      color: '#AA8A41',
      weight: 2,
      fillOpacity: 0.05
    },
    // set event handlers for each county layer
    onEachFeature: (feature, layer) => {
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
          if (layer !== selectedCounty) {
            countiesLayer.resetStyle(layer);
          }
          map.getContainer().style.cursor = '';
        }
      })
    }
  }).addTo(map)

  // set zoom to upper cumberland
  const bounds = countiesLayer.getBounds().pad(0.2);
  map.fitBounds(bounds);

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
  if (selectedCounty) countiesLayer.resetStyle(selectedCounty)
  
  if (selectedCounty == layer) {
    const bounds = countiesLayer.getBounds();
    map.fitBounds(bounds.pad(0.2));
    countiesLayer.resetStyle(selectedCounty)
    selectedCounty = null;
    loadServicesIntoSidebar(allServices)
    return;
  }

  selectedCounty = layer;

  // sets bounds of the map to a leaflet layer (county boundary) with 20 padding --
  map.fitBounds(layer.getBounds(), { padding: [20, 20], maxZoom: 14, animate: true })
  
  loadServicesIntoSidebar(filterServicesByCounties(feature.properties.NAME))
}

// -- takes a service and returns an array of county names --
// taken from services.js
function getCountyList(service) {
  strCounties = service.CountiesAvailable
  if (typeof strCounties === 'string') {
      strCounties = JSON.parse(strCounties);
  }
  if (Array.isArray(strCounties)) {
      return strCounties;
  }
}

// -- takes an array of county strings and returns an array of the filtered global array --
function filterServicesByCounties(counties) {
  let filteredServices = []
  for (let i = 0; i < allServices.length; i++) {
    let countiesAvailable = getCountyList(allServices[i].service)
    countiesAvailable.forEach(county => {
      if (counties.includes(county) && !filteredServices.includes(allServices[i])) {
        filteredServices.push(allServices[i])
      }
    })
  }
  return filteredServices
}


// -- wait until the inline script has added the Pinmap to the DOM --
window.addEventListener('load', (event) => {
  loadServices()
});