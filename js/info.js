let typeViewCounts = {};
let arrServiceTypes = [];
let arrCounties = [];
let servData;
let arrServiceTypeCounts = [];
let combined = {}
let barChart
let arrCountyCounts = {}
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
        createColorList (combined)

    } catch (objError){
        console.log('Error fetching objData', objError)
    }
    buildBarChart (arrServiceTypes, arrServiceTypeCounts, 'All Counties')
    buildpieChart (arrCountyCounts)
}
getServices()
let colorMap = {}
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
function buildpieChart (arrCountyCounts) {
    const countyCombined = Object.entries(arrCountyCounts).filter(([label]) => label.trim() !== "").map(([label, value]) => ({ label, value }));
    console.log(countyCombined)
    const counties = countyCombined.map(item => item.label);
    const clicks = countyCombined.map(item => item.value);
    const data = {
        labels: counties,
        datasets: [{
            label: 'Services Viewed',
            borderColor: '#1E222E',
            borderWidth: 2,
            data: clicks,
            backgroundColor: [
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
                "#D37295"  // rose
            ]
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
document.getElementById('countyFilter').addEventListener('change', (e) => {
    county = document.getElementById('countyFilter').value
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
        buildBarChart (arrServiceTypes, arrServiceTypeCounts, `All Counties`)
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
        buildBarChart (arrServiceTypes, arrServiceTypeCounts, `${county} County`)
    }
})
function createSpecificColorList (arrServiceTypes) {
    let arrColor = []
    arrServiceTypes.forEach(type => {
        arrColor.push(colorMap[type])
    })
    return arrColor
}