# Link Sanitizer

A small Chrome extension that removes tracking parameters, and optionally the `Referer`, from links you open from a given site.

You decide the rules: *from which site* and *which query parameter to remove*. It ships with one preset rule for ChatGPT, which appends `?utm_source=chatgpt.com` to every link you click.

| From site | Remove |
| --- | --- |
| `chatgpt.com` | `?utm_source=chatgpt.com` |
| `example.com` | `?ref=newsletter` |
| *(empty = any site)* | `?fbclid` |

## How it works

Click the toolbar icon to open the popup:

- **On/Off switch** turns every rule on or off.
- **Add rule:** enter the source site and what to remove.
  - `?name=value` removes the parameter only when it has that value.
  - `?name` removes it whatever its value.
  - Leaving the site empty applies the rule to links opened from any site.
- **Hide Referer** (per rule, needs a source site) also removes the `Referer` header, so the destination does not learn which site you came from.

Rules are turned into Chrome [`declarativeNetRequest`](https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest) dynamic rules. Chrome applies them itself, before the request is sent, so the destination never sees the parameter.

## Privacy

- No content script: nothing runs inside the pages you visit.
- It never reads page content, history or cookies, and makes no network requests of its own.
- Your rules are stored locally with `chrome.storage.local`. Nothing is collected or sent anywhere.
- `host_permissions: <all_urls>` is required only because Chrome demands host access for redirect rules.

## Install (unpacked)

1. Clone or download this repository.
2. Open `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked** and select this folder.

## Verify it works

On the source site, open a link to `https://httpbin.org/anything`. The page echoes what the server received:

- `"args"` should be `{}` (no removed parameter).
- `"headers"` should contain no `Referer` if that option is on.

## Limitations

- Chrome still sends `Sec-Fetch-Site: cross-site`. It says a navigation came from another site, not which one, and extensions cannot remove it.
- A parameter is removed only from navigations started on the source site (main frame and iframes), not from links you type or paste.
- Rules match the source site and its subdomains.

## Development

```bash
node test.js   # checks how rules are generated
```

## License

MIT
