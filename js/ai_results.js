async function getAIRecommendations(userPrompt) {
    let AIContainer = document.querySelector('#suggestedResources');
    AIContainer.innerHTML = `<p class="loading">Loading suggestions...</p>`; //placeholder text during loading
    try{
        const servResponse = await fetch(`http://34.171.184.135:8000/prompt`, { //calls ai api
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({user_input: userPrompt})
        });

        //validation
        if (!servResponse.ok) {
            throw new Error(`HTTP error! status: ${servResponse.status}`);
        }

        const aiData = await servResponse.json()
        AIContainer.innerHTML = ""; //clears away loading placeholder text
        // AIContainer = ``;

        // console.log(userPrompt)
        console.log(aiData);
        
        let txtHTML = "";
        let intCount = 1  // for numbering the services on the html

        aiData.services.forEach(element => {
            let strResourceName = element.NameOfService
            let strCompany = element.OrganizationName
            let strDescription = element.ServiceDescription
            console.log(strResourceName)

            txtHTML +=`<div class="flex-row">`
            txtHTML +=`    <h4 class="ai-title">${intCount}. ${strResourceName}</h4>`
            txtHTML +=`    <p class="ai-company-name">`
            txtHTML +=`        by ${strCompany}`
            txtHTML +=`    </p>`
            txtHTML +=`</div>`
            txtHTML +=`<p class="ai-description">`
            txtHTML +=`      ${strDescription}`
            txtHTML +=`</p>`
            txtHTML +=`<p class="btn ai-link">More Details</p>`
        })
        AIContainer.innerHTML += txtHTML
    } catch (objError){
        console.log('Error fetching aiData: ', objError)

        strHeader.innerHTML = "Oops! We're having trouble answering your request."
        AIContainer.innerHTML = `<p class="mt-3 ">Please try again later. In the meantime, feel free to browse all available services.</p>`; //error message
    
    }
}
document.addEventListener("DOMContentLoaded", function() {
    let AIContainer = document.querySelector('#suggestedResources');
    let strHeader = document.querySelector("#txtHeader");

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
    swal("Warning!", {
        title: "Warning!",
        text: "If you leave before printing, you will lose your recommended resources. Are you sure you want to leave?",
        icon: "warning",
        buttons: true,
    })
    .then((travelHome) => {
        if (travelHome) {
            window.location.href = "/index.html"; // carries to ai_results page
        } 
        // else {
        //     swal("Your imaginary file is safe!");
        // }
    });
})


