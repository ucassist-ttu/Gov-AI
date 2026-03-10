// button handlers
console.log("[iNeed] Delegated listener active");

const keywordCategories = {
  "Crisis": "Abuse and Crisis Intervention",
  "Housing": "Housing and Home Repair",
  "BasicNeeds": "Food and Basic Needs",
  "Financial": "Financial and Legal Assistance",
  "Transportation": "Transportation",
  "Youth": "Children and Youth",
  "Seniors": "Seniors, Aging, and Veterans",
  "Health": "Health and Wellness",
  "Education": "Education and Workforce Development",
  "Business": "Small Business and Entrepreneur",
  "Tourism": "Tourism and Events",
  "Community": "Economic and Community Development"
};
let sortedIDCategories = {
  "Crisis": [],
  "Housing": [],
  "BasicNeeds": [],
  "Financial": [],
  "Transportation": [],
  "Youth": [],
  "Seniors": [],
  "Health": [],
  "Education": [],
  "Business": [],
  "Tourism": [],
  "Community": []
}

window.addEventListener('load', (event) => {
  getUniqueKeywords()

  const container = document.getElementById("divINeedPills");
  Object.entries(keywordCategories).forEach(([keyword, fullword]) => { 
    const pill = createPills(keyword, fullword);
    container.innerHTML += pill;
  })
})

//ARROW SCROLLING
const pillsContainer = document.getElementById("divINeedPills");
document.getElementById("scrollLeftPills").onclick = () => {
  pillsContainer.scrollBy({ left: -300, behavior: "smooth" });
};
document.getElementById("scrollRightPills").onclick = () => {
  pillsContainer.scrollBy({ left: 300, behavior: "smooth" });
};
const contentContainer = document.getElementById("divINeedContent");
document.getElementById("scrollLeftContent").onclick = () => {
  contentContainer.scrollBy({ left: -300, behavior: "smooth" });
};
document.getElementById("scrollRightContent").onclick = () => {
  contentContainer.scrollBy({ left: 300, behavior: "smooth" });
};

//pill button event listener (delegated to the document since pills are generated dynamically)
document.addEventListener("click", (e) => {
  const clickedCard = e.target.closest(".iNeedHover");
  if (clickedCard) {
    // Remove "selected" from all cards
    document.querySelectorAll(".iNeedHover").forEach(card => {
      card.classList.remove("selected");
    });
    // Add "selected" to the clicked card
    clickedCard.classList.add("selected");
  }
});

// document.addEventListener("click", (e) => {


//   const foodBtn = e.target.closest("#pillINeedFood");
//   const housingBtn = e.target.closest("#pillINeedHousing");
//   const transportBtn = e.target.closest("#pillINeedTransportation");
//   const childcareBtn = e.target.closest("#pillINeedChildCare");

//   if (foodBtn) {
//     loadCardsByCategory("food");
//   }

//   if (housingBtn) {
//     loadCardsByCategory("housing");
//   }

//   if (transportBtn) {
//     loadCardsByCategory("transportation");
//   }

//   if (childcareBtn) {
//     loadCardsByCategory("childcare");
//   }

// });


// populating the cards after pressing a pill
function createPills(keyword, fullword){
  const col = document.createElement("div");
  col.className = "card col-12 mb-3 m-2 iNeedHover";
  col.style.width = "14rem";
  col.id = `pillINeed${keyword}`;
  col.onclick = () => loadCardsByCategory(keyword);

  const img = document.createElement("img");
  img.className = "card-img-top";
  img.alt = fullword;
  img.style.maxHeight = "100px";
  img.style.objectFit = "cover";
  // img.src = getImgSrc(keyword);
  img.src = `assets/images/iNeed/iNeed${keyword}.jpg`;


  const body = document.createElement("div");
  body.className = "card-body";

  const content = document.createElement("h5");
  content.className = "card-title";
  content.textContent = fullword;

  // makes card clickable
  const btn = document.createElement("a");
  btn.className = "stretched-link";
  btn.href = "#";

  col.appendChild(img);
  body.appendChild(content);
  col.appendChild(body);
  col.appendChild(btn);
  return col.outerHTML;
}

async function getUniqueKeywords(){
  try{
    //call database api to get all services
    let servResponse = await fetch(`https://ucassist.duckdns.org/services`)
    let servData = await servResponse.json()
    let arrTagList = []

    console.log("here 1")

    // loops through every service in the database for keywords list
    servData.forEach((element) => {
      let currKeywords = element.Keywords
      currKeywords = currKeywords.replace(/["'\[\]]/g, '').split(",").map(keyword => keyword.trim());

      console.log("here 2")
      arrTagList = arrTagList.concat(currKeywords);

      // safety check
      if (!Array.isArray(arrTagList)) return;

    });
    console.log(arrTagList)

    // loops through all the keywords in the database
    arrTagList.forEach((tag) => {
        let strKeywords = tag
        console.log("Type of keywords: " + typeof strKeywords)
        strKeywords = service.Keywords
        if (typeof strKeywords === 'string') {
            strKeywords = JSON.parse(strKeywords);
        }
        // Returns keywords seperated by a ','
        if (Array.isArray(strKeywords)) {
            return strKeywords;
    }
      });

      let uniqueServiceTypes = [...new Set(arrTagList.filter(c => typeof c === "string" && c.trim().length >= 1))].sort((a, b) => a.localeCompare(b));
      console.log("[iNeed] Unique service types:", uniqueServiceTypes);

  } catch (objError){
    console.error("[iNeed] Error fetching services:", objError);
  }

}

function getImgSrc(keyword) {
  let basePath = "assets/images/iNeed/"
  let imgSrcLookUp = {
    "Crisis": " ",
    "Housing": "INeedHousing.jpg", 
    "BasicNeeds": "iNeedFood.jpg", 
    "Financial": "",
    "Transportation": "placeholder-img.webp", 
    "Youth": "iNeedChildCare.jpg",
    "Seniors": "Seniors, Aging, and Veterans",
    "Health": "Health and Wellness",
    "Education": "Education and Workforce Development",
    "Business": "Small Business and Entrepreneur",
    "Tourism": "Tourism and Events",
    "Community": "Economic and Community Development"
  }

  return basePath + imgSrcLookUp[keyword]
}

// gets information from the database api for the cards
async function loadCardsByCategory(category) { //getKeywordIDs
  //call dns
  let servResponse = await fetch(`https://ucassist.duckdns.org/services`)
  let servData = await servResponse.json()

  // loops through every service in the database
  servData.forEach((element) => {
    currKeywords = element.Keywords
    // sortedIDCategories = ;
  })

  //filter by keywords

  //call here



  // const ids = getIdsByCategory(category);

  // const container = document.getElementById("divINeedContent");

  // if (!container) {
  //   return;
  // }

  // container.innerHTML = "<p>Loading services...</p>";

  // console.log("[iNeed] Loading category:", category, "with IDs:", ids);

  // try {

  //   const requests = ids.map(id => {
  //     const url = `https://ucassist.duckdns.org/service?id=${id}`;

  //     return fetch(url)
  //       .then(res => {
  //         return res.json();
  //       });
  //   });

  //   const services = await Promise.all(requests);

  //   container.innerHTML = "";

  //   services.forEach(service => {
  //     container.appendChild(createCard(service, category));
  //   });
  // } catch (error) {
  //   console.error("[iNeed] Error loading services:", error);
  //   container.innerHTML = "<p>Please try again later.</p>";
  // }
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
        break;
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