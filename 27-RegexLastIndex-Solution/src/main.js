// =============================================================================
// SOLUTION 27 — Global-Flag Regex Retains lastIndex
// =============================================================================
//
// Rule of thumb: if you don't need /g, don't use /g — the lastIndex state
// is a footgun. For batch replace you DO want /g (or replaceAll with a
// regex, which requires /g). And read named-capture-group names exactly
// as you spelled them in the pattern.
// =============================================================================

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>Regex pitfalls</h1>
    <pre id="out"></pre>
  </main>
`;

// FIX #1: drop the /g flag. `.test` on a non-/g regex is stateless. (If
//         you genuinely need /g — e.g. exec() in a while loop — reset
//         .lastIndex = 0 between consumers, or build a fresh regex.)
const HASHTAG = /^#[a-z][a-z0-9_]*$/;
function findHashtag(s) {
  return HASHTAG.test(s);
}

// FIX #2: add /g so `replace` actually replaces every match. Equivalently
//         use String.prototype.replaceAll('digit-pattern', '') with a
//         regex flagged /g (replaceAll requires /g when given a regex).
function stripDigits(s) {
  return s.replace(/\d/g, '');
}

// FIX #3: align the group name on both sides. The pattern names the
//         group `name`, so the consumer reads `groups.name`.
function parseTag(s) {
  const m = /^#(?<name>[a-z][a-z0-9_]*)$/.exec(s);
  return m ? { tag: m.groups.name } : null;
}

const samples = [
  `findHashtag("#go") call 1: ${findHashtag('#go')}`,
  `findHashtag("#go") call 2: ${findHashtag('#go')}`,
  `findHashtag("#go") call 3: ${findHashtag('#go')}`,
  `stripDigits("a1b2c3")    : ${JSON.stringify(stripDigits('a1b2c3'))}`,
  `parseTag("#go")          : ${JSON.stringify(parseTag('#go'))}`,
];
document.getElementById('out').textContent = samples.join('\n');
