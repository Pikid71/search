# search
A fast, mobile-friendly search redirect page.

Enter a query, choose a preferred search engine, and press Enter to search.
You can also open `/?q=your+query` to search immediately.

The engine menu includes popular web, knowledge, media, community, shopping,
developer, and Maps options. Expand “Custom search engines” to save your own
URL; include `{query}` or `%s` as the search-term placeholder.

## Run locally

```sh
python3 -m http.server 4173
```

Open `http://localhost:4173`.
