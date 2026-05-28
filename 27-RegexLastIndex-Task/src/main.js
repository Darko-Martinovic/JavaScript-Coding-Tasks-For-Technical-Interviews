// =============================================================================
// TASK 27 — Global-Flag Regex Retains lastIndex
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (the same input alternates true/false)
//
// `findHashtag` returns whether a line is a hashtag-like string. It uses
// a /g regex, so `.test(str)` carries `lastIndex` between calls. Calling
// it twice on the SAME input flips the result. There's also a stripDigits
// helper that builds a new regex per call (good) but uses replace() with
// a non-global regex (bad — only replaces the first match).
//
// THINGS TO SCRUTINISE:
//   1. /g + .test() + a shared regex object across iterations. What
//      does .lastIndex do to subsequent .test() calls?
//   2. /g + .replace(...) — does it replace all matches or just the
//      first?
//   3. Named capture groups — does the consumer read `.groups.name` or
//      `.groups.tag`? Compare the regex's actual group name.
//
// EXPECTED CORRECT BEHAVIOR (after fix):
//   - findHashtag("#go") on the same input returns true EVERY time.
//   - stripDigits("a1b2c3") returns "abc".
//   - parseTag("#go") returns { tag: "go" }.
//
// ACTUAL (buggy) BEHAVIOR: findHashtag alternates true/false on repeated
//   calls; stripDigits leaves all-but-the-first digit; parseTag returns
//   `{ tag: undefined }` because the named group is spelled differently
//   in the consumer.
// =============================================================================

const app = document.getElementById('app');
app.innerHTML = `
  <main style="font-family: system-ui; padding: 24px;">
    <h1>Regex pitfalls</h1>
    <pre id="out"></pre>
  </main>
`;

// BUG 1: /g flag plus reuse — .lastIndex advances on a successful test
//        and resets on a failed one, so calling .test on the SAME input
//        twice flips true→false.
const HASHTAG = /^#[a-z][a-z0-9_]*$/g;
function findHashtag(s) {
  return HASHTAG.test(s);
}

// BUG 2: no /g flag on .replace, so only the FIRST digit is removed.
function stripDigits(s) {
  return s.replace(/\d/, '');
}

// BUG 3: regex captures `name`, consumer reads `groups.tag`.
function parseTag(s) {
  const m = /^#(?<name>[a-z][a-z0-9_]*)$/.exec(s);
  return m ? { tag: m.groups.tag } : null;
}

const samples = [
  `findHashtag("#go") call 1: ${findHashtag('#go')}`,
  `findHashtag("#go") call 2: ${findHashtag('#go')}`,
  `findHashtag("#go") call 3: ${findHashtag('#go')}`,
  `stripDigits("a1b2c3")    : ${JSON.stringify(stripDigits('a1b2c3'))}`,
  `parseTag("#go")          : ${JSON.stringify(parseTag('#go'))}`,
];
document.getElementById('out').textContent = samples.join('\n');
