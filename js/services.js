let arrCounties = []
let arrServiceType = []
let arrOrgName = []
let arrFilteredServices = []
let arrAllServices = []

async function getServices() {
    try{
        //Get the list of services from api
        let servResponse = await fetch(`http://34.171.184.135:8000/services`)
        let servData = await servResponse.json()
        arrAllServices = servData
        renderSidebarServices(servData)

        // Get all of the counties, service types, and organization names for filtering
        servData.forEach(element => {
            let strTagList = getTagList(element)
            let strCounties = getCountyList(element)

            arrOrgName.push(element.OrganizationName)
            strTagList.forEach(tag => {
                arrServiceType.push(tag)
            });
            strCounties.forEach(county => {
                arrCounties.push(county)
            });
        });
    } catch (objError){
        console.log('Error fetching objData', objError)
    }

    // Remove all duplicate instances from each array
    uniqueCounties = [...new Set(arrCounties.filter(c => typeof c === "string" && c.trim().length >= 1))].sort((a, b) => a.localeCompare(b));
    uniqueServiceTypes = [...new Set(arrServiceType.filter(c => typeof c === "string" && c.trim().length >= 1))].sort((a, b) => a.localeCompare(b));
    uniqueOrgNames = [...new Set(arrOrgName.filter(c => typeof c === "string" && c.trim().length >= 1))].sort((a, b) => a.localeCompare(b));
    
    // Create the filters
    createCountyFilter(uniqueCounties)
    createServiceFilter(uniqueServiceTypes)
    createOrgNamesFilter(uniqueOrgNames)
}

getServices()

// Create the service cards for each page
function createServiceCard(arrCards) {
    arrCards.forEach(service => {
        let strDiv = ''
        let strTagList = getTagList(service)
        let strCounties = getCountyList(service)

        //Initialize card and add name of service
        strDiv += `<div id="divOuterService">`
        strDiv += `<div class="service" data-id="${service.ID}" data-organization="${service.OrganizationName}" data-tags="${strTagList}" data-counties="${strCounties}">`
        strDiv += `<h2>${service.NameOfService}</h2>`

        //Checks to see if service provider has a logo and uses it if so
        if (service.ProviderLogo != 'N/A'){
            strDiv += `<h3>Offered by: <img src="${service.ProviderLogo}" alt="${service.OrganizationName}"></h3>`
        }
        // Uses organization name if service does not have a logo
        else{
            strDiv += `<h3>Offered by: ${service.OrganizationName}</h3>`
        }

        // Displays tags and service description
        strDiv += `<p class="mb-3">Tags: ${strTagList.join(', ')}</p>`
        strDiv += `<p>${service.ServiceDescription}</p>`

        // Learn more button
        strDiv += `<button>Learn More <i class="bi bi-caret-right-fill"></i></button>`
        strDiv += `</div>`

        // Blue service divider
        strDiv += `<hr class="hr-blue">`
        strDiv += `</div>`
        document.querySelector('#divServices').innerHTML += strDiv

        // Logic for the Learn More button
        document.querySelectorAll('.service button').forEach(button => {
            button.addEventListener('click', () => {
                const serviceCard = button.closest('.service');

                let serviceId = serviceCard.dataset.id
                callServicePage(serviceId)
            });
        })
    })
}

// Gets the list of tags for each service
function getTagList(service) {
    strKeywords = service.Keywords
    if (typeof strKeywords === 'string') {
        strKeywords = JSON.parse(strKeywords);
    }
    // Returns keywords seperated by a ','
    if (Array.isArray(strKeywords)) {
        return strKeywords;
    }
}

// Shows more information on a service by calling service.html  
function callServicePage (page_id) {
    window.location.href = `service.html?id=${page_id}`;
}

// Gets  the list of counties for each services
function getCountyList(service) {
    strCounties = service.CountiesAvailable
    if (typeof strCounties === 'string') {
        strCounties = JSON.parse(strCounties);
    }

    // Returns an array of strCounties
    if (Array.isArray(strCounties)) {
        return strCounties;
    }
}

