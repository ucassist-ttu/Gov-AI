// import { getTagList } from './services.js';

// const db = ['Food', 'Personal Essentials', 'Housing', 'Transportation', 'Health Care', 'Mental Health', 'Crisis Services', 'Family', 'Education', 'Employment', 'Community', 'Legal', 'Senior Services', 'Veteran Services'];
// let arrKeywords = []
// let arrAllServices = []

// function createPills(){
//   // console.log(uniqueKeywords)
// }

/* <div id="pillINeedFood" class="pill pt-2">
  <i class="bi bi-person white gold rounded-start"></i>
  <span class="pill-text bigger fw-light light_grey clr-dark-navy rounded-end">
      Food
  </span>
</div> */


// async function getKeywords() {
//     try{
//         //Get the list of services from api
//         let servResponse = await fetch(`https://ucassist.duckdns.org/services`)
//         let servData = await servResponse.json()
//         arrAllServices = servData

//         // Get all of the keywords
//         servData.forEach(element => {
//             let strTagList = getTagList(element)

//             console.log("element: ", element)        // see the raw data
//             console.log("strTagList: ", strTagList) 

//             strTagList.forEach(tag => {
//                 arrKeywords.push(tag)
//             });
//         });
//     } catch (objError){
//         console.log('Error fetching objData', objError)
//     }

//     // Remove all duplicate instances from each array
//     let uniqueKeywords = [...new Set(arrKeywords.filter(c => typeof c === "string" && c.trim().length >= 1))].sort((a, b) => a.localeCompare(b));
    
//     console.log("uniqueKeywords: " + uniqueKeywords)
// }

// getKeywords()

// button handlers
console.log("[iNeed] Delegated listener active");
const defaultCardImage = "/Gov-AI/assets/images/placeholder-img.webp";

function getLogoSrc(rawLogo) {
  if (typeof rawLogo !== "string") return "";

  const logo = rawLogo.trim();
  if (!logo) return "";

  const lowered = logo.toLowerCase();
  if (["n/a", "none", "null", "undefined"].includes(lowered)) return "";

  if (logo.startsWith("http://") || logo.startsWith("https://") || logo.startsWith("/") || logo.startsWith("./") || logo.startsWith("../")) {
    return logo;
  }
  if (logo.startsWith("www.")) {
    return `https://${logo}`;
  }
  return `/Gov-AI/assets/images/${logo}`;
}

document.addEventListener("click", (e) => {

  const foodBtn = e.target.closest("#pillINeedFood");
  const housingBtn = e.target.closest("#pillINeedHousing");
  const transportBtn = e.target.closest("#pillINeedTransportation");
  const childcareBtn = e.target.closest("#pillINeedChildCare");

  if (foodBtn) {
    loadCardsByCategory("food");
  }

  if (housingBtn) {
    loadCardsByCategory("housing");
  }

  if (transportBtn) {
    loadCardsByCategory("transportation");
  }

  if (childcareBtn) {
    loadCardsByCategory("childcare");
  }

});


// cherry picked ID for each pill
function getIdsByCategory(category) {
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
  const ids = getIdsByCategory(category);

  const container = document.getElementById("divINeedContent");

  if (!container) {
    return;
  }

  container.innerHTML = "<p>Loading services...</p>";

  console.log("[iNeed] Loading category:", category, "with IDs:", ids);

  try {

    const requests = ids.map(id => {
      const url = `https://ucassist.duckdns.org/service?id=${id}`;

      return fetch(url)
        .then(res => {
          return res.json();
        });
    });

    const services = await Promise.all(requests);

    container.innerHTML = "";

    services.forEach(service => {
      container.appendChild(createCard(service));
    });

  } catch (error) {
    console.error("[iNeed] Error loading services:", error);
    container.innerHTML = "<p>Please try again later.</p>";
  }
}


function getCounties(service){
  const strCounties = service.CountiesAvailable;
  let arrCounties = strCounties.replace(/["'\[\]]/g, '').split(",").map(county => county.trim());
  let count = 0
  let innerHTML = `<div>`

  // console.log(service.NameOfService + " counties: ")

  arrCounties.forEach(county => {
    if (count < 3){ // displays max three counties
      innerHTML += `<span class="badge rounded-pill bg-secondary me-1 mb-2">${county}</span>`
      count++
    }
    else{
      count ++
    }
    
  })

  if (count == 14){ // in the case of "All Counties", which is the only instance of 14 counties
      innerHTML = `<span class="badge rounded-pill bg-secondary me-1 mb-2">All Counties</span>`
    } else if (count > 3) { // tells user how many more counties are available if there are more than three
      innerHTML += `<smaller class="row"> + ${count - 3} counties</smaller>`
    }
  innerHTML += `</div>`
  return innerHTML;
}


// function inCounty(service){
//   let strCurrCounty = sessionStorage.getItem("currCounty");
//   let arrServiceCounties = service.CountiesAvailable;

//   let isServiced = arrServiceCounties.search(new RegExp(strCurrCounty, "i"))

//   if (isServiced != -1){ // if not found, returns -1
//     let html = `<p class="card-text text-danger">Available in ${strCurrCounty}!</p>`;
//     return html;
//   } else {
//     return "";
//   } 
// }


// creates the html for the cards
function createCard(service, category) {
  const col = document.createElement("div");
  col.className = "card m-2 col-12 col-md-5";
  col.style.width = "18rem";

  let websiteBtn = "";
  let imgPhoto = getLogoSrc(service.ProviderLogo);

  // WEBSITE BUTTON
  if (service.Website && service.Website !== "N/A") {

    let strurl = service.Website.trim();

    let strhref =
      strurl.startsWith("http://") || strurl.startsWith("https://")
        ? strurl
        : "https://" + strurl;


    websiteBtn = `<a href="${strhref}" target="_blank" class="btn btn-outline-dark mt-3">Learn More</a>`;
  } else {
  }

  // FALLBACK IMAGE
  if (!imgPhoto || imgPhoto === "N/A") {
    // console.log("[iNeed] Using fallback image for category:", category);

    switch (category) {
      case "food":
        imgPhoto = "../../assets/images/iNeedFood.jpg";
        break;

      case "housing":
        imgPhoto = "../../assets/images/iNeedHousing.jpg";
        break;

      case "childcare":
        imgPhoto = "../../assets/images/iNeedChildCare.jpg";
        break;

      case "transportation":
        imgPhoto = "../../assets/images/iNeedTransportation.jpg";
        break;

      default:
        imgPhoto = "../../assets/images/placeholder-img.webp";
    }
  }

  // try {
  //   // inCounty(service)
  //   getCounties(service)
  //   console.log("here: " + getCounties(service))
  // } catch (error) {
  //   console.error("[iNeed] Error getCounties:", error);
  // }

  col.innerHTML = `
    <img src="${imgPhoto}" class="card-img-top pt-3" alt="${service.OrganizationName}" onerror="this.onerror=null;this.src='${defaultCardImage}';">
    <div class="card-body">
        <h5 class="card-title">${service.NameOfService}</h5>
        <p class="card-text">${service.OrganizationName}</p>
        ${getCounties(service)}
        ${websiteBtn}
    </div>
  `;

  return col;
}
