// button handlers
console.log("[iNeed] Delegated listener active");

const keywordCategories = {
  crisis: "Abuse and Crisis Intervention",
  housing: "Housing and Home Repair",
  basicNeeds: "Food and Basic Needs",
  financial: "Financial and Legal Assistance",
  transportation: "Transportation",
  youth: "Children and Youth",
  seniors: "Seniors, Aging, and Veterans",
  health: "Health and Wellness",
  education: "Education and Workforce Development",
  business: "Small Business and Entrepreneur",
  tourism: "Tourism and Events",
  community: "Economic and Community Development"
};
const keywords = ["food", "housing", "transportation", "childcare"];

window.addEventListener('load', (event) => {
  const container = document.getElementById("divINeedPills");
  keywords.forEach((keyword) => {
    const pill = createPills(keyword);
    container.innerHTML += pill;
  });
})

document.addEventListener("click", (e) => {

  // const foodBtn = e.target.closest("#pillINeedFood");
  // const housingBtn = e.target.closest("#pillINeedHousing");
  // const transportBtn = e.target.closest("#pillINeedTransportation");
  // const childcareBtn = e.target.closest("#pillINeedChildCare");

  // if (foodBtn) {
  //   loadCardsByCategory("food");
  // }

  // if (housingBtn) {
  //   loadCardsByCategory("housing");
  // }

  // if (transportBtn) {
  //   loadCardsByCategory("transportation");
  // }

  // if (childcareBtn) {
  //   loadCardsByCategory("childcare");
  // }

});


// cherry picked ID for each pill
// function getIdsByCategory(category) {
//   switch (category) {
//     case "food":
//       return [42,57,93,428];

//     case "housing":
//       return [53, 65, 91, 176 ];

//     case "transportation":
//       return [482,491,492,493];

//     case "childcare":
//       return [359, 372, 389]; 

//     default:
//       console.warn("[iNeed] Unknown category:", category);
//       return [];
//   }
// }

// populating the cards after pressing a pill
// `<div class="card" style="width: 18rem;"> good
//   <img src="..." class="card-img-top" alt="...">
//   <div class="card-body">
//     <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
//   </div>
// </div>`

function createPills(keyword){
  
  // const keywords = ["food", "housing", "transportation", "childcare"];
  // console.log(service)

  const col = document.createElement("div");
  col.className = "col-1 card m-2";
  col.style.width = "18rem";

  const img = document.createElement("img");
  img.className = "card-img-top p-3";
  img.alt = keyword;
  img.style.maxHeight = "150px";
  img.style.objectFit = "contain";

  const body = document.createElement("div");
  body.className = "card-body";

  const content = document.createElement("p");
  content.className = "card-text";
  content.textContent = keyword;

  col.appendChild(img);
  body.appendChild(content);
  col.appendChild(body);
  return col.outerHTML;
}

async function getUniqueKeywords(){
  try{
    //call database api to get all services
    let servResponse = await fetch(`https://ucassist.duckdns.org/services`)
    let servData = await servResponse.json()

    // loops through eveyr service in the database
    servData.forEach((element) => {
      let strTagList = element.Keywords;

      // convert string JSON → array
      if (typeof strTagList === "string") {
        strTagList = JSON.parse(strTagList);
      }

      // safety check
      if (!Array.isArray(strTagList)) return;

      // loops through all thw keywords in the database
      strTagList.forEach((tag) => {
        let strKeywords = tag.Keywords
        if (typeof strKeywords === 'string') {
            strKeywords = JSON.parse(strKeywords);
        }
        // Returns keywords seperated by a ','
        if (Array.isArray(strKeywords)) {
          return strKeywords;
        }
      });

      let uniqueServiceTypes = [...new Set(strTagList.filter(c => typeof c === "string" && c.trim().length >= 1))].sort((a, b) => a.localeCompare(b));
      console.log("[iNeed] Unique service types:", uniqueServiceTypes);

    });
  } catch (objError){
    console.error("[iNeed] Error fetching services:", objError);
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
      container.appendChild(createCard(service, category));
    });
  } catch (error) {
    console.error("[iNeed] Error loading services:", error);
    container.innerHTML = "<p>Please try again later.</p>";
  }
}


export function getCounties(service){
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
      innerHTML = `<div><span class="badge rounded-pill bg-secondary me-1 mb-2">All Counties</span>`
    } else if (count > 3) { // tells user how many more counties are available if there are more than three
      innerHTML += `<smaller class="row"> + ${count - 3} counties</smaller>`
    }
  innerHTML += `</div>`
  return innerHTML;
}

// creates the html for the cards
function createCard(service, category) {
  const col = document.createElement("div");
  console.log(service)
  col.className = "card m-2 col-12 border border-2 border-secondary rounded";
  col.style.maxWidth = "16rem";
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
    const imgPhoto = "/Gov-AI/assets/images/placeholder-img.webp";
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
    <img src="${imgPhoto}" class="card-img-top p-3" alt="${service.OrganizationName}" style="max-height: 150px; object-fit: contain;">
    <div class="card-body">
      ${getCounties(service)}
      <h5 class="card-title">${service.NameOfService}</h5>
      <div class="service m-0">
        <button>Learn More <i class="bi bi-caret-right-fill"></i></button>
      </div>
      </div>`;

      // Logic for the Learn More button
      col.querySelector('.service button').addEventListener('click', () => {
        callServicePage(service.ID)
      })

  return col;
}

// Shows more information on a service by calling service.html  
function callServicePage (page_id) {
    fetch(`https://ucassist.duckdns.org/add-monthly-view?service_id=${page_id}`)
    window.location.href = `../../../html/pages/service.html?id=${page_id}`;
}

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