    import {getCounties} from "../js/iNeed.js"
let strHeader = null;
let printed = false;

document.addEventListener("DOMContentLoaded", function() {
    let AIContainer = document.querySelector('#suggestedResources');
    strHeader = document.querySelector("#txtHeader");

    if (!AIContainer || !strHeader) {
        console.error("Required AI results elements are missing from the page.");
        return;
    }
    // grabs prompt from session storage
    const prompt = sessionStorage.getItem("user_prompt");
    console.log("[ai_results.js] prompt: ", prompt)

    //this should never happen beacuse of the sweet alert on index.js:ln 12
    if (!prompt) {
        strHeader.innerHTML = "<h1>Oops! Looks like you didn't enter anything.</h1>"
        console.log("No prompt found in sessionStorage.");
        AIContainer.innerHTML = `<p class="mt-3 text-dark">Please return to home and try again.</p>`; //error message
        return;
    }
    else{ getAIRecommendations(prompt)}


    //print feature
    const printBtn = document.querySelector("#btnPrintAIResults");

    if (printBtn) {
        printBtn.addEventListener("click", () => {
            printed = true;
            window.print();
        });
    } else {
        console.error("Print button not found.");
    }
});

async function getAIRecommendations(userPrompt) {
    printed = false;

    let AIContainer = document.querySelector('#suggestedResources');
    let headerEl = strHeader || document.querySelector("#txtHeader");

    if (!AIContainer || !headerEl) {
        console.error("Required AI results elements are missing from the page.");
        return;
    }

    //placeholder text while loading the ai results

    AIContainer.innerHTML = `<p class="loading text-dark">Loading suggestions...</p>`; 
    
    //calls ai api
    try{
        // console.log("Sending response:", data);
        // res.json(data);
        
        const servResponse = await fetchApi(`/prompt`, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({user_input: userPrompt})
        });

        //validation
        if (!servResponse.ok) {
            throw new Error(`HTTP error! status: ${servResponse.status}`);
        }
        let aiData = await servResponse.json()
        console.log("RAW RESPONSE:", aiData);


        AIContainer.innerHTML = ""; //clears away loading placeholder text

        // Backend returns an array directly for /prompt, but support { services: [...] } too.
        if (Array.isArray(aiData)) {
            // no-op
        } else if (Array.isArray(aiData?.services)) {
            aiData = aiData.services;
        } else {
            aiData = [];
        }
        console.log(aiData);
        
        let txtHTML = "";
        let intCount = 1;  // for numbering the services on the html

        aiData.slice(0, 3).forEach((element) => {
            let strResourceName = element.NameOfService || "Untitled service";
            let strCompany = element.OrganizationName || "Unknown organization";
            let strDescription = element.ServiceDescription || "No description available.";
            // let strPhone = element.TelephoneContact || "No Phone Number available.";
            let rawPhone = element.TelephoneContact || "";
            let strPhone = rawPhone ? rawPhone.replace(/[^\d+]/g, '') : "";
            // let strAddress = element.ServiceAddress || "No Address available.";
            let strEmail = element.EmailContact || "No Email available.";
            console.log(strResourceName);

            txtHTML +=`<div class="flex-row text-dark">`;
            txtHTML +=`    <h4 class="ai-title mt-3">${intCount}. <a onclick="fetchApi('/add-monthly-view?service_id=${element.ID}'); window.location.href='/html/pages/service.html?id=${element.ID}';" style="cursor: pointer"><u>${strResourceName}</u></a></h4>`;
            txtHTML +=`    <p class="ai-company-name">`;
            txtHTML +=`        by ${strCompany}`;
            txtHTML +=`    </p>`;
            const countiesHTML = getCounties(element);
            if (countiesHTML) {
                txtHTML += countiesHTML;
            }

            txtHTML +=`<p class="ai-description">`;
            txtHTML +=`      ${strDescription}`;
            txtHTML +=`</p>`;
            txtHTML += `<p class="pt-2"><i class="bi bi-telephone"></i> <a href="tel:${strPhone}"><u>${strPhone}</u></a></p>`
            // Email Existance Check
            if (strEmail != 'No Email available') {
                txtHTML += `<p><i class="bi bi-envelope"></i> <a href="mailto:${strEmail}"><u>${strEmail}</u></a></p>`

            }else{
                txtHTML +=`<p><i class="bi bi-envelope"></i>No Email available.</p>`
            }
            // Address Existance Check
            if (element.ServiceAddress != 'N/A') {
                let straddress = `${element.ServiceAddress} ${element.CityStateZip}`.trim();
                let strencoded = encodeURIComponent(straddress);
                txtHTML += `<p><i class="bi bi-pin-map"></i> <a href="https://www.google.com/maps/search/?api=1&query=${strencoded}" target="_blank"><u>${straddress}</u></a></p>`;
            }
            else{
                txtHTML +=`<p><i class="bi bi-pin-map"></i>No Address available.</p>`
            }
            // callServicePage(serviceId)
            // txtHTML +=`<button class="btn btn-primary text-dark" onclick="fetchApi('/add-monthly-view?service_id=${element.ID}'); window.location.href='/html/pages/service.html?id=${element.ID}';" style="cursor: pointer">More Details</button>`;
            if (intCount != 3) {
                txtHTML += `<hr class="hr-gold"/>`
            }
            intCount++;
        });

        await sendSearchAnalytics(userPrompt, aiData);

        if (!txtHTML) {
            headerEl.innerHTML = "We couldn't find matching resources right now.";
            AIContainer.innerHTML = `<p class="mt-5 mb-4 text-dark">Please try rephrasing your question or browse all available services on the Find Services page.</p>
                                     <a href="./services.html" class=" rounded-pill p-2 border h5 ts-5 mt-5 mt-5 text-decoration-none text-nowrap">Find Services <i class="bi bi-caret-right-fill"></i></a>`;

            // console.log("0 Result AI Search", {
            //     page: window.location.pathname,
            //     timestamp: new Date().toISOString()
            // });

            return;
        }

        AIContainer.innerHTML = txtHTML;
    } catch (objError){
        console.log('Error fetching aiData: ', objError)

        if (headerEl) {
            headerEl.innerHTML = "<h1>Oops! We're having trouble answering your request.</h1>";
        }
        //error message
        AIContainer.innerHTML = `<p class="mt-5 mb-4 text-dark">Please try again later. In the meantime, feel free to browse all available services in the Find Services tab. </p>
                                 <a href="./services.html" class="rounded-pill p-2 border h5 ts-5 mt-5 mt-5 text-dark text-decoration-none text-nowrap">Go Now <i class="bi bi-caret-right-fill"></i></a>`;
    }
}

