let arrRecomendedServices = []
const defaultLogoPath = "/Gov-AI/assets/images/placeholder-img.webp";

function getLogoSrc(rawLogo) {
    if (typeof rawLogo !== "string") {
        return "";
    }

    const logo = rawLogo.trim();
    if (!logo) {
        return "";
    }

    const lowered = logo.toLowerCase();
    if (["n/a", "none", "null", "undefined"].includes(lowered)) {
        return "";
    }

    if (logo.startsWith("http://") || logo.startsWith("https://") || logo.startsWith("/") || logo.startsWith("./") || logo.startsWith("../")) {
        return logo;
    }

    if (logo.startsWith("www.")) {
        return `https://${logo}`;
    }

    return `/Gov-AI/assets/images/${logo}`;
}

const params = new URLSearchParams(window.location.search);
const serviceId = params.get('id');

async function getServiceInformaion () {
    try{
        //Get the list of services from api
        let servResponse = await fetch(`https://ucassist.duckdns.org/service?id=${serviceId}`)
        let servData = await servResponse.json()
        let servClicks = await fetch(`https://ucassist.duckdns.org/monthly-views?service_id=${serviceId}`)
        let numClicks = await servClicks.json()
        console.log(numClicks)
        let strTagList = getTagList(servData)
        let strCounties = getCountyList(servData)
        let strDiv = ``

        strDiv += `<div class="service-header d-flex justify-content-between">
                        <button id="btnReturn" class="btn btn-secondary col-5 col-lg-3">View Services</button>
                        <button id="btnPrintPage" class="btn btn-link col-5 col-lg-3"><i class="bi bi-file-earmark-arrow-down"></i>Download PDF</button>
                    </div>`
        document.addEventListener("click", (e) => {
            if (e.target.id === "btnReturn") {
                window.location.href = "services.html";
            }
        })
        document.addEventListener("click", (e) => {
            if (e.target.closest("#btnPrintPage")) {
                window.print();
            }
        });

        //Initialize card and add name of service
        strDiv += `<div id="divOuterService">`
        strDiv += `<div id="divSpecificID" class="service" data-id="${servData.ID}" data-organization="${servData.OrganizationName}" data-tags="${strTagList}" data-counties="${strCounties}">`
        strDiv += `<h2> ${servData.NameOfService}</h2>`

        //Checks to see if service provider has a logo and uses it if so
        const logoSrc = getLogoSrc(servData.ProviderLogo);
        if (logoSrc){
            strDiv += `<h3>Offered by: <img src="${logoSrc}" alt="${servData.OrganizationName}" onerror="this.onerror=null;this.src='${defaultLogoPath}';"></h3>`
        }
        // Uses organization name if service does not have a logo
        else{
            strDiv += `<h3>Offered by: ${servData.OrganizationName}</h3>`
        }

        // Displays tags and service description
        strDiv += `<p class="mb-3">Tags: ${strTagList}</p>`
        strDiv += `<p>${servData.ServiceDescription}</p>`

        // Creates a more_info section with no display
        strDiv += `<div class="more_info">`
        strDiv += `<hr class="hr-gold">`
        strDiv += `<div class="row with-divider">`
        strDiv+= `<div class="col-12 col-md-6">`

        // Next steps section
        strDiv += `<h3 class="mb-1"><b>Next Steps:</b></h3>`

        // Checks to see if service has a telephone contact
        if (servData.TelephoneContact != 'N/A'){
            let telNumber = servData.TelephoneContact.replace(/[^\d+]/g, '');
            strDiv += `<p><i class="bi bi-telephone"></i> <a href="tel:${telNumber}"><u>${servData.TelephoneContact}</u></a></p>`
        }

        // Checks to see if service has an email contact
        if (servData.EmailContact != 'N/A'){
            strDiv += `<p><i class="bi bi-envelope"></i> <a href="mailto:${servData.EmailContact}"><u>${servData.EmailContact}</u></a></p>`
        }

        // Checks to see if a service has an address
        if (servData.ServiceAddress != 'N/A') {
            let straddress = `${servData.ServiceAddress} ${servData.CityStateZip}`.trim();
            let strencoded = encodeURIComponent(straddress);
            strDiv += `<p><i class="bi bi-pin-map"></i> <a href="https://www.google.com/maps/search/?api=1&query=${strencoded}" target="_blank"><u>${straddress}</u></a></p>`;
        }

        //Checks to see if a service has a website
        if (servData.Website != 'N/A') {
            let strurl = servData.Website.trim();

            let strhref = strurl.startsWith("http://") || strurl.startsWith("https://")
                ? strurl
                : "https://" + strurl;

            strDiv += `<p><i class="bi bi-display"></i> <a href="${strhref}" target="_blank"><u>${strurl}</u></a></p>`;
        }
        strDiv += `</div>`

        // Hours of operation section
        if (servData.HoursOfOperation != 'N/A') {

            // Veritcal divider
            strDiv +=`<div class="col-0 col-md-1 d-none d-md-flex justify-content-center align-items-center">`
            strDiv += `<div class="service-divider-vertical"></div>`
            strDiv += `</div>`

            strDiv +=`<div class="col-12 col-md-5">`
            strDiv += `<h3 class="mb-1"><b>Hours:</b></h3>`
            strDiv += `<p>${servData.HoursOfOperation}</p>`
            strDiv += `</div>`
        }
        strDiv += `</div>`

        // Checks to see if a service has any program criteria
        if (servData.ProgramCriteria != 'N/A') {
            strDiv += `<h3 class="mb-1"><b>Service Criteria:</b></h3>`
            strDiv += `<p>${servData.ProgramCriteria}</p>`
        }

        // Lists counties available
        if (servData.CountiesAvailable != 'N/A') {
            strDiv += `<h3 class="mb-1"><b>Offered In:</b></h3>`
            strDiv += `<ul>`
            strCounties.forEach(county => {
                strDiv += `<li>${county}</li>`
            })
            strDiv += `</ul>`
        }
        strDiv += `<h3 id="btnRelatedServices" class="mb-1"><b>More Like This</b><i class="bi bi-caret-down-fill"></i></h3>`
        strDiv += `<div id="related_services" style="display: none">`
        strDiv += `</div>`
        strDiv += `</div>`
        document.querySelector('#divService').innerHTML += strDiv
        document.querySelector('#btnRelatedServices').addEventListener('click', () => {
            if (arrRecomendedServices.length == 0) {
                getRecommendedServices ()
            }
            if (document.querySelector('#related_services').style.display === 'none') {
                document.querySelector('#related_services').style.display = 'block';
                document.querySelector('#btnRelatedServices').innerHTML = `<b>Fewer Like This</b><i class="bi bi-caret-up-fill"></i>`;
            } else {
                document.querySelector('#related_services').style.display = 'none';
                document.querySelector('#btnRelatedServices').innerHTML = `<b>More Like This</b><i class="bi bi-caret-down-fill"></i>`;
            }
        })


    } catch (objError){
        console.log('Error fetching objData', objError)
    }
}

