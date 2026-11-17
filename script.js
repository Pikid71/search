const engines = {
  google: { name: "Google", url: "https://www.google.com/search?q={query}" },
  duckduckgo: { name: "DuckDuckGo", url: "https://duckduckgo.com/?q={query}" },
  bing: { name: "Bing", url: "https://www.bing.com/search?q={query}" },
  brave: { name: "Brave", url: "https://search.brave.com/search?q={query}" },
  ecosia: { name: "Ecosia", url: "https://www.ecosia.org/search?q={query}" },
  yahoo: { name: "Yahoo", url: "https://search.yahoo.com/search?p={query}" },
  yandex: { name: "Yandex", url: "https://yandex.com/search/?text={query}" },
  startpage: { name: "Startpage", url: "https://www.startpage.com/sp/search?query={query}" },
  qwant: { name: "Qwant", url: "https://www.qwant.com/?q={query}" },
  swisscows: { name: "Swisscows", url: "https://swisscows.com/en/web?query={query}" },
  mojeek: { name: "Mojeek", url: "https://www.mojeek.com/search?q={query}" },
  metager: { name: "MetaGer", url: "https://metager.org/meta/meta.ger3?eingabe={query}" },
  kagi: { name: "Kagi", url: "https://kagi.com/search?q={query}" },
  you: { name: "You.com", url: "https://you.com/search?q={query}" },
  perplexity: { name: "Perplexity", url: "https://www.perplexity.ai/search?q={query}" },
  wikipedia: { name: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?search={query}" },
  wolframalpha: { name: "Wolfram Alpha", url: "https://www.wolframalpha.com/input?i={query}" },
  youtube: { name: "YouTube", url: "https://www.youtube.com/results?search_query={query}" },
  twitch: { name: "Twitch", url: "https://www.twitch.tv/search?term={query}" },
  github: { name: "GitHub", url: "https://github.com/search?q={query}&type=repositories" },
  stackoverflow: { name: "Stack Overflow", url: "https://stackoverflow.com/search?q={query}" },
  reddit: { name: "Reddit", url: "https://www.reddit.com/search/?q={query}" },
  hn: { name: "Hacker News", url: "https://hn.algolia.com/?q={query}" },
  imdb: { name: "IMDb", url: "https://www.imdb.com/find/?q={query}" },
  goodreads: { name: "Goodreads", url: "https://www.goodreads.com/search?q={query}" },
  amazon: { name: "Amazon", url: "https://www.amazon.com/s?k={query}" },
  ebay: { name: "eBay", url: "https://www.ebay.com/sch/i.html?_nkw={query}" },
  etsy: { name: "Etsy", url: "https://www.etsy.com/search?q={query}" },
  spotify: { name: "Spotify", url: "https://open.spotify.com/search/{query}" },
  soundcloud: { name: "SoundCloud", url: "https://soundcloud.com/search?q={query}" },
  steam: { name: "Steam", url: "https://store.steampowered.com/search/?term={query}" },
  npm: { name: "npm", url: "https://www.npmjs.com/search?q={query}" },
  pypi: { name: "PyPI", url: "https://pypi.org/search/?q={query}" },
  mdn: { name: "MDN", url: "https://developer.mozilla.org/en-US/search?q={query}" },
  googlemaps: { name: "Google Maps", url: "https://www.google.com/maps/search/{query}" },
};

const form = document.querySelector("#search-form");
const queryInput = document.querySelector("#query");
const engineSelect = document.querySelector("#engine");
const customNameInput = document.querySelector("#custom-name");
const customUrlInput = document.querySelector("#custom-url");
const addCustomButton = document.querySelector("#add-custom");
const customList = document.querySelector("#custom-list");

let customEngines = [];
try {
  customEngines = JSON.parse(localStorage.getItem("custom-search-engines") || "[]");
  if (!Array.isArray(customEngines)) customEngines = [];
} catch {
  customEngines = [];
}

const groups = [
  ["Popular", ["google", "duckduckgo", "bing", "brave", "ecosia", "yahoo", "yandex", "startpage", "qwant", "swisscows", "mojeek", "metager", "kagi", "you", "perplexity"]],
  ["Knowledge", ["wikipedia", "wolframalpha", "googlemaps"]],
  ["Media", ["youtube", "twitch", "spotify", "soundcloud", "imdb", "goodreads"]],
  ["Community", ["reddit", "hn", "stackoverflow"]],
  ["Shopping", ["amazon", "ebay", "etsy"]],
  ["Developer", ["github", "npm", "pypi", "mdn", "steam"]],
];

engineSelect.replaceChildren();
for (const [label, ids] of groups) {
  const group = document.createElement("optgroup");
  group.label = label;
  for (const id of ids) {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = engines[id].name;
    group.append(option);
  }
  engineSelect.append(group);
}

function saveCustomEngines() {
  localStorage.setItem("custom-search-engines", JSON.stringify(customEngines));
}

function refreshCustomOptions() {
  engineSelect.querySelectorAll("optgroup[data-custom]").forEach((group) => group.remove());
  customList.replaceChildren();

  if (customEngines.length) {
    const group = document.createElement("optgroup");
    group.label = "Custom";
    group.dataset.custom = "true";

    for (const engine of customEngines) {
      const option = document.createElement("option");
      option.value = engine.id;
      option.textContent = engine.name;
      group.append(option);

      const row = document.createElement("div");
      row.className = "custom-engine-row";

      const name = document.createElement("span");
      name.className = "custom-engine-name";
      name.textContent = engine.name;

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "remove-custom";
      remove.textContent = "×";
      remove.setAttribute("aria-label", `Remove ${engine.name}`);
      remove.addEventListener("click", () => {
        customEngines = customEngines.filter((item) => item.id !== engine.id);
        saveCustomEngines();
        if (engineSelect.value === engine.id) {
          engineSelect.value = "google";
          localStorage.setItem("preferred-search-engine", "google");
        }
        refreshCustomOptions();
      });

      row.append(name, remove);
      customList.append(row);
    }
    engineSelect.append(group);
  }

  const storedEngine = localStorage.getItem("preferred-search-engine");
  if (storedEngine && (engines[storedEngine] || customEngines.some((engine) => engine.id === storedEngine))) {
    engineSelect.value = storedEngine;
  } else {
    engineSelect.value = "google";
  }
}

refreshCustomOptions();

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
  const engineData = engines[engine] || customEngines.find((item) => item.id === engine);
  if (!engineData) return false;

  const template = typeof engineData === "string" ? engineData : engineData.url;
  const encodedQuery = encodeURIComponent(trimmedQuery);
  const destination = template
    .replaceAll("{query}", encodedQuery)
    .replaceAll("%s", encodedQuery);
  window.location.assign(destination);
  return true;
}

