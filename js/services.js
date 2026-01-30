<<<<<<< HEAD
<<<<<<< HEAD
async function getServices() {
        try{
            let servResponse = await fetch(`http://34.171.137.8:8000/services`)
            let servData = await servResponse.json()
            let strDiv = ``

            servData.forEach(element => {
                let strTagList = getTagList(element)
                let strCounties = getCountyList(element)
                strDiv += `<div class="service" data-tags="${strTagList}" data-counties="${strCounties}">`
                strDiv += `<h2>${element.NameOfService}</h2>`
                strDiv += `<h3>Offered by: ${element.OrganizationName}</h3><hr />`

                strDiv += `<p class="mb-3">Tags: ${strTagList}</p>`
                strDiv += `<p>${element.ServiceDescription}</p>`
                strDiv += `<div class="more_info mb-4" style="display: none;">`
                strDiv += `<hr />`
                if (element.ProgramCriteria != 'N/A') {
                    strDiv += `<h3 class="mb-1"><b>Service Criteria:</b></h3>`
                    strDiv += `<p>${element.ProgramCriteria}</p>`
                }
                if (element.CountiesAvailable != 'N/A') {
                    strDiv += `<h3 class="mb-1"><b>Offered In:</b></h3>`
                    strDiv += `<ul>`
                    strCounties.forEach(county => {
                        strDiv += `<li>${county}</li>`
                    })
                    strDiv += `</ul>`
                }
                strDiv += `<div class="row">
                            <div class="col-12 col-md-6">`
                strDiv += `<h3 class="mb-1"><b>Next Steps:</b></h3>`
                if (element.TelephoneContact != 'N/A'){
                    let telNumber = element.TelephoneContact.replace(/[^\d+]/g, '');
                    strDiv += `<p>Call <a href="tel:${telNumber}"><u>${element.TelephoneContact}</u></a></p>`
                }
                if (element.EmailContact != 'N/A'){
                    strDiv += `<p>Email <a href="mailto:${element.EmailContact}"><u>${element.EmailContact}</u></a></p>`
                }
                if (element.ServiceAddress != 'N/A') {
                    let straddress = `${element.ServiceAddress} ${element.CityStateZip}`.trim();
                    let strencoded = encodeURIComponent(straddress);

                    strDiv += `<p>Go to <a href="https://www.google.com/maps/search/?api=1&query=${strencoded}" target="_blank"><u>${straddress}</u></a></p>`;
                }
=======
=======
>>>>>>> 3f0d1cc3f2ee3f2a8f63db0c8e2c4ab2e6613d5f
let arrCounties = []
let arrServiceType = []
let arrOrgName = []
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
                strDiv += `<div id="divOuterService">`
                strDiv += `<div class="service" data-organization="${element.OrganizationName}" data-tags="${strTagList}" data-counties="${strCounties}">`
                strDiv += `<h2>${element.NameOfService}</h2>`

                //Checks to see if service provider has a logo and uses it if so
                if (element.ProviderLogo != 'N/A'){
                    strDiv += `<h3>Offered by: <img src="${element.ProviderLogo}" alt="${element.OrganizationName}"></h3>`
                }
                // Uses organization name if service does not have a logo
                else{
                    strDiv += `<h3>Offered by: ${element.OrganizationName}</h3>`
                    arrOrgName.push(element.OrganizationName)
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
<<<<<<< HEAD
>>>>>>> 3f0d1cc3f2ee3f2a8f63db0c8e2c4ab2e6613d5f
=======
>>>>>>> 3f0d1cc3f2ee3f2a8f63db0c8e2c4ab2e6613d5f
                if (element.Website != 'N/A') {
                    let strurl = element.Website.trim();

                    let strhref = strurl.startsWith("http://") || strurl.startsWith("https://")
                        ? strurl
                        : "https://" + strurl;

<<<<<<< HEAD
<<<<<<< HEAD
                    strDiv += `<p>Visit their website <a href="${strhref}" target="_blank"><u>${strurl}</u></a></p>`;
                }

                strDiv += `</div><div class="col-12 col-md-6">`
                if (element.HoursOfOperation != 'N/A') {
                    strDiv += `<h3 class="mb-1"><b>Hours:</b></h3>`
                    strDiv += `<p>${element.HoursOfOperation}</p>`
                }
                strDiv += `</div></div>`
                strDiv += `</div>`
                strDiv += `<button>Show More<i class="bi bi-caret-down-fill"></i></button>`
                strDiv += `</div>`
                console.log(element)
            });
            document.querySelector('#divServices').innerHTML += strDiv
            document.querySelectorAll('.service button').forEach(button => {
                button.addEventListener('click', () => {
                    const moreInfoDiv = button.previousElementSibling;

                    if (moreInfoDiv.style.display === 'none') {
                        moreInfoDiv.style.display = 'block';
                        button.innerHTML = `Show Less<i class="bi bi-caret-up-fill"></i>`;
                    } else {
                        moreInfoDiv.style.display = 'none';
                        button.innerHTML = 'Show More<i class="bi bi-caret-down-fill"></i>';
                    }
                });
            })
            showPage(1);
        } catch (objError){
            console.log('Error fetching objData', objError)
        }
    }
    getServices()
=======
=======
>>>>>>> 3f0d1cc3f2ee3f2a8f63db0c8e2c4ab2e6613d5f
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
                strDiv += `</div>`
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
        uniqueOrgNames = [...new Set(arrOrgName.filter(c => typeof c === "string" && c.trim().length >= 1))].sort((a, b) => a.localeCompare(b));
        createCountyFilter(uniqueCounties)
        createServiceFilter(uniqueServiceTypes)
        createOrgNamesFilter(uniqueOrgNames)
    }

    getServices()

    // Gets the list of tags for each service
