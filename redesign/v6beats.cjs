const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs=[]; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file:///H:/VS%20Code/InsureShield/redesign/insureshield-nav-v6.html'); await p.waitForTimeout(300);
  for (const id of process.argv[2].split(',')) {
    const t = await (await p.$(`.nav-t[data-id="${id}"]`)).boundingBox(); await p.mouse.move(t.x + t.width/2, t.y + t.height/2, { steps: 3 }); await p.waitForTimeout(900);
    const cards = await p.$$(`#dd-${id} .card`);
    for (let i = 0; i < cards.length; i++) { const bb = await cards[i].boundingBox(); await p.mouse.move(bb.x + bb.width/2, bb.y + bb.height*0.7, { steps: 5 });
      for (const [ms, tag] of [[330,'b1'],[350,'b2'],[900,'end']]) { await p.waitForTimeout(ms); await p.screenshot({ path: `${process.argv[3]}/v6-${id}-${i}-${tag}.png`, clip: { x: bb.x - 4, y: bb.y - 4, width: bb.width + 8, height: bb.height + 8 } }); } }
  }
  console.log(errs.length ? 'ERR ' + errs.join('|') : 'no errors'); await b.close();
})();
