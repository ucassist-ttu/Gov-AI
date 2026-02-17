let typeViewCounts = {};
let arrServiceTypes = [];
let arrServiceTypeCounts = [];
let combined = {}
let barChart
async function getServices() {
    try{
        //Get the list of services from api
        let servResponse = await fetch(`https://ucassist.duckdns.org/monthly-views`)
        let servData = await servResponse.json()

        servData.forEach(service => {

            let tags = service.Keywords;

            if (typeof tags === 'string') {
                tags = JSON.parse(tags);
            }

            const views = Number(service.view_count) || 0;

            if (Array.isArray(tags)) {
                tags.forEach(tag => {

                if (!typeViewCounts[tag]) {
                    typeViewCounts[tag] = 0;
                }

                typeViewCounts[tag] += views;

                });
            }
        });
        combined = Object.entries(typeViewCounts).filter(([label, value]) => label.trim() !== "").map(([label, value]) => ({
            label,
            value
        }));
        combined.sort((a, b) => b.value - a.value);
        arrTop10 = combined.slice(0,10)
        arrServiceTypes = arrTop10.map(item => item.label);
        arrServiceTypeCounts = arrTop10.map(item => item.value);

        console.log(combined)
        console.log(arrServiceTypes)
        console.log(arrServiceTypeCounts)

    } catch (objError){
        console.log('Error fetching objData', objError)
    }
    buildBarChart (arrServiceTypes, arrServiceTypeCounts)
}
getServices()
// Gets the list of tags for each service
function getTagList(service) {
    strKeywords = service.Keywords
    if (typeof strKeywords === 'string') {
        strKeywords = JSON.parse(strKeywords);
    }
    // Returns keywords seperated by a ','
    if (Array.isArray(strKeywords)) {
        return strKeywords;
    }
}

// Gets  the list of counties for each services
function getCountyList(service) {
    strCounties = service.CountiesAvailable
    if (typeof strCounties === 'string') {
        strCounties = JSON.parse(strCounties);
    }

    // Returns an array of strCounties
    if (Array.isArray(strCounties)) {
        return strCounties;
    }
}

function buildBarChart (arrServiceTypes, arrServiceTypeCounts) {
        const data = {
        labels: arrServiceTypes,
        datasets: [{
            label: '# Clicks',
            borderColor: '#1E222E',
            borderWidth: 2,
            data: arrServiceTypeCounts,
            backgroundColor: [
                'red',
                'orange',
                'yellow',
                'green',
                'blue',
                'purple',
                'pink',
                'brown',
                'cyan',
                'magenta',
                'lime',
                'teal',
                'indigo',
                'violet',
                'gold',
                'silver',
                'maroon',
                'navy',
                'olive',
                'coral',
                'turquoise',
                'salmon',
                'khaki',
                'plum',
                'orchid',
                'crimson',
                'darkgreen',
                'darkblue',
                'darkorange',
                'lightblue',
                'lightgreen',
                'lightcoral',
                'slateblue',
                'tomato'
            ]
        }]
    };
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Number Of Clicks Per Service Type'
                }
            },
            scales: {
                y: {
                    ticks: {
                        autoSkip: false,
                        maxRotation: 0,
                        minRotation: 0
                    }
                },
                x: {
                    beginAtZero: true
                }
            },
        }
    };
    barChart =new Chart(
        document.getElementById('barChart'),
        config
    );
}
document.getElementById('chartFilter').addEventListener('change', (e) => {
    console.log(document.getElementById('chartFilter').value)
    if (document.getElementById('chartFilter').value == 'all') {
        barChart.destroy();
        arrServiceTypes = combined.map(item => item.label);
        arrServiceTypeCounts = combined.map(item => item.value);
        buildBarChart (arrServiceTypes, arrServiceTypeCounts)
    }
    else {
        barChart.destroy();
        arrTop10 = combined.slice(0,10)
        arrServiceTypes = arrTop10.map(item => item.label);
        arrServiceTypeCounts = arrTop10.map(item => item.value);
        buildBarChart (arrServiceTypes, arrServiceTypeCounts)
    }
})