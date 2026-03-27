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
    timeLeft: Date.now().toString(),
    timeSpent: Math.round((Date.now() - pageStartTime) / 1000),
    maxScoll: maxScroll,
    pageViews: session.pageViews,
    clickLogs: session.clickLogs,
    bounce: bounce
  })
})

function generateMockAnalytics() {

const pages = ["/", "/services", "/snap", "/crisis", "/error"];

const pageVisits = []

for (let i = 0; i < 150; i++) {

  const rageClicks = []
  const page = pages[Math.floor(Math.random()*pages.length)];
  const timeViewed = new Date(Date.now() - Math.random()*604800000).toISOString(); // last 7 days
  const timeLeft = new Date(Date.parse(timeViewed) + Math.random()*1800).toISOString();
  const timeSpent = timeLeft - timeViewed
  const maxScroll = Math.floor(Math.random()*100)
  const pageViews = Math.ceil(Math.random()*10)
  if(Math.random() < 0.25 && pageViews == 1){
    const bounce = true
  }
  if(Math.random() < 0.15){
    rageClicks.push({
      target: "#map"
    })
  }
  if(Math.random() < 0.35){
    rageClicks.push({
      target: "#map"
    })
  }

  pageVisits.push({
    page: page,
    timeViewed: timeViewed,
    timeLeft: timeLeft,
    timeSpent: timeSpent,
    maxScroll: maxScroll,
    pageViews: pageViews,
    clickLogs: rageClicks,
    bounce: bounce
  })

}

localStorage.setItem("analytics", JSON.stringify(pageVisits));

}

generateMockAnalytics();