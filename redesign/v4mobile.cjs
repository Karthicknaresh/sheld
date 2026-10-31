const { chromium } = require('playwright-core');
const path = require('path');
const OUT = path.join(__dirname, '..', 'v4shots');
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  for (const page of ['relief', 'doorstep', 'askfirst']) {
    const p = await b.newPage({ viewport: { width: 390, height: 780 }, hasTouch: true, isMobile: true });
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(`file:///H:/VS%20Code/InsureShield/redesign/insureshield-nav-${page}.html`);
    await p.click('.burger'); await p.waitForTimeout(400);
    await p.click('[data-drill="insurance"]'); await p.waitForTimeout(1600);
    await p.screenshot({ path: path.join(OUT, `m-${page}.png`) });
    await p.close();
    // reduced motion: open a menu with an option hovered, the end state must show at once
    const r = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    r.on('pageerror', (e) => errs.push(e.message));
    await r.goto(`file:///H:/VS%20Code/InsureShield/redesign/insureshield-nav-${page}.html?open=insurance&hover=1`); await r.waitForTimeout(150);
    const st = await r.evaluate(() => [...document.querySelectorAll('#mega .iso')].map((e) => e.dataset.phase).join(',') || 'no-art');
    console.log(page, 'mobile ok · reduced-motion phases:', st, errs.length ? 'ERR ' + errs.join('|') : 'no errors');
    await r.close();
  }
  await b.close();
})();
