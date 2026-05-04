// button handlers

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
  "Community": ["Community Development", "Recreation"]
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
  "Community": []
}

export function initINeed() {
  const container = document.getElementById("divINeedPills");
  const pillsContainer = document.getElementById("divINeedPills");
  const scrollLeftPills = document.getElementById("scrollLeftPills");
  const scrollRightPills = document.getElementById("scrollRightPills");
  const contentContainer = document.getElementById("divINeedContent");

  if (!container || !pillsContainer || !scrollLeftPills || !scrollRightPills || !contentContainer) {
    console.error("iNeed DOM not ready");
    return;
  }

  getUniqueKeywords();

  Object.entries(keywordCategories).forEach(([keyword, fullword]) => {
    container.innerHTML += createPills(keyword, fullword);
  });

  scrollLeftPills.onclick = () => {
    pillsContainer.scrollBy({ left: -300, behavior: "smooth" });
  };

  scrollRightPills.onclick = () => {
    pillsContainer.scrollBy({ left: 300, behavior: "smooth" });
  };
}

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
    loadCardsByCategory(clickedCard.id.replace("pillINeed", ""));

    const descriptionContainer = document.getElementById("wrapperINeedContent");
    let txtDescription = getCategoryDescription(clickedCard.id.replace("pillINeed", ""));
    document.getElementById("divINeedDescription").innerHTML = `<h5 class="white fw-light">${txtDescription}</h5>`; // Clear previous description
    descriptionContainer.innerHTML = descriptionContainer.innerHTML; //<i class="bi bi-question-circle white me-2"></i>

    
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
  img.src = `assets/images/iNeed/iNeed${keyword}.jpg`;
  


  const body = document.createElement("div");
  body.className = "card-body";

  const content = document.createElement("h5");
  content.className = "card-title";
  content.textContent = fullword;

  // makes card clickable
  const btn = document.createElement("a");
  btn.className = "stretched-link";

  col.appendChild(img);
  body.appendChild(content);
  col.appendChild(body);
  col.appendChild(btn);
  return col.outerHTML;
}

// creates the html for the cards
function createCard(service, category) {
  const col = document.createElement("div");
  col.className = "card m-2 col-12 border border-2 border-secondary rounded d-flex flex-column";
  col.style.maxWidth = "14rem";
  let websiteBtn = "";
  let imgPhoto = getLogoSrc(service.ProviderLogo);

  if(!isInCounty(service)){
    return null;
  }

  // WEBSITE BUTTON
  if (service.Website && service.Website !== "N/A") {

    let strurl = service.Website.trim();

    let strhref =
      strurl.startsWith("http://") || strurl.startsWith("https://")
        ? strurl
        : "https://" + strurl;


    websiteBtn = `<a href="${strhref}" target="_blank" class="btn btn-outline-dark mt-3">Learn More</a>`;
  }

  // replaces missing or invalid photos with category placeholder photo
  if (imgPhoto.toLowerCase() === "none" || imgPhoto === "" || imgPhoto.toLowerCase() === "n/a") {
    imgPhoto =`assets/images/iNeed/iNeed${category}.jpg`;
  }



  col.innerHTML = `
    <div class="card-body d-flex flex-column">
      <div class="card-img-top d-flex align-items-center justify-content-center" style="height: 150px; overflow: hidden;">
        <img src="${imgPhoto}" alt="${service.OrganizationName}" style="max-height: 100%; max-width: 100%; object-fit: contain;">
      </div>
      <div class="card-body d-flex flex-column">
        ${getCounties(service)}
        <h5 class="card-title">${service.NameOfService}</h5>
        <div class="mt-auto service ps-0 pe-0 m-0" style="margin-bottom: 15px;">
          <button onclick="fetchApi('/add-monthly-view?service_id=${service.ID}'); window.location.href='html/pages/service.html?id=${service.ID}';" >Learn More <i class="bi bi-caret-right-fill"></i></button>
        </div>
      </div>`;


  
  return col;
}

async function getUniqueKeywords(){
  try{
    //call database api to get all services
    let servResponse = await fetchApi(`/services`)
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
  })
}

function getImgSrc(keyword) {
  let basePath = "assets/images/iNeed/"
  let imgSrcLookUp = {
    "Crisis": "iNeedCrisis.jpg",
    "Housing": "iNeedHousing.jpg", 
    "BasicNeeds": "iNeedBasicNeeds.jpg", 
    "Financial": "iNeedFinacial.jpg",
    "Transportation": "iNeedTransportation.jpg", 
    "Youth": "iNeedYouth.jpg",
    "Seniors": "iNeedSeniors.jpg",
    "Health": "iNeedHealth.jpg",
    "Education": "iNeedEducation.jpg",
    "Business": "iNeedBusiness.jpg",
    "Community": "iNeedCommunity.jpg"
  }


  return basePath + imgSrcLookUp[keyword]
}



// gets information from the database api for the cards
async function loadCardsByCategory(category) {
  const arrIDs = sortedIDCategories[category];
  let uniqueIDs = [...new Set(arrIDs)];
  const container = document.getElementById("divINeedContent");

  if (!container) {
    return;
  }

  container.innerHTML = "<p style='color: white'>Loading services...</p>";

  try {

    const requests = uniqueIDs.map(id => {
      const url = `/service?id=${id}`;

      return fetchApi(url)
        .then(res => {
          return res.json();
        });
    });

    const services = await Promise.all(requests);

    container.innerHTML = "";

    let count = 0
    services.forEach(service => {
      let newCard = createCard(service, category)
        if (newCard == null){
          return;
        } else{
          count ++
          container.appendChild(newCard)
        }
      // }
    });
    document.getElementById("divINeedContent").innerHTML = container.innerHTML
  } catch (error) {
    console.error("[iNeed] Error loading services:", error);
    container.innerHTML = "<p>Sorry! We're having trouble loading services. Please try again later.</p>";
  }
}