<<<<<<< HEAD
>>>>>>> 3f0d1cc3f2ee3f2a8f63db0c8e2c4ab2e6613d5f
=======
>>>>>>> 3f0d1cc3f2ee3f2a8f63db0c8e2c4ab2e6613d5f
    function getTagList(service) {
        strKeywords = service.Keywords
        if (typeof strKeywords === 'string') {
            strKeywords = JSON.parse(strKeywords);
        }
<<<<<<< HEAD
<<<<<<< HEAD
        if (Array.isArray(strKeywords)) {
            return strKeywords.join(', ');
        }
    }
=======
=======
>>>>>>> 3f0d1cc3f2ee3f2a8f63db0c8e2c4ab2e6613d5f
        // Returns keywords seperated by a ','
        if (Array.isArray(strKeywords)) {
            strKeywords.forEach(tag => {
                arrServiceType.push(tag)
            })
            return strKeywords.join(', ');
        }
    }

    // Gets  the list of counties for each services
<<<<<<< HEAD
>>>>>>> 3f0d1cc3f2ee3f2a8f63db0c8e2c4ab2e6613d5f
=======
>>>>>>> 3f0d1cc3f2ee3f2a8f63db0c8e2c4ab2e6613d5f
    function getCountyList(service) {
        strCounties = service.CountiesAvailable
        if (typeof strCounties === 'string') {
            strCounties = JSON.parse(strCounties);
        }
<<<<<<< HEAD
<<<<<<< HEAD
=======

        // Returns an array of strCounties
>>>>>>> 3f0d1cc3f2ee3f2a8f63db0c8e2c4ab2e6613d5f
=======

        // Returns an array of strCounties
>>>>>>> 3f0d1cc3f2ee3f2a8f63db0c8e2c4ab2e6613d5f
        if (Array.isArray(strCounties)) {
            return strCounties;
        }
    }
<<<<<<< HEAD
<<<<<<< HEAD
    document.querySelector("#divFilter").addEventListener("click", (e) => {

        const filterBar = e.currentTarget;
        const content = filterBar.nextElementSibling;
        const icon = filterBar.querySelector("i");

        const isHidden = content.style.display === "" || content.style.display === "none";

        if (isHidden) {
            content.style.display = "block";
            icon.classList.remove("bi-caret-down-fill");
            icon.classList.add("bi-caret-up-fill");
        } else {
            content.style.display = "none";
            icon.classList.remove("bi-caret-up-fill");
            icon.classList.add("bi-caret-down-fill");
        }
    });

    document.querySelectorAll(".specific_filter").forEach(filter => {
        filter.addEventListener("click", (e) => {
            const filterBar = e.currentTarget;
            const content = filterBar.querySelector("div");   // the hidden div inside
            const icon = filterBar.querySelector("i");

            const isHidden = content.style.display === "" || content.style.display === "none";

            if (isHidden) {
                content.style.display = "block";
                icon.classList.remove("bi-caret-down-fill");
                icon.classList.add("bi-caret-up-fill");
            } else {
                content.style.display = "none";
                icon.classList.remove("bi-caret-up-fill");
                icon.classList.add("bi-caret-down-fill");
            }
        });
    });
    document.querySelectorAll('.filter-option').forEach(option => {
        option.addEventListener('click', () => {
            event.stopPropagation();
            option.classList.toggle('selected');
        });
    });
    
    
    document.getElementById("btnFilter").addEventListener("click", function() {
        applyFilters();
        showPage(1)
    });
    document.getElementById("btnResetFilter").addEventListener("click", function() {
        // 1️⃣ Remove selection from all filters
        document.querySelectorAll(".filter-option.selected").forEach(opt => opt.classList.remove("selected"));

        // 2️⃣ Show all cards logically
        const allCards = Array.from(document.querySelectorAll(".service"));
        filteredCards = allCards; // important! update filteredCards

        // 3️⃣ Reset pagination to page 1
        currentPage = 1;
        showPage(currentPage);
    });

    function getSelected(containerId) {
        return Array.from(
            document.querySelectorAll(`#${containerId} .filter-option.selected`)
        ).map(el => el.dataset.value);
    }
