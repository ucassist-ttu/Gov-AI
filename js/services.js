let arrCounties = []
let arrServiceType = []
async function getServices() {
        try{
            //Get the list of services from api
            let servResponse = await fetch(`http://34.171.184.135:8000/services`)
            let servData = await servResponse.json()
            let strDiv = ``

            //Create each service card
            servData.forEach(element => {
                let strTagList = getTagList(element)
                let strCounties = getCountyList(element)

                //Initialize card and add name of service
                strDiv += `<div class="service" data-tags="${strTagList}" data-counties="${strCounties}">`
                strDiv += `<h2>${element.NameOfService}</h2>`

                //Checks to see if service provider has a logo and uses it if so
                if (element.ProviderLogo != 'N/A'){
                    strDiv += `<h3>Offered by: <img src="${element.ProviderLogo}" alt="${element.OrganizationName}"></h3>`
                }
                // Uses organization name if service does not have a logo
                else{
                    strDiv += `<h3>Offered by: ${element.OrganizationName}</h3>`
                }

                // Displays tags and service description
                strDiv += `<p class="mb-3">Tags: ${strTagList}</p>`
                strDiv += `<p>${element.ServiceDescription}</p>`

                // Creates a more_info section with no display
                strDiv += `<div class="more_info mb-4" style="display: none;">`
                strDiv += `<hr class="hr-gold"/>`
                strDiv += `<div class="row with-divider">`
                strDiv+= `<div class="col-12 col-md-6">`

                // Next steps section
                strDiv += `<h3 class="mb-1"><b>Next Steps:</b></h3>`

                // Checks to see if service has a telephone contact
                if (element.TelephoneContact != 'N/A'){
                    let telNumber = element.TelephoneContact.replace(/[^\d+]/g, '');
                    strDiv += `<p><i class="bi bi-telephone"></i> <a href="tel:${telNumber}"><u>${element.TelephoneContact}</u></a></p>`
                }

                // Checks to see if service has an email contact
                if (element.EmailContact != 'N/A'){
                    strDiv += `<p><i class="bi bi-envelope"></i> <a href="mailto:${element.EmailContact}"><u>${element.EmailContact}</u></a></p>`
                }

                // Checks to see if a service has an address
                if (element.ServiceAddress != 'N/A') {
                    let straddress = `${element.ServiceAddress} ${element.CityStateZip}`.trim();
                    let strencoded = encodeURIComponent(straddress);
                    strDiv += `<p><i class="bi bi-pin-map"></i> <a href="https://www.google.com/maps/search/?api=1&query=${strencoded}" target="_blank"><u>${straddress}</u></a></p>`;
                }

                //Checks to see if a service has a website
                if (element.Website != 'N/A') {
                    let strurl = element.Website.trim();

                    let strhref = strurl.startsWith("http://") || strurl.startsWith("https://")
                        ? strurl
                        : "https://" + strurl;

                    strDiv += `<p><i class="bi bi-display"></i> <a href="${strhref}" target="_blank"><u>${strurl}</u></a></p>`;
                }
                strDiv += `</div>`

                // Hours of operation section
                if (element.HoursOfOperation != 'N/A') {

                    // Veritcal divider
                    strDiv +=`<div class="col-0 col-md-1 d-none d-md-flex justify-content-center align-items-center">`
                    strDiv += `<div class="service-divider-vertical"></div>`
                    strDiv += `</div>`

                    strDiv +=`<div class="col-12 col-md-5">`
                    strDiv += `<h3 class="mb-1"><b>Hours:</b></h3>`
                    strDiv += `<p>${element.HoursOfOperation}</p>`
                    strDiv += `</div>`
                }
                strDiv += `</div>`

                // Checks to see if a service has any program criteria
                if (element.ProgramCriteria != 'N/A') {
                    strDiv += `<h3 class="mb-1"><b>Service Criteria:</b></h3>`
                    strDiv += `<p>${element.ProgramCriteria}</p>`
                }

                // Lists counties available
                if (element.CountiesAvailable != 'N/A') {
                    strDiv += `<h3 class="mb-1"><b>Offered In:</b></h3>`
                    strDiv += `<ul>`
                    strCounties.forEach(county => {
                        strDiv += `<li>${county}</li>`
                        arrCounties.push(county)
                    })
                    strDiv += `</ul>`
                }
                strDiv += `</div>`

                // Show more button
                strDiv += `<button>Show More<i class="bi bi-caret-down-fill"></i></button>`
                strDiv += `</div>`

                // Blue service divider
                strDiv += `<hr class="hr-blue"/>`
            });

            // Adds the service to divServices
            document.querySelector('#divServices').innerHTML += strDiv

            // Logic for show more info button
            document.querySelectorAll('.service button').forEach(button => {
                button.addEventListener('click', () => {
                    const serviceCard = button.closest('.service');
                    const moreInfoDiv = serviceCard.querySelector('.more_info');

                    // Toggles the display of show_more section
                    if (moreInfoDiv.style.display === 'none') {
                        moreInfoDiv.style.display = 'block';
                        button.innerHTML = `Show Less<i class="bi bi-caret-up-fill"></i>`;
                        serviceCard.classList.toggle('is-expanded');
                    } else {
                        moreInfoDiv.style.display = 'none';
                        button.innerHTML = 'Show More<i class="bi bi-caret-down-fill"></i>';
                        serviceCard.classList.toggle('is-expanded');
                    }
                });
            });
        } catch (objError){
            console.log('Error fetching objData', objError)
        }
        uniqueCounties = [...new Set(arrCounties.filter(c => typeof c === "string" && c.trim().length >= 1))].sort((a, b) => a.localeCompare(b));
        uniqueServiceTypes = [...new Set(arrServiceType.filter(c => typeof c === "string" && c.trim().length >= 1))].sort((a, b) => a.localeCompare(b));
        createCountyFilter(uniqueCounties)
        createServiceFilter(uniqueServiceTypes)
    }

    getServices()

    // Gets the list of tags for each service
    function getTagList(service) {
        strKeywords = service.Keywords
        if (typeof strKeywords === 'string') {
            strKeywords = JSON.parse(strKeywords);
        }
        // Returns keywords seperated by a ','
        if (Array.isArray(strKeywords)) {
            strKeywords.forEach(tag => {
                arrServiceType.push(tag)
            })
            return strKeywords.join(', ');
        }
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
    if (document.querySelector('#divOrganizationName').style.display === 'none') {
            document.querySelector('#divOrganizationName').style.display = 'block';
            document.querySelector('#btnOrganizationName').innerHTML = `Organization Name <i class="bi bi-caret-up-fill"></i>`;
    } else {
        document.querySelector('#divOrganizationName').style.display = 'none';
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
  document.getElementById("mySidenav").style.width = "0";
  overlay.classList.remove("active");
})

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