function isInCounty(service){
  const strCounties = service.CountiesAvailable.toLowerCase();
  let arrCounties = strCounties.replace(/["'\[\]]/g, '').split(",").map(county => county.trim());

  const userSelectedCounty = sessionStorage.getItem("currCounty")


  if(strCounties.includes(userSelectedCounty)){
    if (strCounties.length() == 14){
      console.log("[isInCounty] all counties(",strCounties.length(),"):", strCounties)
      return false;
    }
    console.log("[isInCounty] NOT all counties(",strCounties.length(),"):",strCounties)
    return true;
  } 
  else if (userSelectedCounty == 'all'){
    return true;
  }
  else {
    return false;
  }
}


 export function getCounties(service){
  const strCounties = service.CountiesAvailable.toLowerCase();
  let arrCounties = strCounties.replace(/["'\[\]]/g, '').split(",").map(county => county.trim());
  let count = 0
  let innerHTML = `<div class="row">`
  let exCounty

  let userSelectedCounty = sessionStorage.getItem("currCounty")

  arrCounties.forEach(county => {
    if (count < 1){ // displays max three counties
      innerHTML += `<span class="col-auto badge rounded-pill gold me-1 mb-2">${county}</span>`
      exCounty = county
      count++
    }
    else{
      count ++
    }
    
  })

  if (count == 14){ // in the case of "All Counties", which is the only instance of 14 counties
    innerHTML = `<div><span class="col-auto badge rounded-pill gold me-1 mb-2">All Counties</span>`
  } else if (count == 2) { // tells user how many more counties are available if there are more than three
    if (userSelectedCounty == 'all') {
      userSelectedCounty = exCounty
    }
    innerHTML = `<div><span class="col-auto badge rounded-pill gold me-1 mb-2">${userSelectedCounty}</span>`
    innerHTML += `<smaller class="col-auto"> + ${count - 1} county</smaller>`
  } else if (count > 2) {
    if (userSelectedCounty == 'all') {
      userSelectedCounty = exCounty
    }
    innerHTML = `<div><span class="col-auto badge rounded-pill gold me-1 mb-2">${userSelectedCounty}</span>`
    innerHTML += `<smaller class="col-auto"> + ${count - 1} counties</smaller>`
  }

  innerHTML += `</div>`
  return innerHTML;
}

// Shows more information on a service by calling service.html  
function callServicePage (page_id) {
    fetchApi(`/add-monthly-view?service_id=${page_id}`)
    window.location.href = `/html/pages/service.html?id=${page_id}`;
}

function getLogoSrc(rawLogo) {
  if (typeof rawLogo !== "string") return "";

  const logo = rawLogo.trim();
  if (!logo) return "";

  const lowered = logo.toLowerCase();
  if (["n/a", "none", "null", "undefined"].includes(lowered)) return `/assets/images/iNeed/placeholder-img.jpg`;

  if (logo.startsWith("http://") || logo.startsWith("https://") || logo.startsWith("/") || logo.startsWith("./") || logo.startsWith("../")) {
    return logo;
  }
  if (logo.startsWith("www.")) {
    return `https://${logo}`;
  }
  return `/assets/images/${logo}`;
}

const btnLearnINeed = document.querySelector('#btnLearnINeed');
if (btnLearnINeed) {
  btnLearnINeed.addEventListener("click", (e) => {
    let strDiv = `
      <ol style="text-align:left; padding-left: 20px;">
        <li>Select a county above to view services in your area.</li>
        <li>Choose a category below to find what you need.</li>
      </ol>
    `;
    Swal.fire({
      title: "How to use this section.",
      html: strDiv,
      icon: "question"
    });
  });
}
function getCategoryDescription(category) {
  switch(category) {
    case "Crisis":
      return "These services provide immediate support for individuals experiencing abuse, personal crisis, or emergency situations. This section includes crisis hotlines and emergency shelter for those in urgent need.";
    case "Housing":
      return "These services assist individuals and families with finding stable housing, covering rent or utility costs, and maintaining their homes. They also support those experiencing homelessness or in need of emergency shelter.";
    case "BasicNeeds":
      return "These services connect people with essential everyday resources such as food, clothing, and toiletries. They include food pantries, meal programs, and financial assistance for groceries.";
    case "Financial":
      return "These services offer guidance and assistance with financial planning, debt management, and legal matters. They help individuals navigate budgeting and access financial aid programs.";
    case "Transportation":
      return "These services help individuals access reliable transportation options including public transit, ride assistance, and driver education programs. These offer support for those who lack access to personal vehicles.";
    case "Youth":
      return "These services support children, teens, and parents through childcare, youth programs, and parenting resources. They are focused on the healthy development and wellbeing of young people.";
    case "Seniors":
      return "These services provide support tailored to older adults, veterans, and individuals with disabilities. This Includes senior activities, in-home care, and specialized support programs.";
    case "Health":
      return "These services cover a wide range of physical and mental health services including primary care, pregnancy support, substance abuse recovery, and wellness programs. The aim is to support overall health and wellbeing.";
    case "Education":
      return "These services connect individuals with educational opportunities, job training, and workforce development programs. The goal is to help people build skills and find meaningful employment.";
    case "Business":
      return "These services support local entrepreneurs and small business owners with resources, mentorship, and economic development opportunities. These services help businesses grow and thrive in the Upper Cumberland community.";
    case "Community":
      return "These services focus on strengthening and developing the local community through organized initiatives and programs encouraging civic engagement and neighborhood improvement.";
    default:
      return "Please select a category to see available resources and services in your area.";
  }
}
