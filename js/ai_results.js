import {getCounties} from "../js/iNeed.js"
let strHeader = null;

async function getAIRecommendations(userPrompt) {
    let AIContainer = document.querySelector('#suggestedResources');
    let headerEl = strHeader || document.querySelector("#txtHeader");
    if (!AIContainer || !headerEl) {
        console.error("Required AI results elements are missing from the page.");
        return;
    }
    AIContainer.innerHTML = `<p class="loading">Loading suggestions...</p>`; //placeholder text during loading
    try{
        const servResponse = await fetch(`https://ucassist.duckdns.org/prompt`, { //calls ai api
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({user_input: userPrompt})
        });

        //validation
        if (!servResponse.ok) {
            throw new Error(`HTTP error! status: ${servResponse.status}`);
        }

        let aiData = await servResponse.json()
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
            console.log(strResourceName);

            txtHTML +=`<div class="flex-row">`;
            txtHTML +=`    <h4 class="ai-title">${intCount}. ${strResourceName}</h4>`;
            txtHTML +=`    <p class="ai-company-name">`;
            txtHTML +=`        by ${strCompany}`;
            txtHTML +=`    </p>`;
            txtHTML +=`</div>`;
            txtHTML += getCounties(element)
            console.log(getCounties(element))
            txtHTML +=`<p class="ai-description">`;
            txtHTML +=`      ${strDescription}`;
            txtHTML +=`</p>`;
            txtHTML +=`<p class="btn ai-link">More Details</p>`;
            intCount++;
        });

        if (!txtHTML) {
            headerEl.innerHTML = "We couldn't find matching resources right now.";
            AIContainer.innerHTML = `<p class="mt-3">Try a different prompt or browse all available services.</p>`;
            return;
        }

        AIContainer.innerHTML = txtHTML;
    } catch (objError){
        console.log('Error fetching aiData: ', objError)

        if (headerEl) {
            headerEl.innerHTML = "Oops! We're having trouble answering your request.";
        }
        AIContainer.innerHTML = `<p class="mt-3 ">Please try again later. In the meantime, feel free to browse all available services in the Find Services tab.</p>`; //error message
    }
}
document.addEventListener("DOMContentLoaded", function() {
    let AIContainer = document.querySelector('#suggestedResources');
    strHeader = document.querySelector("#txtHeader");

    if (!AIContainer || !strHeader) {
        console.error("Required AI results elements are missing from the page.");
        return;
    }

    const prompt = sessionStorage.getItem("user_prompt"); // Get prompt
    if (!prompt) {
        strHeader.innerHTML = "Oops! Looks like you didn't enter anything."
        console.log("No prompt found in sessionStorage.");
        AIContainer.innerHTML = `<p class="mt-3 ">Please return to home and try again.</p>`; //error message
        return;
    }
    else{ getAIRecommendations(prompt)}
});
document.querySelector("#btnHome").addEventListener("click", (e) => {
    swal("Wait!", {
        title: "Before you go",
        text: "If you leave before printing the page, you will lose your recommended resources. Are you sure you want to leave?",
        icon: "warning",
        buttons: ["Leave page", "Stay and print"],
    })
    .then((travelHome) => {
        if (!travelHome) {
            window.location.href = "index.html"; // carries to ai_results page
        } 
        // else {
        //     swal("Your imaginary file is safe!");
        // }
    });
})

document.addEventListener("click", (e) => {
    if (e.target.closest("#btnPrintPage")) {
        window.print();
    }
});
