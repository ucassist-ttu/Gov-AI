// button handlers
console.log("[iNeed] Delegated listener active");

document.addEventListener("click", (e) => {

  const foodBtn = e.target.closest("#pillINeedFood");
  const housingBtn = e.target.closest("#pillINeedHousing");
  const transportBtn = e.target.closest("#pillINeedTransportation");
  const childcareBtn = e.target.closest("#pillINeedChildCare");

  if (foodBtn) {
    console.log("[iNeed] Food pill clicked");
    loadCardsByCategory("food");
  }

  if (housingBtn) {
    console.log("[iNeed] Housing pill clicked");
    loadCardsByCategory("housing");
  }

  if (transportBtn) {
    console.log("[iNeed] Transportation pill clicked");
    loadCardsByCategory("transportation");
  }

  if (childcareBtn) {
    console.log("[iNeed] Childcare pill clicked");
    loadCardsByCategory("childcare");
  }

});


// cherry picked ID for each pill
function getIdsByCategory(category) {
  console.log("[iNeed] Getting IDs for category:", category);

  switch (category) {
    case "food":
      return [42,57,93,428];

    case "housing":
      return [53, 65, 91, 176 ];

    case "transportation":
      return [482,491,492,493];

    case "childcare":
      return [359, 372, 389]; 

    default:
      console.warn("[iNeed] Unknown category:", category);
      return [];
  }
}


// gets information from the database api for the cards
async function loadCardsByCategory(category) {

  console.log("[iNeed] Loading cards for category:", category);

  const ids = getIdsByCategory(category);
  console.log("[iNeed] IDs to fetch:", ids);

  const container = document.getElementById("divINeedContent");

  if (!container) {
    console.error("[iNeed] Container #divINeedContent not found!");
    return;
  }

  container.innerHTML = "<p>Loading services...</p>";

  try {

    const requests = ids.map(id => {
      const url = `https://ucassist.duckdns.org/service?id=${id}`;
      console.log("[iNeed] Fetching:", url);

      return fetch(url)
        .then(res => {
          console.log(`[iNeed] Response for ID ${id}:`, res.status);
          return res.json();
        });
    });

    const services = await Promise.all(requests);

    console.log("[iNeed] Services returned:", services);

    container.innerHTML = "";

    services.forEach(service => {
      console.log("[iNeed] Rendering service:", service.NameOfService);
      container.appendChild(createCard(service));
    });

    console.log("[iNeed] Finished rendering cards");

  } catch (error) {
    console.error("[iNeed] Error loading services:", error);
    container.innerHTML = "<p>Error loading services.</p>";
  }
}


// creates the html for the cards
function createCard(service, category) {

  console.log("[iNeed] Creating card for:", service);

  const col = document.createElement("div");
  col.className = "card m-2 col-12 col-md-5";
  col.style.width = "18rem";

  let websiteBtn = "";
  let imgPhoto = service.ProviderLogo;

  // WEBSITE BUTTON
  if (service.Website && service.Website !== "N/A") {

    let strurl = service.Website.trim();

    let strhref =
      strurl.startsWith("http://") || strurl.startsWith("https://")
        ? strurl
        : "https://" + strurl;

    console.log("[iNeed] Website link generated:", strhref);

    websiteBtn = `<a href="${strhref}" target="_blank" class="btn btn-primary">Learn More</a>`;
  } else {
    console.log("[iNeed] No website for service:", service.NameOfService);
  }

  // FALLBACK IMAGE
  if (!imgPhoto || imgPhoto === "N/A") {
    console.log("[iNeed] Using fallback image for category:", category);

    switch (category) {
      case "food":
        imgPhoto = "assets/images/iNeedFood.jpg";
        break;

      case "housing":
        imgPhoto = "assets/images/iNeedHousing.jpg";
        break;

      case "childcare":
        imgPhoto = "assets/images/iNeedChildCare.jpg";
        break;

      case "transportation":
        imgPhoto = "assets/images/iNeedTransportation.jpg";
        break;

      default:
        imgPhoto = "assets/images/placeholder-img.webp";
    }
  }

  col.innerHTML = `
    <img src="${imgPhoto}" class="card-img-top pt-3" alt="${service.OrganizationName}">
    <div class="card-body">
        <h5 class="card-title">${service.NameOfService}</h5>
        <p class="card-text">${service.OrganizationName}</p>
        <p class="card-text">${service.ServiceDescription}</p>
        ${websiteBtn}
    </div>
  `;

  return col;
}

