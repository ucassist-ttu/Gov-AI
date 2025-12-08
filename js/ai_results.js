async function getAIRecommendations(userPrompt) {
        try{
            let servResponse = await fetch(`http://localhost:8000/prompt`, {
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
            // let strDiv = ``

            console.log(aiData)

            // aiData.forEach(element => {
            //     console.log('aidata: ', element)
            // })
        } catch (objError){
            console.log('Error fetching objData', objError)
        }
}
document.addEventListener("DOMContentLoaded", function() {
    const btn = document.getElementById("btn-AI-search");
    btn.addEventListener("click", function() {
        const prompt = document.getElementById("txtAIPrompt").value;
        getAIRecommendations(prompt);
        console.log('prompt: ', prompt)
    });
});


// strDiv += `<div class="img-text-lg"><div>`
// 
// 
// 
//  