// Creates the checkboxes
function createCheckbox(labelText, container) {
  const value = labelText.toLowerCase().replace(/\s+/g, "-");

  const wrapper = document.createElement("div");
  wrapper.className = "checkbox";

  const input = document.createElement("input");
  input.type = "checkbox";
  input.className = "form-check-input";
  input.id = `${value}-checkbox`;
  input.value = labelText.toLowerCase();

  const label = document.createElement("label");
  label.className = "form-check-label";
  label.htmlFor = input.id;
  label.textContent = labelText;

  wrapper.appendChild(input);
  wrapper.appendChild(label);
  container.appendChild(wrapper);
}

// Creates the checkboxes for the county filter
function createCountyFilter(counties) {
  const VISIBLE_COUNT = 6;
  const container = document.getElementById("divCounties");
  const moreContainer = document.getElementById("divMoreCounties");
  moreContainer.style.display = "none";

  counties.forEach((county, index) => {
      if (index < VISIBLE_COUNT) {
        createCheckbox(county, container);
      } else {
        createCheckbox(county, moreContainer);
      }
    });

  container.appendChild(moreContainer);
}

// Creates the checkboxes for the service types filter
function createServiceFilter(services) {
  const VISIBLE_COUNT = 6;
  const container = document.getElementById("divServiceType");
  const moreContainer = document.getElementById("divMoreServiceTypes");
  moreContainer.style.display = "none";

  services.forEach((service, index) => {
      if (index < VISIBLE_COUNT) {
        createCheckbox(service, container);
      } else {
        createCheckbox(service, moreContainer);
      }
    });

  container.appendChild(moreContainer);
}

// Creates the checkboxes for the organization names filter
function createOrgNamesFilter(names) {
  const VISIBLE_COUNT = 6;
  const container = document.getElementById("divOrgName");
  const moreContainer = document.getElementById("divMoreOrgNames");
  moreContainer.style.display = "none";

  names.forEach((name, index) => {
      if (index < VISIBLE_COUNT) {
        createCheckbox(name, container);
      } else {
        createCheckbox(name, moreContainer);
      }
    });

  container.appendChild(moreContainer);
}

// Opens the Counties filter options
document.querySelector("#btnCounties").addEventListener("click", () => {
    if (document.querySelector('#divOuterCounties').style.display === 'none') {
        document.querySelector('#divOuterCounties').style.display = 'block';
        document.querySelector('#btnCounties').innerHTML = `Counties <i class="bi bi-caret-up-fill"></i>`;
        if (document.querySelector('#divMoreCounties').style.display === 'none') {
            document.querySelector('#btnShowMoreCounties').innerHTML = `+ Show ${uniqueCounties.length - 6} More Counties`;
        } else {
            document.querySelector('#btnShowMoreCounties').innerHTML = `- Show Fewer Counties`;
        }
    } else {
        document.querySelector('#divOuterCounties').style.display = 'none';
        document.querySelector('#btnCounties').innerHTML = `Counties <i class="bi bi-caret-down-fill"></i>`;
    }
});

// Opens the service type filter options
document.querySelector("#btnServiceType").addEventListener("click", () => {
    if (document.querySelector('#divOuterServiceTypes').style.display === 'none') {
            document.querySelector('#divOuterServiceTypes').style.display = 'block';
            document.querySelector('#btnServiceType').innerHTML = `Service Type <i class="bi bi-caret-up-fill"></i>`;
            if (document.querySelector('#divMoreServiceTypes').style.display === 'none') {
                document.querySelector('#btnShowMoreServices').innerHTML = `+ Show ${uniqueServiceTypes.length - 6} More Service Types`;
            } else {
                document.querySelector('#btnShowMoreServices').innerHTML = `- Show Fewer Service Types`;
            }
    } else {
        document.querySelector('#divOuterServiceTypes').style.display = 'none';
        document.querySelector('#btnServiceType').innerHTML = `Service Type <i class="bi bi-caret-down-fill"></i>`;
    }
});

