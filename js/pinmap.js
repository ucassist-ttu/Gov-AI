class Service {
  constructor({ name, description, marker}) {
    this.name = name;
    this.description = description;
    this.marker = marker;
  }
}

async function getServices() {
    try{
        let servResponse = await fetch(`http://34.171.184.135:8000/services`)
        let servData = await servResponse.json()
        return servData
    }
    catch (objError) {
        console.log("Error fetching service data")
    }
}

function markerClick(e) {
    for (let i = 0; i < arrMarkers.length; i++) {
        if (e.target == arrMarkers[i][1]) {
            console.log(arrMarkers[i][0])
        }
    }
}

function loadServices() {
    getServices().then(servData => {
        let i = 0;

        servData.forEach(element => {
            try {
                if (!geocodes[i]) return;

                let marker = L.marker(geocodes[i]).addTo(map);
                marker.on('click', markerClick);

                arrMarkers.push([element, marker]);

                const service = new Service({
                    name: element.NameOfService,
                    description: element.ServiceDescription,
                    marker: marker
                });

                allServices.push(service);
                i++;
            } catch (err) {
                console.error("Error creating marker", err);
            }
        });

        loadServicesIntoSidebar(allServices);
    });
}

function createServiceCard(name, description, serviceUrl = "#") {
  const wrapper = document.createElement("div");
  wrapper.className = "mb-3";

  const card = document.createElement("div");
  card.className = "card border-0 border-start border-4 shadow-sm mapServiceCard";

  const body = document.createElement("div");
  body.className = "card-body py-3 px-3";

  const title = document.createElement("h3");
  title.className = "card-title mb-3 fw-semibold";
  title.textContent = name;

  const desc = document.createElement("p");
  desc.className = "card-text mb-3 fs-5";
  desc.textContent = description;

  const button = document.createElement("a");
  button.className = "btn btn-outline-dark";
  button.textContent = "View service";
  button.href = serviceUrl;

  body.appendChild(title);
  body.appendChild(desc);
  body.appendChild(button);

  card.appendChild(body);
  wrapper.appendChild(card);

  return wrapper;
}

function renderSidebarServices() {
  const sidebarBody = document.querySelector("#mapCollapse .card-body");
  const collapseEl = document.getElementById("mapCollapse");

  if (!sidebarBody) return;

  const { services, currentPage, SERVICES_PER_PAGE } = sidebarServiceState;

  sidebarBody.innerHTML = "";

  const start = currentPage * SERVICES_PER_PAGE;
  const end = start + SERVICES_PER_PAGE;
  const pageServices = services.slice(start, end);

  // Render service cards
  pageServices.forEach(service => {
    const card = createServiceCard(
      service.name,
      service.description,
      service.url || "#"
    );
    sidebarBody.appendChild(card);
  });

  // Pagination controls
  if (services.length > SERVICES_PER_PAGE) {
    const controls = document.createElement("div");
    controls.className = "d-flex justify-content-between align-items-center mt-3";

    const prevBtn = document.createElement("button");
    prevBtn.className = "btn btn-sm btn-outline-secondary";
    prevBtn.innerHTML = '<i class="bi bi-chevron-left"></i>';
    prevBtn.disabled = currentPage === 0;

    const nextBtn = document.createElement("button");
    nextBtn.className = "btn btn-sm btn-outline-secondary";
    nextBtn.innerHTML = '<i class="bi bi-chevron-right"></i>';
    nextBtn.disabled = end >= services.length;

    const pageIndicator = document.createElement("small");
    pageIndicator.className = "text-muted";
    pageIndicator.textContent = `Page ${currentPage + 1} of ${Math.ceil(
      services.length / SERVICES_PER_PAGE
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

function loadServicesIntoSidebar(services) {
  if (!Array.isArray(services)) return;

  sidebarServiceState.services = services;
  sidebarServiceState.currentPage = 0;

  renderSidebarServices();
}

function appendServiceToSidebar(service) {
  if (!service) return;

  sidebarServiceState.services.push(service);

  renderSidebarServices();
}

document.getElementById("mapCollapse")
  .addEventListener("shown.bs.collapse", () => {
    map.invalidateSize();
  });

document.getElementById("mapCollapse")
  .addEventListener("hidden.bs.collapse", () => {
    map.invalidateSize();
  });

var map = L.map('map', {
    zoomSnap: 0,
    zoomDelta: 0.2
}).setView([36.162838, -85.501640], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 15,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

let arrMarkers = []

allServices = []

const sidebarServiceState = {
  services: [],
  currentPage: 0,
  SERVICES_PER_PAGE: 5
};

let geocodes = [
    [35.827681355002, -86.07134699457],
    [36.547651968101, -85.505520538483],
    [35.956764219755, -85.033665113544],
    [35.956764219755, -85.033665113544],
    [35.952943369458, -85.812418421547],
    [36.429184470621, -84.931849164913],
    [36.345632604262, -85.655101296157],
    [36.519872318029, -86.032668534536],
    [36.386137921089, -85.316098564752],
    [36.57176665495, -85.133106940821],
    [36.136266648459, -85.487149440991],
    [36.257682753761, -85.970036766074],
    [35.681457381861, -85.774497703979],
    [35.95809112807, -85.476827422985],
    [36.150279379955, -85.500613844216],
    [35.82417488809, -86.077090362361],
    [36.555323520735, -85.507341135937],
    [36.337613277505, -85.656995943053],
    [36.52118398789, -86.024959860955],
    [36.383444392403, -85.324775225413]
]

loadServices()