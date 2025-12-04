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
                if (element.Website != 'N/A') {
                    let strurl = element.Website.trim();

                    let strhref = strurl.startsWith("http://") || strurl.startsWith("https://")
                        ? strurl
                        : "https://" + strurl;

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
    function getTagList(service) {
        strKeywords = service.Keywords
        if (typeof strKeywords === 'string') {
            strKeywords = JSON.parse(strKeywords);
        }
        if (Array.isArray(strKeywords)) {
            return strKeywords.join(', ');
        }
    }
    function getCountyList(service) {
        strCounties = service.CountiesAvailable
        if (typeof strCounties === 'string') {
            strCounties = JSON.parse(strCounties);
        }
        if (Array.isArray(strCounties)) {
            return strCounties;
        }
    }
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