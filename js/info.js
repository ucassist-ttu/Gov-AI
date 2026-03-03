let typeViewCounts = {};
let arrServiceTypes = [];
let uniqueCounties = [];
let topCounty
let allCounty
let servData;
let arrServiceTypeCounts = [];
let combined = {}
let barChart
let arrCountyCounts = {}
let colorMap = {}
let arrTotCount = {}
let colors = [
  "#4E79A7", // blue
  "#F28E2B", // orange
  "#E15759", // red
  "#76B7B2", // teal
  "#59A14F", // green
  "#EDC948", // yellow
  "#B07AA1", // purple
  "#FF9DA7", // pink
  "#9C755F", // brown
  "#BAB0AC", // gray

  "#2F4B7C", // dark blue
  "#FFA600", // amber
  "#8CD17D", // light green
  "#D37295", // rose
  "#499894", // sea teal
  "#E15759", // strong red
  "#79706E", // warm gray
  "#86BCB6", // soft teal
  "#EECA3B", // mustard
  "#D4A6C8", // lavender

  "#5F9ED1", // sky blue
  "#C85200", // burnt orange
  "#6B4C9A", // deep purple
  "#A5AA99", // sage
  "#E17C05", // pumpkin
  "#1F77B4", // classic blue
  "#FF7F0E", // vivid orange
  "#2CA02C", // bright green
  "#D62728", // crimson
  "#9467BD", // violet

  "#8C564B", // cocoa
  "#17BECF", // cyan
  "#BCBD22", // olive
  "#7F7F7F"  // neutral gray
]

//Get the list services viewed
async function getServices() {
    try{
        //Get the list of services from api
        let servResponse = await fetch(`https://ucassist.duckdns.org/monthly-views`)
        servData = await servResponse.json()

        getCounts ()

        createCountyClicksList("", servData)
        createCountyFilter(uniqueCounties)
        createColorList (combined)
        getAllCountyCounts ()

    } catch (objError){
        console.log('Error fetching objData', objError)
    }
    clickCount = getTotalCount ()
    buildBarChart (arrServiceTypes, arrServiceTypeCounts, 'All Counties')
}
getServices()

