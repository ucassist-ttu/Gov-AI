(function () {
  const API_BASE_URL = "http://s1092595647.onlinehome.us/";
  const base = API_BASE_URL.replace(/\/$/, "");

  function fetchApi(path, options) {
    const [rawRoute, rawQuery = ""] = String(path).split("?");
    const route = rawRoute.startsWith("/") ? rawRoute : `/${rawRoute}`;
    const url = new URL(`${base}/api/index.php`, window.location.origin);

    url.searchParams.set("route", route);

    if (rawQuery) {
      new URLSearchParams(rawQuery).forEach((value, key) => {
        url.searchParams.append(key, value);
      });
    }

    return fetch(url.toString(), options);
  }

  window.fetchApi = fetchApi;
})();
