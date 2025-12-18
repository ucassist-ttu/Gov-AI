async function getAIRecommendations(userPrompt) {
        let strDiv = document.querySelector('#suggestedResources');
        strDiv.innerHTML = `<p class="loading">Loading suggestions...</p>`; //placeholder text during loading
        try{
            let servResponse = await fetch(`http://localhost:8000/prompt`, { //calls ai api
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_input: userPrompt
                })
            });
            //validation
            if (!servResponse.ok) {
                throw new Error(`HTTP error! status: ${servResponse.status}`);
            }

            let aiData = await servResponse.json()
            console.log(aiData);

            //clears away loading placeholder text
            strDiv.innerHTML = ""; 
            strDiv = ``

            console.log(aiData)

            let intCount = 0
            aiData.forEach(element => {
                intCount++
                let strResourceName = element.NameOfSevice
                let strCompany = element.OrganizationName
                let strDescription = element.ServiceDescription
                console.log(strResourceName)

                strDiv += `<div class="flex-row">`
                strDiv +=`     <h4 class="ai-title">${intCount}. ${strResourceName}</h4>`
                strDiv +=`    <p class="ai-company-name">`
                strDiv +=`        by ${strCompany}`
                strDiv +=`    </p>`
                strDiv +=`</div>`
                strDiv +=`<p class="ai-description">`
                strDiv +=`      ${strDescription}`
                strDiv +=`</p>`
                strDiv +=`<p class="btn ai-link">More Details</p>`
            })
            document.querySelector('#suggestedResources').innerHTML += strDiv
        } catch (objError){
            console.log('Error fetching aiData', objError)
        }
}
document.addEventListener("DOMContentLoaded", function() {
    const prompt = sessionStorage.getItem("user_prompt"); // Get prompt
    if (!prompt) {
        console.log("No prompt found in sessionStorage.");
        return;
    }
    else{ getAIRecommendations(prompt)}
});
