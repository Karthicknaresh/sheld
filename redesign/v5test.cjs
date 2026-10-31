// Real-mouse test of V5 · Journey: open each menu from its trigger, walk the route forwards then jump back,
// check the parcel position, visited stops, lit dashes and the status line. Also keyboard, phone and reduced motion.
const { chromium } = require('playwright-core');
const path = require('path');
const URL = 'file:///H:/VS%20Code/InsureShield/redesign/insureshield-nav-v5.html';
const OUT = path.join(__dirname, '..', 'v5shots'); require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await p.goto(URL); await p.waitForTimeout(300);
  const out = [];
  for (const id of ['insurance', 'solutions', 'partners', 'resources', 'about']) {
    const t = await (await p.$(`.nav-t[data-id="${id}"]`)).boundingBox();
    await p.mouse.move(t.x + t.width / 2, t.y + t.height / 2, { steps: 4 }); await p.waitForTimeout(800);
    const tiles = await p.$$(`#dd-${id} .tile`); const order = [...tiles.keys(), 0]; let ok = 0;
    for (const k of order) {
      const bb = await tiles[k].boundingBox(); await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height * 0.7, { steps: 8 }); await p.waitForTimeout(800);
      const st = await p.evaluate(([id, k]) => {
        const l = document.querySelector(`#dd-${id}`), svg = l.querySelector('.strip svg'), pitch = +svg.dataset.pitch;
        const v = [...svg.querySelectorAll('[data-object*=":"]')].map((g) => [+g.dataset.st, g.classList.contains('v')]);
        const visitedOk = v.every(([s, on]) => on === (s <= k));
        const tr = svg.querySelector('[data-object="parcel"]').style.translate, dx = parseFloat(tr) || 0;
        const parcelOk = Math.abs(dx - ((k + 0.5) * pitch - 56 - 30)) < 1;
        const lit = [...svg.querySelectorAll('[data-progress] path')].filter((d) => d.classList.contains('lit')).map((d) => +d.dataset.x);
        const litOk = lit.length > 0 && Math.max(...lit) <= (k + 0.5) * pitch - 56 + 12;
        const badge = l.querySelector('.badge').textContent;
        return visitedOk && parcelOk && litOk && badge === `Stop ${k + 1} of ${l.querySelectorAll('.tile').length}` && document.querySelector('#mega').classList.contains('open');
      }, [id, k]);
      if (st) ok++;
      if (k === Math.min(2, tiles.length - 1)) await p.screenshot({ path: path.join(OUT, `v5-${id}.png`), clip: { x: 0, y: 0, width: 1440, height: 620 } });
    }
    out.push(`${id} ${ok}/${order.length}`);
  }
  // keyboard: Escape closes, ArrowDown opens and focuses the first tile, ArrowRight walks
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  await p.focus('.nav-t[data-id="insurance"]'); await p.keyboard.press('ArrowDown'); await p.waitForTimeout(400); await p.keyboard.press('ArrowRight'); await p.waitForTimeout(800);
  const kb = await p.evaluate(() => document.activeElement.dataset.k === '1' && document.querySelector('#dd-insurance .badge').textContent === 'Stop 2 of 5');
  console.log(out.join(' · '), '| keyboard', kb ? 'ok' : 'FAIL', errs.length ? '| ERRORS ' + errs.join(' | ') : '| no errors');
  // reduced motion: the end state at once
  const r = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await r.goto(URL + '?open=about&stop=3'); await r.waitForTimeout(800);
  console.log('reduced motion:', await r.evaluate(() => { const s = document.querySelector('#dd-about .strip .iso'); return s.dataset.phase + ' · visited ' + s.querySelectorAll('[data-object*=":"].v').length; }));
  // phone sheet
  const m = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await m.goto(URL); await m.click('.burger'); await m.waitForTimeout(400); await m.click('[data-drill="insurance"]'); await m.waitForTimeout(800);
  await m.screenshot({ path: path.join(OUT, 'v5-phone.png') });
  await b.close();
})();