=======
=======
>>>>>>> 3f0d1cc3f2ee3f2a8f63db0c8e2c4ab2e6613d5f

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
  document.getElementById("mySidenav").style.width = "0";
  overlay.classList.remove("active");
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
    const outerServices = document.querySelectorAll("#divOuterService");
    outerServices.forEach(outer => {
        outer.style.display = "block";
    });
})

function getSelectedCheckboxes(containerId) {
    return Array.from(
        document.querySelectorAll(`#${containerId} input[type="checkbox"]:checked`)
    ).map(el => el.value);
}

document.getElementById('divAllFilter').addEventListener('change', (e) => {
    if (e.target && e.target.matches('input[type="checkbox"]')) {
        const selectedCounties = getSelectedCheckboxes("divOuterCounties");
        const selectedServiceTypes = getSelectedCheckboxes("divOuterServiceTypes");
        const selectedOrgNames = getSelectedCheckboxes("divOuterOrgName");

        // Loop through each outer container
        const outerServices = document.querySelectorAll("#divOuterService");
        outerServices.forEach(outer => {
            const card = outer.querySelector(".service");

            const counties = card.dataset.counties.toLowerCase().split(",").map(c => c.trim());
            const serviceType = card.dataset.tags.toLowerCase().split(",").map(c => c.trim());
            const orgName = card.dataset.organization.toLowerCase().split(",").map(c => c.trim());

            let countyMatch = true;
            if (selectedCounties.length > 0) {
                countyMatch = selectedCounties.some(county => counties.includes(county.toLowerCase()));
            }
            let serviceMatch = true;
            if (selectedServiceTypes.length > 0) {
                serviceMatch = selectedServiceTypes.some(service => serviceType.includes(service.toLowerCase()));
            }
            let orgMatch = true;
            if (selectedOrgNames.length > 0) {
                orgMatch = selectedOrgNames.some(org => orgName.includes(org.toLowerCase()));
            }

            outer.style.display = (countyMatch && serviceMatch && orgMatch) ? "block" : "none";
        });
    }
});


<<<<<<< HEAD
>>>>>>> 3f0d1cc3f2ee3f2a8f63db0c8e2c4ab2e6613d5f
=======
>>>>>>> 3f0d1cc3f2ee3f2a8f63db0c8e2c4ab2e6613d5f


    // function applyFilters() {

    //     const selectedTags = getSelected("divServiceFilter");
    //     const selectedCounties = getSelected("divCountiesFilter");
    //     console.log(selectedTags)
    //     console.log(selectedCounties)

    //     const cards = document.querySelectorAll(".service");

    //     cards.forEach(card => {

    //         const tags = card.dataset.tags.split(",").map(t => t.trim());
    //         const counties = card.dataset.counties.split(",").map(c => c.trim());

    //         // ✔ TAG MATCH
    //         let tagMatch = true;  // default (no tag filters applied)
    //         if (selectedTags.length > 0) {
    //             tagMatch = selectedTags.some(tag => tags.includes(tag));
    //         }

    //         // ✔ COUNTY MATCH
    //         let countyMatch = true; // default (no county filters applied)
    //         if (selectedCounties.length > 0) {
    //             countyMatch = selectedCounties.some(cty => counties.includes(cty));
    //         }

    //         // ✔ MUST MATCH BOTH GROUPS
    //         if (tagMatch && countyMatch) {
    //             card.style.display = "block";
    //         } else {
    //             card.style.display = "none";
    //         }
    //     });
    // }

