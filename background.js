// Rebuilds Chrome's dynamic declarativeNetRequest rules from the saved settings.
const DEFAULTS = {
  enabled: true,
  rules: [{ origin: 'chatgpt.com', param: 'utm_source', value: 'chatgpt.com', referer: true }],
};
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function buildRules({ enabled, rules }) {
  if (!enabled) return [];
  const out = [];
  rules.forEach((r, i) => {
    const initiator = r.origin ? { initiatorDomains: [r.origin] } : {};
    const p = escRe(r.param);
    const regexFilter = r.value ? `[?&]${p}=${escRe(r.value)}(&|#|$)` : `[?&]${p}(=|&|#|$)`;
    out.push({
      id: 2 * i + 1,
      priority: 1,
      action: {
        type: 'redirect',
        redirect: { transform: { queryTransform: { removeParams: [r.param] } } },
      },
      condition: { ...initiator, regexFilter, resourceTypes: ['main_frame', 'sub_frame'] },
    });
    // Stripping Referer for "any origin" would affect every navigation, so it needs an origin.
    if (r.referer && r.origin) {
      out.push({
        id: 2 * i + 2,
        priority: 1,
        action: { type: 'modifyHeaders', requestHeaders: [{ header: 'referer', operation: 'remove' }] },
        condition: { initiatorDomains: [r.origin], resourceTypes: ['main_frame'] },
      });
    }
  });
  return out;
}

// Syncs run one at a time: overlapping runs would both add the same rule ids.
let queue = Promise.resolve();
const sync = () => (queue = queue.then(doSync, doSync));

async function doSync() {
  const addRules = buildRules(await chrome.storage.local.get(DEFAULTS));
  const old = await chrome.declarativeNetRequest.getDynamicRules();
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: old.map((r) => r.id),
    addRules,
  });
}

if (typeof chrome !== 'undefined' && chrome.runtime) {
  chrome.runtime.onInstalled.addListener(async () => {
    const saved = await chrome.storage.local.get('rules');
    if (!saved.rules) await chrome.storage.local.set(DEFAULTS);
    await sync();
  });
  chrome.storage.onChanged.addListener(sync);
}

if (typeof module !== 'undefined') module.exports = { buildRules };
