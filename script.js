const engines = {
  google: "https://www.google.com/search?q=",
  duckduckgo: "https://duckduckgo.com/?q=",
  bing: "https://www.bing.com/search?q=",
  brave: "https://search.brave.com/search?q=",
  ecosia: "https://www.ecosia.org/search?q=",
};

const form = document.querySelector("#search-form");
const queryInput = document.querySelector("#query");
const engineSelect = document.querySelector("#engine");
const storedEngine = localStorage.getItem("preferred-search-engine");

if (storedEngine && engines[storedEngine]) {
  engineSelect.value = storedEngine;
}

engineSelect.addEventListener("change", () => {
  localStorage.setItem("preferred-search-engine", engineSelect.value);
});

function search(query) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    queryInput.focus();
    return false;
  }

  const engine = engineSelect.value;
  localStorage.setItem("preferred-search-engine", engine);
  window.location.assign(`${engines[engine]}${encodeURIComponent(trimmedQuery)}`);
  return true;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  search(queryInput.value);
});

const urlQuery = new URLSearchParams(window.location.search).get("q");
if (urlQuery && urlQuery.trim()) {
  queryInput.value = urlQuery;
  search(urlQuery);
}
