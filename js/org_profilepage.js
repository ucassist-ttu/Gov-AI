// Prints the recommended services 
function printRecomendedServices () {
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

  // Department Header
  strDiv += `<div id="divOuterService" class="d-flex justify-content-center align-items-center">`

  strDiv += `<div id="divSpecificID" class="col-11 col-md-9">`
  const logoSrc = getLogoSrc(servData.ProviderLogo);
  if (logoSrc){
    strDiv += `<section class="bg-dark-navy mt-4 w-100" aria-labelledby="dept-header">
        <img src="${logoSrc}" alt="${servData.OrganizationName}" onerror="this.onerror=null;this.src='${defaultLogoPath}';"></h3>
      </section>`
  }
  strDiv += `<h3>Offered by: ${servData.OrganizationName}</h3>`
  strDiv += `<p>${servData.ServiceDescription}</p>`
  strDiv += `<hr class="hr-gold">`

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
  }

  strDiv += `</div>`
  strDiv += `</div>`
  document.querySelector('#divService').innerHTML += strDiv
}
printRecomendedServices ()

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