getServiceInformaion ()

// Gets the list of tags for each service
function getTagList(service) {
    strKeywords = service.Keywords
    if (typeof strKeywords === 'string') {
        strKeywords = JSON.parse(strKeywords.replace(/'/g, '"'));
    }
    // Returns keywords seperated by a ','
    if (Array.isArray(strKeywords)) {
        strKeywords.forEach(tag => {
        })
        return strKeywords.join(', ');
    }
}

// Gets  the list of counties for each services
function getCountyList(service) {
    strCounties = service.CountiesAvailable
    if (typeof strCounties === 'string') {
        strCounties = JSON.parse(strCounties.replace(/'/g, '"'));
    }

    // Returns an array of strCounties
    if (Array.isArray(strCounties)) {
        return strCounties;
    }
}

// Navagates to the services page
function returnToServiceList () {
    window.location.href = `services.html`;
}

//Get the list of recommended services from api
async function getRecommendedServices () {
    try{
        let servResponse = await fetch(`https://ucassist.duckdns.org/recommendations?id=${serviceId}`)
        let servData = await servResponse.json()
        arrRecomendedServices = servData
        printRecomendedServices ()
    } catch (objError){
        console.log('Error fetching objData', objError)
    }
}

// Prints the recommended services 
function printRecomendedServices () {
    let strDiv = ''
    strDiv += `<div class="recomendedServices">`
    strDiv += `<div class="row with-divider">`

    strDiv+= `<div class="col-12 col-md-3">`
    strDiv += `<h5>${arrRecomendedServices[0].NameOfService}</h5>`
    strDiv += `<h6>Offered by: ${arrRecomendedServices[0].OrganizationName}</h6>`
    strDiv += `<button id="btnService${arrRecomendedServices[0].ID}">Learn More <i class="bi bi-caret-right-fill"></i></button>`
    strDiv += `<hr />`
    strDiv += `</div>`

    strDiv +=`<div class="col-12 col-md-1 d-none d-md-flex justify-content-center align-items-center">`
    strDiv += `<div class="service-divider-vertical"></div>`
    strDiv += `</div>`

    strDiv +=`<div class="col-12 col-md-3">`
    strDiv += `<h5>${arrRecomendedServices[1].NameOfService}</h5>`
    strDiv += `<h6>Offered by: ${arrRecomendedServices[1].OrganizationName}</h6>`
    strDiv += `<button id="btnService${arrRecomendedServices[1].ID}">Learn More <i class="bi bi-caret-right-fill"></i></button>`
    strDiv += `<hr />`
    strDiv += `</div>`

    strDiv +=`<div class="col-0 col-md-1 d-none d-md-flex justify-content-center align-items-center">`
    strDiv += `<div class="service-divider-vertical"></div>`
    strDiv += `</div>`

    strDiv +=`<div class="col-12 col-md-3">`
    strDiv += `<h5>${arrRecomendedServices[2].NameOfService}</h5>`
    strDiv += `<h6>Offered by: ${arrRecomendedServices[2].OrganizationName}</h6>`
    strDiv += `<button id="btnService${arrRecomendedServices[2].ID}">Learn More <i class="bi bi-caret-right-fill"></i></button>`
    strDiv += `</div>`
    strDiv += `</div>`
    strDiv += `</div>`
    document.querySelector('#related_services').innerHTML += strDiv

    document.querySelector(`#btnService${arrRecomendedServices[0].ID}`).addEventListener('click', () => {
        window.location.href = `service.html?id=${arrRecomendedServices[0].ID}`;
    });
    // document.querySelector(`#btnService${arrRecomendedServices[1].ID}`).addEventListener('click', () => {
    //     window.location.href = `service.html?id=${arrRecomendedServices[1].ID}`;
    // });
    // document.querySelector(`#btnService${arrRecomendedServices[2].ID}`).addEventListener('click', () => {
    //     window.location.href = `service.html?id=${arrRecomendedServices[2].ID}`;
    // });
}

const stars = document.querySelectorAll('.star');
const ratingValue = document.getElementById('rating-value');
const ratingText = document.getElementById('rating-text');

stars.forEach(star => {
  star.addEventListener('click', function () {
    const value = this.getAttribute('data-value');
    ratingValue.value = value;
    console.log(value)
    ratingText.textContent = "Rating: " + value;

    stars.forEach(s => s.classList.remove('selected'));

    for (let i = 0; i < value; i++) {
      stars[i].classList.add('selected');
    }
  });
});

stars.forEach(star => {
  star.addEventListener('click', function () {
    stars.forEach(s => s.classList.remove('selected'));

    this.classList.add('selected');
    ratingValue.value = this.getAttribute('data-value');
  });
});