<<<<<<< HEAD
<<<<<<< HEAD
    // let currentPage = 1;
    // const itemsPerPage = 10;

    // function showPage(pageNumber) {
    //     const cards = Array.from(document.querySelectorAll(".service")).filter(card => card.style.display !== "none");
    //     const totalCards = cards.length;
    //     const totalPages = Math.ceil(totalCards / itemsPerPage);

    //     if (pageNumber < 1) pageNumber = 1;
    //     if (pageNumber > totalPages) pageNumber = totalPages;

    //     currentPage = pageNumber;

    //     cards.forEach((card, index) => {
    //         if (index < (pageNumber - 1) * itemsPerPage || index >= pageNumber * itemsPerPage) {
    //             card.style.display = "none";
    //         } else {
    //             card.style.display = "block";
    //         }
    //     });

    //     updatePageControls(totalPages);
    // }
    let currentPage = 1;
    const itemsPerPage = 10;
    let filteredCards = []; // holds currently filtered cards

    function applyFilters() {
        const selectedTags = getSelected("divServiceFilter");
        const selectedCounties = getSelected("divCountiesFilter");

        const cards = Array.from(document.querySelectorAll(".service"));

        // Determine filtered cards
        filteredCards = cards.filter(card => {
            const tags = card.dataset.tags.split(",").map(t => t.trim());
            const counties = card.dataset.counties.split(",").map(c => c.trim());

            const tagMatch = selectedTags.length === 0 || selectedTags.some(tag => tags.includes(tag));
            const countyMatch = selectedCounties.length === 0 || selectedCounties.some(cty => counties.includes(cty));

            return tagMatch && countyMatch;
        });

        // Hide all cards first
        cards.forEach(card => card.style.display = "none");

        // Show first page
        currentPage = 1;
        showPage(currentPage);
    }

    function showPage(pageNumber) {
        if (!filteredCards) return;

        const totalCards = filteredCards.length;
        const totalPages = Math.ceil(totalCards / itemsPerPage);

        if (totalPages === 0) {
            updatePageControls(0);
            return;
        }

        if (pageNumber < 1) pageNumber = 1;
        if (pageNumber > totalPages) pageNumber = totalPages;
        currentPage = pageNumber;

        // Hide all filtered cards first
        filteredCards.forEach(card => card.style.display = "none");

        // Show only cards for current page
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        filteredCards.slice(start, end).forEach(card => card.style.display = "block");

        updatePageControls(totalPages);

        // Optional: scroll to top
        const container = document.getElementById("servicesContainer");
        if (container) container.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function updatePageControls(totalPages) {
        const divPages = document.getElementById("divPages");
        if (!divPages) return;

        divPages.innerHTML = "";

        if (totalPages === 0) {
            divPages.innerHTML = "<span>No results</span>";
            return;
        }

        let html = "";
        if (currentPage > 1) html += `<button class="btn btn-secondary m-2" onclick="showPage(${currentPage - 1})">Previous</button>`;
        html += `<span> Page ${currentPage} of ${totalPages} </span>`;
        if (currentPage < totalPages) html += `<button class="btn btn-secondary m-2" onclick="showPage(${currentPage + 1})">Next</button>`;

        divPages.innerHTML = html;
    }



    // function updatePageControls(totalPages) {
    //     const pages = document.getElementById("pages");
    //     divPages.innerHTML = "";

    //     if (totalPages <= 1) return; // no need for controls
        
    //     if (currentPage > 1) {
    //         console.log("here")
    //         prevBtn = `<button class="btn btn-secondary m-2" onclick="showPage(${currentPage - 1})">Previous</button>`;
    //         divPages.innerHTML += prevBtn
    //     }

    //     const pageInfo = `<span>Page ${currentPage} of ${totalPages}</span>`;
    //     divPages.innerHTML += pageInfo

    //     if (currentPage < totalPages) {
    //         nextBtn = `<button class="btn btn-secondary m-2" onclick="showPage(${currentPage + 1})">Next</button>`;
    //         divPages.innerHTML += nextBtn
    //     }
    // }
=======
=======
>>>>>>> 3f0d1cc3f2ee3f2a8f63db0c8e2c4ab2e6613d5f





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
<<<<<<< HEAD
>>>>>>> 3f0d1cc3f2ee3f2a8f63db0c8e2c4ab2e6613d5f
=======
>>>>>>> 3f0d1cc3f2ee3f2a8f63db0c8e2c4ab2e6613d5f