addCustomButton.addEventListener("click", () => {
  const name = customNameInput.value.trim();
  const url = customUrlInput.value.trim();
  let parsedUrl;

  try {
    parsedUrl = new URL(url);
  } catch {
    customUrlInput.setCustomValidity("Enter a valid http or https search URL.");
    customUrlInput.reportValidity();
    return;
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    customUrlInput.setCustomValidity("The URL must start with http:// or https://.");
    customUrlInput.reportValidity();
    return;
  }

  if (!url.includes("{query}") && !url.includes("%s")) {
    customUrlInput.setCustomValidity("Include {query} or %s where the search text should go.");
    customUrlInput.reportValidity();
    return;
  }

  if (!name) {
    customNameInput.setCustomValidity("Enter a name for this search engine.");
    customNameInput.reportValidity();
    return;
  }

  const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  customEngines.push({ id, name, url });
  saveCustomEngines();
  customNameInput.value = "";
  customUrlInput.value = "";
  refreshCustomOptions();
  engineSelect.value = id;
  localStorage.setItem("preferred-search-engine", id);
});

customNameInput.addEventListener("input", () => customNameInput.setCustomValidity(""));
customUrlInput.addEventListener("input", () => customUrlInput.setCustomValidity(""));

form.addEventListener("submit", (event) => {
  event.preventDefault();
  search(queryInput.value);
});

const urlQuery = new URLSearchParams(window.location.search).get("q");
if (urlQuery && urlQuery.trim()) {
  queryInput.value = urlQuery;
  search(urlQuery);
}
