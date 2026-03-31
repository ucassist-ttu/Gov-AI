// Time on Page
let pageStartTime = Date.now();

// Bounce Rate
const SESSION_TIMEOUT = 30 * 60 * 1000;
const now = Date.now();

let session = JSON.parse(localStorage.getItem("analytics_session"));

if (!session || now - session.lastActivity > SESSION_TIMEOUT) {
  session = {
    startTime: now,
    pageViews: 0,
    clickLogs: []
  };
}

session.pageViews += 1;
session.lastActivity = now;

// Improved bounce detection: Set bounce flag and log on page visit complete
let bounce = session.pageViews === 1;
let bounceTimeout;

function logBounce() {
  if (bounce) {
    console.log("Bounce detected", {
      page: window.location.pathname,
      timestamp: new Date().toISOString(),
      pageViews: session.pageViews,
      bounce: true
    });
  }
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    // Delay to allow for potential navigation back or internal links
    bounceTimeout = setTimeout(logBounce, 5000); // 5-second delay
  } else if (document.visibilityState === "visible") {
    // User returned, cancel bounce logging
    clearTimeout(bounceTimeout);
  }
});

window.addEventListener("beforeunload", () => {
  clearTimeout(bounceTimeout);
  logBounce();
});

localStorage.setItem("analytics_session", JSON.stringify(session));

// Scroll Depth
let maxScroll = 0;

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = Math.round((scrollTop / docHeight) * 100);
  if (scrollPercent > maxScroll) {
    maxScroll = scrollPercent;
  }
});

// Rage Clicks
let clickHistory = [];
let clickLogs = [];

function getElementSelector(el) {
  if (!el) return "unknown";

  let selector = el.tagName.toLowerCase();

  if (el.id) {
    selector += `#${el.id}`;
  }

  if (el.classList.length > 0) {
    selector += "." + [...el.classList].join(".");
  }

  return selector;
}

document.addEventListener("click", (e) => {
  const now = Date.now();
  const target = e.target;

  // Click Detection
  clickHistory.push({
    time: now,
    x: e.clientX,
    y: e.clientY
  });

  // Keep only clicks within last 1 second
  clickHistory = clickHistory.filter(click => now - click.time < 1000);

  if (clickHistory.length >= 3) {
    const first = clickHistory[0];
    const last = clickHistory[clickHistory.length - 1];

    const distance = Math.sqrt(
      Math.pow(last.x - first.x, 2) +
      Math.pow(last.y - first.y, 2)
    );

    if (distance < 50) {
      clickLogs.push({
        target: getElementSelector(target)
      })
      session.clickLogs = clickLogs
      // Send to backend
      clickHistory = [];
    }
  }
});

// composite method to track all analytics when leaving a page (completing a visit)
window.addEventListener("beforeunload", () => {
  const timeSpent = Math.round((Date.now() - pageStartTime) / 1000);

  console.log({
    page: window.location.pathname,
    timeViewed: pageStartTime,
    timeLeft: new Date().toISOString(),
    timeSpent: Math.round((Date.now() - pageStartTime) / 1000),
    maxScoll: maxScroll,
    pageViews: session.pageViews,
    clickLogs: session.clickLogs,
    bounce: bounce,
    county: sessionStorage.getItem("currCounty")
  })
})

function generateMockAnalytics() {

const pages = ["/", "/services", "/snap", "/crisis", "/error"];

const pageVisits = []

for (let i = 0; i < 150; i++) {

  const rageClicks = []
  const page = pages[Math.floor(Math.random()*pages.length)];
  const MONTH_RANGE = 6;
  const now = new Date();
  const randomMonthOffset = Math.floor(Math.random() * MONTH_RANGE);
  const baseDate = new Date(
    now.getFullYear(),
    now.getMonth() - randomMonthOffset,
    1
  );
  const randomDayOffset = Math.floor(Math.random() * 28);
  const randomTimeOffset = Math.random() * 86400000;
  const timeViewedDate = new Date(
    baseDate.getTime() + (randomDayOffset * 86400000) + randomTimeOffset
  );
  const timeViewed = timeViewedDate.toISOString();
  const timeLeft = new Date(Date.parse(timeViewed) + Math.random()*1800000).toISOString();
  const timeSpent = Math.round(
    (Date.parse(timeLeft) - Date.parse(timeViewed)) / 1000
  );
  const maxScroll = Math.floor(Math.random()*100)
  const pageViews = Math.ceil(Math.random()*10)
  let bounce = false;
  if (Math.random() < 0.25 && pageViews === 1) {
    bounce = true;
  }
  const targets = ["#map", "#btn-submit", ".nav-link", "#accordion"];
  if(Math.random() < 0.15){
    rageClicks.push({
      target: targets[Math.floor(Math.random() * targets.length)]
    });
  }
  if(Math.random() < 0.35){
    rageClicks.push({
      target: targets[Math.floor(Math.random() * targets.length)]
    });
  }
  const counties = [
    'all',
    'cannon',
    'clay',
    'cumberland',
    'dekalb',
    'fentress',
    'jackson',
    'macon',
    'overton',
    'pickett',
    'putnam',
    'smith',
    'van_buren',
    'warren',
    'white'
  ]
  const county = counties[Math.floor(Math.random() * counties.length)]

  pageVisits.push({
    page: page,
    timeViewed: timeViewed,
    timeLeft: timeLeft,
    timeSpent: timeSpent,
    maxScroll: maxScroll,
    pageViews: pageViews,
    clickLogs: rageClicks,
    bounce: bounce,
    county: county
  })

}

localStorage.setItem("analytics", JSON.stringify(pageVisits));

}

function generateMockSearch(count = 100) {
    const counties = [
        'all','cannon','clay','cumberland','dekalb','fentress',
        'jackson','macon','overton','pickett','putnam',
        'smith','van_buren','warren','white'
    ];

    const serviceSearches = [
        "food stamps application",
        "medicaid eligibility",
        "housing assistance",
        "utility bill help",
        "unemployment benefits",
        "child care assistance",
        "transportation services",
        "mental health services",
        "substance abuse treatment",
        "job training programs",
        "senior services",
        "disability services",
        "public health clinic",
        "vaccination locations",
        "rental assistance"
    ];

    const data = [];

    for (let i = 0; i < count; i++) {
        const searchType = Math.random() < 0.5 ? "AI" : "database";

        // Random timestamp within last 6 months
        const now = new Date();
        const past = new Date();
        past.setMonth(now.getMonth() - 6);

        const randomTime = new Date(
            past.getTime() + Math.random() * (now.getTime() - past.getTime())
        );

        const results =
            searchType === "AI"
                ? Math.floor(Math.random() * 5) // 0–4
                : Math.floor(Math.random() * 501); // 0–500

        data.push({
            searchType: searchType,
            timeStamp: randomTime.toISOString(),
            search: serviceSearches[Math.floor(Math.random() * serviceSearches.length)],
            results: results,
            county: counties[Math.floor(Math.random() * counties.length)],
            checked: null
        });
    }

    // Save to localStorage
    localStorage.setItem("searchAnalytics", JSON.stringify(data));

    return data;
}

generateMockAnalytics();
generateMockSearch(200);