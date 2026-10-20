// Run: node test.js
const assert = require('assert');
const { buildRules } = require('./background.js');

const rules = buildRules({
  enabled: true,
  rules: [
    { origin: 'chatgpt.com', param: 'utm_source', value: 'chatgpt.com', referer: true },
    { origin: '', param: 'fbclid', value: '', referer: true },
  ],
});
assert.deepStrictEqual(rules.map((r) => r.id), [1, 2, 3]); // no referer rule for "any site"

// Literal regexes: the generated regexFilter must equal their source, then we test the literals.
const withValue = /[?&]utm_source=chatgpt\.com(&|#|$)/;
const noValue = /[?&]fbclid(=|&|#|$)/;
assert.strictEqual(rules[0].condition.regexFilter, withValue.source);
assert.strictEqual(rules[2].condition.regexFilter, noValue.source);

assert(withValue.test('https://x.com/a?utm_source=chatgpt.com'));
assert(withValue.test('https://x.com/a?b=1&utm_source=chatgpt.com#h'));
assert(!withValue.test('https://x.com/a?utm_source=chatgptXcom'));
assert(!withValue.test('https://x.com/a?utm_source=other'));
assert(noValue.test('https://x.com/?fbclid=abc'));
assert(!noValue.test('https://x.com/?xfbclid=abc'));
assert.deepStrictEqual(buildRules({ enabled: false, rules: [{ origin: 'a.com', param: 'p', value: '' }] }), []);
console.log('ok');
