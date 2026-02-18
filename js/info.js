let typeViewCounts = {};
let arrServiceTypes = [];
let arrCounties = [];
let servData;
let arrServiceTypeCounts = [];
let combined = {}
let barChart
async function getServices() {
    try{
        //Get the list of services from api
        let servResponse = await fetch(`https://ucassist.duckdns.org/monthly-views`)
        servData = await servResponse.json()

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
            let strCounties = getCountyList(service)
            strCounties.forEach(county => {
                arrCounties.push(county)
            });
        });
        combined = Object.entries(typeViewCounts).filter(([label, value]) => label.trim() !== "").map(([label, value]) => ({
            label,
            value
        }));
        combined.sort((a, b) => b.value - a.value);
        arrTop10 = combined.slice(0,10)
        arrServiceTypes = arrTop10.map(item => item.label);
        arrServiceTypeCounts = arrTop10.map(item => item.value);
        uniqueCounties = [...new Set(arrCounties.filter(c => typeof c === "string" && c.trim().length >= 1))].sort((a, b) => a.localeCompare(b));

        createCountyClicksList("", servData)
        createCountyFilter(uniqueCounties)

    } catch (objError){
        console.log('Error fetching objData', objError)
    }
    buildBarChart (arrServiceTypes, arrServiceTypeCounts)
}
getServices()

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

function createCountyFilter(uniqueCounties) {
    uniqueCounties.forEach(county => {
        document.querySelector('#countyFilter').innerHTML += `<option value="${county}">${county} County</option>`
    })
}
function createCountyClicksList(countyFilterText, servData) {

    const typeViewCounts = {};

    const search = countyFilterText
        ? countyFilterText.toLowerCase().trim()
        : "";

    servData.forEach(service => {

        let tags = service.Keywords;
        let counties = service.CountiesAvailable;

        // Parse JSON safely
        if (typeof tags === "string") {
            try { tags = JSON.parse(tags); } catch { tags = []; }
        }

        if (typeof counties === "string") {
            try { counties = JSON.parse(counties); } catch { counties = []; }
        }

        // 🔎 COUNTY FILTER
        if (search && Array.isArray(counties)) {

            const matchesCounty = counties.some(c =>
                String(c).toLowerCase().trim() === search
            );

            if (!matchesCounty) return; // skip this service
        }

        const views = Number(service.view_count) || 0;

        if (Array.isArray(tags)) {
            tags.forEach(tag => {
                if (!tag) return;

                if (!typeViewCounts[tag]) {
                    typeViewCounts[tag] = 0;
                }

                typeViewCounts[tag] += views;
            });
        }
    });

    return typeViewCounts;
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
document.getElementById('countyFilter').addEventListener('change', (e) => {
    county = document.getElementById('countyFilter').value
    console.log(county)
    if (document.getElementById('countyFilter').value == 'all') {
        document.getElementById('chartFilter').value = 'top10'
        arrCountyClicks = createCountyClicksList("", servData)
        combined = Object.entries(arrCountyClicks).filter(([label, value]) => label.trim() !== "").map(([label, value]) => ({
            label,
            value
        }));
        combined.sort((a, b) => b.value - a.value);
        arrTop10 = combined.slice(0,10)
        arrServiceTypes = arrTop10.map(item => item.label);
        arrServiceTypeCounts = arrTop10.map(item => item.value);
        barChart.destroy();
        buildBarChart (arrServiceTypes, arrServiceTypeCounts)
    }
    else {
        document.getElementById('chartFilter').value = 'top10'
        arrCountyClicks = createCountyClicksList(county, servData)
        combined = Object.entries(arrCountyClicks).filter(([label, value]) => label.trim() !== "").map(([label, value]) => ({
            label,
            value
        }));
        combined.sort((a, b) => b.value - a.value);
        arrTop10 = combined.slice(0,10)
        arrServiceTypes = arrTop10.map(item => item.label);
        arrServiceTypeCounts = arrTop10.map(item => item.value);
        barChart.destroy();
        buildBarChart (arrServiceTypes, arrServiceTypeCounts)
    }
    console.log(arrTop10)
})