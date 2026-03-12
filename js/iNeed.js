// button handlers
console.log("[iNeed] Delegated listener active");

// shortened variable names for the categories
const keywordCategories = {
//"oneWord": "Long category name"
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
// dictionary of keywordCategories and their database sub categories
const oldKeywordLookUp = {
//"main category": ["subcategory","subcategory"],
  "Crisis": ["Abuse","Crisis Hotlines","Emergency Shelter"],
  "Housing": ["Housing", "Housing - Financial Assistance","Utilities - Financial Assistance","Home Repair","In Home Services","Utilities","Emergency Shelter","Homeless"], 
  "BasicNeeds": ["Meals","Food","Toiletries","Veteran Services","Veterans","Food Financial Assistance","Food Pantry","Clothing","Animals"], 
  "Financial": ["Budgeting","Financial Assistance","Legal"],
  "Transportation": ["Transportation","Public Transportaion","Drivers ED/DUI Classes"], 
  "Youth": ["Child Care","Parenting","Youth Services"],
  "Seniors": ["Seniors","Senior Activities","Veteran Services","Disabilties/Special Needs"],
  "Health": ["Health Care","In Home Services","Primary Care","Special Needs" ,"Wellness", "Pregnancy", "Mental Health", "Disabilities", "Substance Abuse & Addiction","Wellness/Support Groups"],
  "Education": ["Education","Employment","Workforce Development"],
  "Business": ["Small Business", "Entrepreneur", "Economic Development"],
  "Tourism": ["Recreation","Tourism and Recreation","Calendar of Events"],
  "Community": ["Community Development"]
}
// empty list of all IDs sorted by keywordCategories
let sortedIDCategories = {
//"main category": [],
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
  // gets database keywords and populates sortedIDCategories
  getUniqueKeywords()
  //populating pills
  const container = document.getElementById("divINeedPills");
  Object.entries(keywordCategories).forEach(([keyword, fullword]) => { 
    const pill = createPills(keyword, fullword);
    container.innerHTML += pill;
  })

  //javascript for scroll buttons
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
})

//EVENT LISTENER for pills (delegated to the document since pills are generated dynamically)
document.addEventListener("click", (e) => {
  const clickedCard = e.target.closest(".iNeedHover");
  if (clickedCard) {
    // Remove "selected" from all cards
    document.querySelectorAll(".iNeedHover").forEach(card => {
      card.classList.remove("selected");
    });
    // Add "selected" to the clicked card
    clickedCard.classList.add("selected");
    console.log("[iNeed] Clicked card ID:", clickedCard.id.replace("pillINeed", ""));
    loadCardsByCategory(clickedCard.id.replace("pillINeed", ""));

    
  }
});

// populating the pills based on the keywords in the database
function createPills(keyword, fullword){
  const col = document.createElement("div");
  col.className = "card col-12 mb-3 m-2 iNeedHover";
  col.style.width = "14rem";
  col.id = `pillINeed${keyword}`;

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

// creates the html for the cards
function createCard(service, category) {
  const col = document.createElement("div");
  col.className = "card m-2 col-12 border border-2 border-secondary rounded";
  col.style.maxWidth = "14rem";
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

async function getUniqueKeywords(){
  try{
    //call database api to get all services
    let servResponse = await fetch(`https://ucassist.duckdns.org/services`)
    let servData = await servResponse.json()
    let arrTagList = []

    // loops through every service in the database for keywords list
    servData.forEach((element) => {
      let currKeywords = element.Keywords
      currKeywords = currKeywords.replace(/["'\[\]]/g, '').split(",").map(keyword => keyword.trim());
      sortIDsByKeyword(currKeywords, element.ID)

      arrTagList = arrTagList.concat(currKeywords);

      // safety check
      if (!Array.isArray(arrTagList)) return;

    });

    let uniqueServiceTypes = [...new Set(arrTagList.filter(c => typeof c === "string" && c.trim().length >= 1))].sort((a, b) => a.localeCompare(b));
  } catch (objError){
    console.error("[iNeed] Error fetching services:", objError);
  }
}

//takes a service id and their keywords array
function sortIDsByKeyword(arrKeywords, id){  
  // compares service keyword with oldKeywordLookUp to get pill category name
  arrKeywords.forEach(keyword => {
    const category = Object.keys(oldKeywordLookUp).find(cat => oldKeywordLookUp[cat].includes(keyword))
    if (category in sortedIDCategories) {
      sortedIDCategories[category].push(id); 
    }
    else (
      console.log("[sortIDsByKeyword] Unknown category for id: ", id," and keyword:", keyword)
    )
  })
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
  console.log("[loadCardsByCategory] category: ",category)
  //call here
  const arrIDs = sortedIDCategories[category];
  console.log(arrIDs)

  const container = document.getElementById("divINeedContent");

  if (!container) {
    return;
  }

  container.innerHTML = "<p>Loading services...</p>";

  console.log("[loadCardsByCategory] Loading category:", category);

  try {

    const requests = arrIDs.map(id => {
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
  const strCounties = service.CountiesAvailable.toLowerCase();
  let arrCounties = strCounties.replace(/["'\[\]]/g, '').split(",").map(county => county.trim());
  let count = 0
  let innerHTML = `<div>`

  const userSelectedCounty = sessionStorage.getItem("currCounty")

  if(strCounties.includes(userSelectedCounty)){
    // console.log("[getCounties] service in county, displaying counties")
    console.log("[getService]  service: ", service.NameOfService)
    console.log("[getCounties] arrCounties: ", arrCounties)
    arrCounties.forEach(county => {
      console.log("[getCountied] count: ", count)
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
  else{
    // console.log("[getCounties] service skipped bc service not in county")
    return "";
  }
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
  if (["n/a", "none", "null", "undefined"].includes(lowered)) return `/Gov-AI/assets/images/iNeed/placeholder-img.webp`;

  if (logo.startsWith("http://") || logo.startsWith("https://") || logo.startsWith("/") || logo.startsWith("./") || logo.startsWith("../")) {
    return logo;
  }
  if (logo.startsWith("www.")) {
    return `https://${logo}`;
  }
  return `/Gov-AI/assets/images/${logo}`;
}

// function getIdsByKeyword(keyword){
//   oldKeywordLookUp = {"Crisis": ["Abuse","Crisis Hotlines","Emergency Shelter"],
//     "Housing": ["Housing", "Housing - Financial Assistance","Utilities - Financial Assistance","Home Repair","In Home Services","Utilities","Emergency Shelter","Homeless"], 
//     "BasicNeeds": ["Meals","Food","Toiletries","Veteran Services","Veterans","Food Financial Assistance","Food Pantry","Clothing","Animals"], 
//     "Financial": ["Budgeting","Financial Assistance","Legal"],
//     "Transportation": ["Transportation","Public Transportaion","Drivers ED/DUI Classes"], 
//     "Youth": ["Child Care","Parenting","Youth Services"],
//     "Seniors": ["Seniors","Senior Activities","Veteran Services","Disabilties/Special Needs"],
//     "Health": ["Health Care","In Home Services","Primary Care","Special Needs" ,"Wellness", "Pregnancy", "Mental Health", "Disabilities", "Substance Abuse & Addiction","Wellness/Support Groups"],
//     "Education": ["Education","Employment","Workforce Development"],
//     "Business": ["Small Business", "Entrepreneur"],
//     "Tourism": ["Recreation","Tourism and Recreation","Calendar of Events"],
//     "Community": ["Community Development"]}



  
// }

// cherry picked ID for each pill
// function sortIDsByCounty(id) {
  
// }




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