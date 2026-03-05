// Time on Page
let pageStartTime = Date.now();

function sendTimeOnPage() {
  const timeSpent = Math.round((Date.now() - pageStartTime) / 1000); // seconds
  
  console.log("Time spent on page", {
    page: window.location.pathname,
    timestamp: new Date().toISOString(),
    timeSpent: timeSpent
  });

  // Send to backend
}

window.addEventListener("beforeunload", sendTimeOnPage);
window.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    sendTimeOnPage();
  }
});

// Bounce Rate
const SESSION_TIMEOUT = 30 * 60 * 1000;
const now = Date.now();

let session = JSON.parse(localStorage.getItem("analytics_session"));

if (!session || now - session.lastActivity > SESSION_TIMEOUT) {
  session = {
    startTime: now,
    pageViews: 0
  };
}

session.pageViews += 1;
session.lastActivity = now;

localStorage.setItem("analytics_session", JSON.stringify(session));

// Detect bounce when leaving
window.addEventListener("beforeunload", () => {
  if (session.pageViews === 1) {
    
    console.log("Bounce detected", {
      page: window.location.pathname,
      timestamp: new Date().toISOString(),
      pageViews: session.pageViews
    });

    // Send to backend
  }
});

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

window.addEventListener("beforeunload", () => {
  
  console.log("Max scroll depth", {
    page: window.location.pathname,
    timestamp: new Date().toISOString(),
    maxScroll: maxScroll
  });

  // Send to backend
});

// Rage Clicks
let clickHistory = [];

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
      console.log("Rage click detected", {
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
        target: getElementSelector(target)
      });
      // Send to backend
      clickHistory = [];
    }
  }
});

// General Page Engagement (pages visited)
window.addEventListener("load", () => {
  console.log("Page Visited", {
    page: window.location.pathname,
    timestamp: new Date().toISOString()
  })
});