// Assigns a specific color to a specific service type
function createColorList (arrServiceTypes) {
    x = 0
    arrServiceTypes.forEach(type => {
        label = type.label
        colorMap[label] = colors[x % colors.length];
        x = x + 1
    })
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

// Gets the total service views per county
function getAllCountyCounts () {
    servData.forEach(service => {
        counties = getCountyList(service)
        views = service.view_count
        counties.forEach(county => {
            if (!arrTotCount[county]) {
                arrTotCount[county] = 0;
            }
            arrTotCount[county] += views;
        })
    })
    buildpieChart (arrTotCount)
}

// Creates the county filter
function createCountyFilter(uniqueCounties) {
    uniqueCounties.forEach(county => {
        document.querySelector('#countyFilter').innerHTML += `<option value="${county}">${county} County</option>`
    })
}

// Counts the number of times a specific service is viewed in a county
function createCountyClicksList(countyFilterText, servData) {
    const typeViewCounts = {};
    topCounty = []
    allCounty = []

    const search = countyFilterText? countyFilterText.toLowerCase().trim(): "";

    servData.forEach(service => {
        let tags = service.Keywords;
        let counties = service.CountiesAvailable;
        id = service.ID
        count = service.view_count
        allCounty.push({'id': id, 'value': count})

        if (typeof tags === "string") {
            try { tags = JSON.parse(tags); } catch { tags = []; }
        }

        if (typeof counties === "string") {
            try { counties = JSON.parse(counties); } catch { counties = []; }
        }

        if (search && Array.isArray(counties)) {

            const matchesCounty = counties.some(c =>
                String(c).toLowerCase().trim() === search
            );
            
            if (!matchesCounty) return;
            topCounty.push({'id': id, 'value': count})
        }

        const views = Number(service.view_count) || 0;
        if (Array.isArray(counties)) {
            counties.forEach(county => {

            if (!arrCountyCounts[county]) {
                arrCountyCounts[county] = 0;
            }

            arrCountyCounts[county] += views;

            });
        }

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

// Builds the bar chart to display the number of times a service type was viewed for each county
function buildBarChart (arrServiceTypes, arrServiceTypeCounts, countyName) {
        const data = {
        labels: arrServiceTypes,
        datasets: [{
            label: '# Clicks',
            borderColor: '#1E222E',
            borderWidth: 2,
            data: arrServiceTypeCounts,
            backgroundColor: createSpecificColorList(arrServiceTypes)
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
                    text: `Service Type Viewed: ${countyName}`,
                    font: {
                        size: 17,
                        family: 'tahoma',
                        weight: 'bold',
                    },
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

// Builds the donut chart to display the number of times a service was viewed for each county
function buildpieChart (arrCountyCounts) {
    const countyCombined = Object.entries(arrCountyCounts).filter(([label]) => label.trim() !== "").map(([label, value]) => ({ label, value }));
    const counties = countyCombined.map(item => item.label);
    const clicks = countyCombined.map(item => item.value);
    const data = {
        labels: counties,
        datasets: [{
            label: 'Services Viewed',
            borderColor: '#1E222E',
            borderWidth: 2,
            data: clicks,
            backgroundColor: colors
        }]
    };
    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Services Viewed Per County',
                    font: {
                        size: 17,
                        family: 'tahoma',
                        weight: 'bold',
                    },
                }
            }
        },
    };
    pieChart =new Chart(
        document.getElementById('pieChart'),
        config
    );
}

// Updates the bar chart depending on how many services the user wants to view
document.getElementById('chartFilter').addEventListener('change', (e) => {
    county = document.getElementById('countyFilter').value
    if (document.getElementById('chartFilter').value == 'all') {
        barChart.destroy();
        arrServiceTypes = combined.map(item => item.label);
        arrServiceTypeCounts = combined.map(item => item.value);
        if(county == "all") {
            buildBarChart (arrServiceTypes, arrServiceTypeCounts, `All Counties`)
        }
        else {
            buildBarChart (arrServiceTypes, arrServiceTypeCounts, `${county} County`)
        }
    }
    else {
        barChart.destroy();
        arrTop10 = combined.slice(0,10)
        arrServiceTypes = arrTop10.map(item => item.label);
        arrServiceTypeCounts = arrTop10.map(item => item.value);
        if(county == "all") {
            buildBarChart (arrServiceTypes, arrServiceTypeCounts, `All Counties`)
        }
        else {
            buildBarChart (arrServiceTypes, arrServiceTypeCounts, `${county} County`)
        }
    }
})

// Updates the bar chart depending on which counties information the user wants to view
document.getElementById('countyFilter').addEventListener('change', (e) => {
    county = document.getElementById('countyFilter').value
    if (document.getElementById('countyFilter').value == 'all') {
        document.getElementById('chartFilter').value = 'top10'
        arrCountyClicks = createCountyClicksList("", servData)
        getMostPopularServices (county)
        combined = Object.entries(arrCountyClicks).filter(([label, value]) => label.trim() !== "").map(([label, value]) => ({
            label,
            value
        }));
        combined.sort((a, b) => b.value - a.value);
        arrTop10 = combined.slice(0,10)
        arrServiceTypes = arrTop10.map(item => item.label);
        arrServiceTypeCounts = arrTop10.map(item => item.value);
        barChart.destroy();
        buildBarChart (arrServiceTypes, arrServiceTypeCounts, `All Counties`)
    }
    else {
        document.getElementById('chartFilter').value = 'top10'
        arrCountyClicks = createCountyClicksList(county, servData)
        getMostPopularServices (county)
        combined = Object.entries(arrCountyClicks).filter(([label, value]) => label.trim() !== "").map(([label, value]) => ({
            label,
            value
        }));
        combined.sort((a, b) => b.value - a.value);
        arrTop10 = combined.slice(0,10)
        arrServiceTypes = arrTop10.map(item => item.label);
        arrServiceTypeCounts = arrTop10.map(item => item.value);
        barChart.destroy();
        buildBarChart (arrServiceTypes, arrServiceTypeCounts, `${county} County`)
    }
})

// returns the specific color that matches the specific service type
function createSpecificColorList (arrServiceTypes) {
    let arrColor = []
    arrServiceTypes.forEach(type => {
        arrColor.push(colorMap[type])
    })
    return arrColor
}

// Gets the total count of services viewed on the website
function getTotalCount () {
    const countyCombined = Object.entries(arrTotCount).filter(([label]) => label.trim() !== "").map(([label, value]) => ({ label, value }));
    const counties = countyCombined.map(item => item.label);
    let totServicesViewed = 0
    counties.forEach(county => {
        totServicesViewed += arrTotCount[county]
    })
    return totServicesViewed
}

// Gets the information for the most and least used service sections
function getMostPopularServices (county) {
    if (county == 'all'){
        allCounty.sort((a, b) => b.value - a.value);
        arrTop5 = allCounty.slice(0,5)
        arrBottom5 = allCounty.slice(allCounty.length - 5, allCounty.length)
        getServiceName(arrTop5[0].id, arrTop5[0].value, 'top1')
        getServiceName(arrTop5[1].id, arrTop5[1].value, 'top2')
        getServiceName(arrTop5[2].id, arrTop5[2].value, 'top3')
        getServiceName(arrTop5[3].id, arrTop5[3].value, 'top4')
        getServiceName(arrTop5[4].id, arrTop5[4].value, 'top5')
        getServiceName(arrBottom5[0].id, arrBottom5[0].value, 'bottom1')
        getServiceName(arrBottom5[1].id, arrBottom5[1].value, 'bottom2')
        getServiceName(arrBottom5[2].id, arrBottom5[2].value, 'bottom3')
        getServiceName(arrBottom5[3].id, arrBottom5[3].value, 'bottom4')
        getServiceName(arrBottom5[4].id, arrBottom5[4].value, 'bottom5')
    }
    else {
        topCounty.sort((a, b) => b.value - a.value);
        arrTop5 = topCounty.slice(0,5)
        arrBottom5 = topCounty.slice(topCounty.length - 5, topCounty.length)
        getServiceName(arrTop5[0].id, arrTop5[0].value, 'top1')
        getServiceName(arrTop5[1].id, arrTop5[1].value, 'top2')
        getServiceName(arrTop5[2].id, arrTop5[2].value, 'top3')
        getServiceName(arrTop5[3].id, arrTop5[3].value, 'top4')
        getServiceName(arrTop5[4].id, arrTop5[4].value, 'top5')
        getServiceName(arrBottom5[0].id, arrBottom5[0].value, 'bottom1')
        getServiceName(arrBottom5[1].id, arrBottom5[1].value, 'bottom2')
        getServiceName(arrBottom5[2].id, arrBottom5[2].value, 'bottom3')
        getServiceName(arrBottom5[3].id, arrBottom5[3].value, 'bottom4')
        getServiceName(arrBottom5[4].id, arrBottom5[4].value, 'bottom5')
    }
}
function getCounts () {
    let arrCounties = []
        servData.forEach(service => {

            let tags = service.Keywords;

            if (typeof tags === 'string') {
                tags = JSON.parse(tags);
            }

            const views = service.view_count

            tags.forEach(tag => {
                if (!typeViewCounts[tag]) {
                    typeViewCounts[tag] = 0;
                }
                typeViewCounts[tag] += views;
            });

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
        createColorList (combined)
        getMostPopularServices ('all')
        

}
async function getServiceName(serviceId, serviceCount, order) {
    try{
        let servResponse = await fetch(`https://ucassist.duckdns.org/service?id=${serviceId}`)
        newData = await servResponse.json()
        serviceName = newData.NameOfService
        if(serviceCount == 1) {
            view = 'View'
        }
        else {
            view = 'Views'
        }
        document.querySelector(`#${order}`).innerHTML = `${serviceName}: ${serviceCount} ${view}`
    } catch (objError){
        console.log('Error fetching objData', objError)
    }
}