const $ = (id) => document.getElementById(id);
let state = { enabled: true, rules: [] };

const save = () => chrome.storage.local.set(state).then(render);

function render() {
  $('enabled').checked = state.enabled;
  $('list').replaceChildren(
    ...state.rules.map((r, i) => {
      const li = document.createElement('li');
      const text = document.createElement('span');
      text.textContent = `${r.origin || 'any site'} → ?${r.param}${r.value ? '=' + r.value : ''}`;
      if (r.referer && r.origin) {
        const s = document.createElement('small');
        s.textContent = ' + referer';
        text.append(s);
      }
      const del = document.createElement('button');
      del.textContent = '✕';
      del.title = 'Delete rule';
      del.onclick = () => {
        state.rules.splice(i, 1);
        save();
      };
      li.append(text, del);
      return li;
    })
  );
}

$('enabled').onchange = (e) => {
  state.enabled = e.target.checked;
  save();
};

$('form').onsubmit = (e) => {
  e.preventDefault();
  const raw = $('origin').value.trim();
  let origin = '';
  if (raw) {
    try {
      origin = new URL(raw.includes('://') ? raw : 'https://' + raw).hostname;
    } catch {
      $('err').textContent = 'Invalid site.';
      return;
    }
  }
  const [param, ...rest] = $('remove').value.trim().replace(/^\?/, '').split('=');
  const value = rest.join('=');
  if (!/^[^&=#?\s]+$/.test(param) || /[&#\s]/.test(value)) {
    $('err').textContent = 'Use the form ?name or ?name=value.';
    return;
  }
  $('err').textContent = '';
  state.rules.push({ origin, param, value, referer: $('referer').checked });
  $('origin').value = $('remove').value = '';
  save();
};

chrome.storage.local.get(state).then((s) => {
  state = s;
  render();
});