// Opens the organization name filter options
document.querySelector("#btnOrganizationName").addEventListener("click", () => {
    if (document.querySelector('#divOuterOrgName').style.display === 'none') {
            document.querySelector('#divOuterOrgName').style.display = 'block';
            document.querySelector('#btnOrganizationName').innerHTML = `Organization Name <i class="bi bi-caret-up-fill"></i>`;
            if (document.querySelector('#divMoreOrgNames').style.display === 'none') {
                document.querySelector('#btnShowMoreOrgNames').innerHTML = `+ Show ${uniqueOrgNames.length - 6} More Organization names`;
            } else {
                document.querySelector('#btnShowMoreOrgNames').innerHTML = `- Show Fewer Organization Names`;
            }
    } else {
        document.querySelector('#divOuterOrgName').style.display = 'none';
        document.querySelector('#btnOrganizationName').innerHTML = `Organization Name <i class="bi bi-caret-down-fill"></i>`;
    }
});

// Shows more Counties
document.querySelector("#btnShowMoreCounties").addEventListener("click", () => {
    if (document.querySelector('#divMoreCounties').style.display === 'none') {
            document.querySelector('#divMoreCounties').style.display = 'block';
            document.querySelector('#btnShowMoreCounties').innerHTML = `- Show Fewer Counties`;
    } else {
        document.querySelector('#divMoreCounties').style.display = 'none';
        document.querySelector('#btnShowMoreCounties').innerHTML = `+ Show ${uniqueCounties.length - 6} More Counties`;
    }
});

// Shows more service types
document.querySelector("#btnShowMoreServices").addEventListener("click", () => {
    if (document.querySelector('#divMoreServiceTypes').style.display === 'none') {
            document.querySelector('#divMoreServiceTypes').style.display = 'block';
            document.querySelector('#btnShowMoreServices').innerHTML = `- Show Fewer Service Types`;
    } else {
        document.querySelector('#divMoreServiceTypes').style.display = 'none';
        document.querySelector('#btnShowMoreServices').innerHTML = `+ Show ${uniqueServiceTypes.length - 6} More Service Types`;
    }
});

