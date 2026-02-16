document.addEventListener("click", async function (e) {

  const searchBtn = e.target.closest("#btn-AI-search");
  if (!searchBtn) return;

  e.preventDefault();

  const input = document.getElementById("txtAIPrompt");


  const prompt = input.value.trim();

  if (prompt.length < 1) {
    swal({
      title: "Uh Oh!",
      text: "Please enter a search prompt.",
      icon: "error"
    });
    return;
  }

  sessionStorage.setItem("user_prompt", prompt);
  window.location.href = "html/pages/ai_results.html";
});


// geolocation to get current county
window.onload = getLocation()

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getCounty, getCountyManually)
  } else {
    console.log("Geolocation is not supported by this browser.")
  }
}

async function getCounty(position) {
  console.log("Latitude: " + position.coords.latitude +
  "<br>Longitude: " + position.coords.longitude)

  const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`);
  const geoData = await response.json()
  strCountyName = geoData.localityInfo.administrative[3].name
  document.cookie = `CurrCounty=${encodeURIComponent(strCountyName)}; path=/`
  // return strCountyName
}

function getCountyManually() {
  // alert("Sorry, no position available.");
  swal("What county are you in?", "To better help us service you, tell us what county you live in.",
    {content: {
        element: "input",
        attributes: {
          placeholder: "Type your password",
          type: "password",
        },
      },
    });
}




//SIDE BAR AI

