# Chrome Web Store listing (copy/paste)

## Store listing tab

**Name:** Link Sanitizer

**Summary (max 132 chars):**
Remove tracking parameters and the Referer from links, per source site. Pre-set for ChatGPT. No data collected.

**Category:** Productivity (or Privacy & Security if offered)

**Language:** English

**Description:**
Some sites tag every outgoing link with tracking parameters, for example ChatGPT adds ?utm_source=chatgpt.com. The destination then knows where you came from.

Link Sanitizer lets you choose, per source site, which query parameter to remove. It is removed before the request leaves your browser, so the link opens as the destination published it.

How it works
• Click the toolbar icon, enter a source site (e.g. chatgpt.com) and what to remove (e.g. ?utm_source=chatgpt.com).
• Use ?name=value to remove a parameter only for that value, or ?name to remove it whatever its value.
• Leave the site empty to apply a rule to links opened from any site.
• Optionally also hide the Referer header, so the destination does not see which site you came from.
• One switch turns everything on or off.
• A ChatGPT rule is included by default.

Privacy
• No content script: nothing runs inside the pages you visit.
• It never reads page content, history or cookies.
• It makes no network requests of its own and collects nothing.
• Your rules are stored locally in your browser.
• Built on Chrome's declarativeNetRequest rules, applied locally by the browser.

Notes
• Chrome still sends Sec-Fetch-Site: cross-site, which says a navigation came from another site but not which one. Extensions cannot remove it.
• Rules apply to links opened from the source site, not to addresses you type or paste.

Open source (MIT): add your repository URL here if you publish one.

**Graphic assets you must create (not generated):**
- At least 1 screenshot, 1280x800 or 640x400 (e.g. the httpbin result with "args": {} and no Referer).
- Small promo tile 440x280.
- Store icon 128x128: `icons/128.png` (placeholder, replace if you like).

## Privacy tab

**Single purpose:**
Remove the utm_source=chatgpt.com tracking parameter and the Referer header from links opened from ChatGPT.

**declarativeNetRequest justification:**
Used to create dynamic rules from the user's own list: a redirect that removes a user-chosen query parameter from navigations started on a user-chosen site, and optionally a rule that removes the Referer request header for those navigations.

**storage justification:**
Stores the user's rules and the on/off switch locally (chrome.storage.local). Nothing leaves the browser.

**Host permission (<all_urls>) justification:**
Links can point to any website, and Chrome requires host access for redirect and header-modification rules to apply to the destination URL. The extension does not read or modify page content, and no content script runs on any page.

**Remote code:** No, I am not using remote code.

**Data usage:** Do not check any data-collection box. Certify that data is not sold, not used for unrelated purposes, and not used for creditworthiness or lending.

**Privacy policy URL:** The form may ask for one. If you use GitHub, link the Privacy section of the README.

## Distribution tab

Visibility: Public. Regions: all. Under "Publish type" choose manual publish after approval.