// Shows more organization names
document.querySelector("#btnShowMoreOrgNames").addEventListener("click", () => {
    if (document.querySelector('#divMoreOrgNames').style.display === 'none') {
            document.querySelector('#divMoreOrgNames').style.display = 'block';
            document.querySelector('#btnShowMoreOrgNames').innerHTML = `- Show Fewer Organization Names`;
    } else {
        document.querySelector('#divMoreOrgNames').style.display = 'none';
        document.querySelector('#btnShowMoreOrgNames').innerHTML = `+ Show ${uniqueOrgNames.length - 6} More Organization names`;
    }
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

// Removes all filters when btnClearFilter is clicked
document.querySelector("#btnClearFilter").addEventListener("click", () => {
    selectedCheckboxes = document.querySelectorAll(`#divAllFilter input[type="checkbox"]:checked`)
    selectedCheckboxes.forEach(box => {
        box.checked = false;
    });
    arrFilteredServices = []
    renderSidebarServices(arrAllServices)
})

// Returns an array of all selected check boxed from a container
function getSelectedCheckboxes(containerId) {
    return Array.from(
        document.querySelectorAll(`#${containerId} input[type="checkbox"]:checked`)
    ).map(el => el.value);
}

// Applys the filter anytime a checkbox is updated
document.getElementById('divAllFilter').addEventListener('change', (e) => {
    if (!e.target.matches('input[type="checkbox"]')) return;
    const selectedCounties = getSelectedCheckboxes("divOuterCounties").map(c => c.toLowerCase());
    const selectedServiceTypes = getSelectedCheckboxes("divOuterServiceTypes").map(s => s.toLowerCase());
    const selectedOrgNames = getSelectedCheckboxes("divOuterOrgName").map(o => o.toLowerCase());

    //Reset the FilteredServices
    arrFilteredServices = [];

    // Loop through all services
    arrAllServices.forEach(service => {
        let strCounties = getCountyList(service)
        let strTags = getTagList(service)

        // Normalize arrays to lowercase for case-insensitive comparison
        const counties = (strCounties).map(c => c.toLowerCase());
        const tags = (strTags).map(t => t.toLowerCase());
        const org = (service.OrganizationName || "").toLowerCase();

        // Check each filter; if filter list is empty, treat as "match all"
        const countyMatch = selectedCounties.length === 0 || selectedCounties.some(c => counties.includes(c.toLowerCase()));
        const serviceMatch = selectedServiceTypes.length === 0 || selectedServiceTypes.some(s => tags.includes(s.toLowerCase()));
        const orgMatch = selectedOrgNames.length === 0 || selectedOrgNames.some(o => o.toLowerCase() === org);

        // Only push if all filters match
        if (countyMatch && serviceMatch && orgMatch) {
        arrFilteredServices.push(service);
        }
    });

    currentPage = 0
    renderSidebarServices(arrFilteredServices)
})


// Adds the page number at the bottom of the page and displays 10 services at a time
let currentPage = 0
function renderSidebarServices(arrServices) {
    const sidebarBody = document.querySelector("#divServices");

    sidebarBody.innerHTML = "";

    const start = currentPage * 10;
    const end = start + 10;

    const pageItems = arrServices.slice(start, end);
    createServiceCard(pageItems)

    // Pagination controls
    if (arrServices.length > 10) {
        const controls = document.createElement("div");
        controls.className = "d-flex justify-content-around align-items-center mt-3";

        const prevBtn = document.createElement("button");
        prevBtn.className = "btn btn-sm btn-outline-secondary";
        prevBtn.innerHTML = '<i class="bi bi-chevron-left"></i>';
        prevBtn.disabled = currentPage === 0;

        const nextBtn = document.createElement("button");
        nextBtn.className = "btn btn-sm btn-outline-secondary";
        nextBtn.innerHTML = '<i class="bi bi-chevron-right"></i>';
        nextBtn.disabled = end >= arrServices.length;

        const pageIndicator = document.createElement("small");
        pageIndicator.className = "text-muted";
        pageIndicator.textContent = `Page ${currentPage + 1} of ${Math.ceil(
        arrServices.length / 10
        )}`;

        prevBtn.addEventListener("click", () => {
        currentPage--;
        renderSidebarServices(arrServices);
        });

        nextBtn.addEventListener("click", () => {
        currentPage++;
        renderSidebarServices(arrServices);
        });

        controls.appendChild(prevBtn);
        controls.appendChild(pageIndicator);
        controls.appendChild(nextBtn);
        sidebarBody.appendChild(controls);
    }
}


// let strLatitude
// let strLongitude

// document.querySelector("#btnUserLocation").addEventListener("click", () => {
//     if (!navigator.geolocation) {
//       alert("Geolocation is not supported by your browser.");
//       return;
//     }
//     navigator.geolocation.getCurrentPosition(pos => {
//         const { latitude, longitude } = pos.coords;
//         getLocation(latitude, longitude)
//     })
// })

// async function getLocation(latitude, longitude) {
//     try {
//         let servResponse = await fetch(`http://34.171.137.8:8000/get-location?latitude=${latitude}&longitude=${longitude}`)
//         let servData = await servResponse.json()
//         console.log(servData)
//     } catch (objError){
//         console.log('Error fetching objData', objError)
//     }
// }

    // navigator.geolocation.getCurrentPosition(
    //   (position) => {
    //     let { latitude, longitude } = position.coords;

    //     strLatitude = latitude
    //     strLongitude = longitude

    //     console.log("Latitude:", strLatitude);
    //     console.log("Longitude:", longitude);

    //     console.log(`Your location is ${strLatitude}, ${longitude}`)
    //     getLocation()
    //   },
    //   (error) => {
    //     console.error(error);
    //     alert("Unable to retrieve your location.");
    //   }
    // );
//   });



//   async function getLocation() {
//             try{
//                 let locResponse = await fetch(`https://api.open-meteo.com/v1/search?latitude=${strLatitude}&longitude=${strLongitude}&language=en&format=json`)
//                 let locData = await locResponse.json()
//                 console.log(locData)
//             } catch (objError){
//                 console.log('Error fetching objData', objError)
//             }
//         }
//         getLocation()