// document.addEventListener("DOMContentLoaded", function() {
//     let AIContainer = document.querySelector('#suggestedResources');
//     strHeader = document.querySelector("#txtHeader");

//     if (!AIContainer || !strHeader) {
//         console.error("Required AI results elements are missing from the page.");
//         return;
//     }

//     const prompt = sessionStorage.getItem("user_prompt"); // Get prompt
//     if (!prompt) {
//         strHeader.innerHTML = "Oops! Looks like you didn't enter anything."
//         console.log("No prompt found in sessionStorage.");
//         AIContainer.innerHTML = `<p class="mt-3 ">Please return to home and try again.</p>`; //error message
//         return;
//     }
//     else{ getAIRecommendations(prompt)}
// });


// document.querySelector("#btnHome").addEventListener("click", (e) => {
//     swal.fire("Wait!", {
//         title: "Before you go",
//         text: "If you leave before printing the page, you will lose your recommended resources. Are you sure you want to leave?",
//         icon: "warning",
//         buttons: ["Leave page", "Stay and print"],
//     })
//     .then((travelHome) => {
//         if (!travelHome) {
//             window.location.href = "index.html"; // carries to ai_results page
//         } 
//         else {
//             swal.fire("Your imaginary file is safe!");
//         }
//     });
// })

document.querySelector("#btnPrintAIResults").addEventListener("click", (e) => {
    printed = true;
    window.print();
})
// document.addEventListener("click", (e) => {
//     if (e.target.closest("#btnPrintAIResults")) {
//         printed = true;
//         window.print();
//     }
// });

// window.addEventListener('beforeunload', () => {
//     console.log("AI Results Page Left", {
//         page: window.location.pathname,
//         timestamp: new Date().toISOString(),
//         printed: printed
//     });
// });

async function sendSearchAnalytics(userPrompt, aiData) {
    const payload = {
        searchType: "AI",
        timeStamp: new Date().toISOString(),
        search: userPrompt,
        results: aiData.length,
        county: sessionStorage.getItem("currCounty"),
        checked: null
    };

    try {
        const response = await fetchApi("/add-search-analytics", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const text = await response.text();
        console.log("RAW RESPONSE:", text);

        let data = null;
        if (text) {
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.warn("Response was not JSON:", text);
            }
        }

        return data;

    } catch (err) {
        console.error("Failed to send search analytics:", err);
    }
}