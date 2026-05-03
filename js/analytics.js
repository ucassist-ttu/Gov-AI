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
      target.classList.add("rageClicked")
      session.clickLogs = clickLogs
      // Send to backend
      clickHistory = [];
    }
  }
});

async function sendPageAnalytics(session, pageStartTime, maxScroll) {
  const payload = {
    page: window.location.pathname,
    timeViewed: pageStartTime,
    timeLeft: new Date().toISOString(),
    timeSpent: Math.round((Date.now() - pageStartTime) / 1000),
    maxScroll: maxScroll,
    pageViews: session.pageViews,
    clickLogs: JSON.stringify(Array.from(document.getElementsByClassName("rageClicked")).map(el => el.parentElement.closest('[data-name]').getAttribute("data-name"))),
    county: sessionStorage.getItem("currCounty")
  };
  try {
    const response = await fetchApi("/add-page-analytics", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        keepalive: true
    });
    const text = await response.text();

    let data = null;
    if (text) {
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.warn("Response was not JSON:", text);
        }
    }

    return data;

  } catch (err) {
    console.error("Failed to send analytics:", err);
  }
}

// composite method to track all analytics when leaving a page (completing a visit)
window.addEventListener("beforeunload", () => {
  sendPageAnalytics(session, pageStartTime, maxScroll)
})