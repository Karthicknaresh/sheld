// InsureShield nav V6 · "Light up the dream" — concept cards (momentum-concept skill, set mode).
// Layout: the approved V2 Diorama (lead-approved): a header row and one card per option. Per the manager's
// comment, each card now shows its title and description FIRST and the illustration BELOW.
// Story: every card rests as a quiet pencil sketch. On hover the light comes on and a three-beat story plays
// (beat 0 the merchant's world switches on — warm lit windows, an open shop; beat 1 the moment happens;
// beat 2 the teal outcome lights up and holds). Beats are 320 ms apart (slow token), objects inside a beat
// 34 ms apart; return to rest 550 ms. No zoom, no lift for its own sake: light and colour arriving in story order.
// EXCEPTION (written into the handoff): menu tiles normally get one state change; V6 tiles play a short,
// non-looping three-beat story (~1.2 s), requested by the design lead. Reduced motion shows the final frame.
// Run: node concepts/v6-concepts.mjs → v6-dream.json
import fs from 'node:fs';

const COPY = {
  'Multi-Carrier Shipments': 'Parcel and freight across UPS, FedEx, DHL, and USPS', 'UPS Shipments': 'Coverage designed for packages shipped with UPS', 'Special Commodities': 'High-value, perishable, and specialty goods',
  'Select My Coverage': 'Answer a few questions to find the right fit', 'Get a Quote': 'Estimate cost for your shipping volume', CommerceShield: 'Order risk signals and chargeback protection',
  DeliveryDefense: 'Address confidence scores before you ship', 'Delivery Orchestration': 'Choose delivery options that lower risk', 'InsureShield® Shipping Insurance': 'Protection against loss, damage, and theft',
  'Connect with a Partner': 'Add coverage inside the platforms you use', 'Become a Partner': 'Offer InsureShield to your customers', Insights: 'Articles on shipping risk and protection',
  'Whitepapers & Guides': 'In-depth research and how-to guides', 'Customer Stories': 'How businesses recover faster', 'Help & Support': 'Answers about coverage, billing, and claims',
  Announcements: 'Product and company news', 'In The News': 'Press coverage of UPS Capital', 'Product Availability': 'Where coverage is offered', 'Contact Us': 'Reach our team'
};
const STORY = { trigger: 'hover', duration: 'slow', easing: 'enter' };
function c(title, scene, layout, message, viewerQuestion, relationship, device, objs, mapping, breaksDown, beats, meaning, alt, alts) {
  return {
    id: scene, scene, slot: 'media', frequency: 'frequent',
    copy: { title, body: COPY[title] }, message, viewerQuestion, relationship, device,
    mapping: mapping.map(([concept, object]) => ({ concept, object })), breaksDown,
    objects: objs.map((s) => { const [name, role, material] = s.split(':'); return { name, role, material }; }),
    layout,
    states: { rest: 'Outline: a quiet pencil sketch, lights off', active: beats.join(' → then '), meaning },
    story: beats.map((b, i) => ({ beat: i, at: `${i * 320} ms`, what: b })),
    motion: STORY, motionException: 'three-beat story on hover (~1.2 s, no loop), lead-approved; see the file header',
    reducedMotion: `show the final lit frame: ${beats[beats.length - 1]}`,
    alt, alternatives: alts.map(([angle, idea]) => ({ angle, idea }))
  };
}

const cards = [
  // ---------------- Shipping Insurance
  c('Multi-Carrier Shipments', 'mMulti', 'L5', 'Whichever carrier takes them, every parcel from your shop is looked after.', 'Am I covered whichever carrier I use?', 'protect', 'metonymy',
    ['parcel group:hero:teal', 'storefront:support:neutral'], [['your business', 'a small shop whose windows light up'], ['every carrier', 'three carrier-striped parcels at its door'], ['coverage', 'teal tape sealing each one']],
    'Tape could read as packing; it arrives only after the shop and the parcels are in place, as the last beat.',
    ['the shop windows light up warm', 'three carrier-striped parcels appear at the door', 'each parcel is sealed with teal tape, one after another'],
    'every carrier\'s parcel is covered', 'A small shop lights up; three carrier-striped parcels at its door are sealed with teal tape.',
    [['metaphor', 'carrier routes merging'], ['direct claim', 'one plate under all parcels']]),
  c('UPS Shipments', 'mUps', 'L5', 'Your UPS package is protected on the doorstep where someone is waiting for it.', 'Is it covered once it\'s delivered?', 'protect', 'metonymy',
    ['policy plate:hero:teal', 'home:support:neutral', 'parcel:support:carrier'], [['someone waiting', 'a home whose window lights up'], ['the delivery', 'a UPS parcel landing on the step'], ['coverage', 'the doormat lighting teal']],
    'A teal mat could read as decoration; it lights only once the parcel has landed on it.',
    ['the home\'s window lights up', 'a UPS-banded parcel lands on the step', 'the doormat under it lights teal'],
    'the package is covered at the door', 'A home lights up; a UPS parcel lands on the step and the mat under it turns teal.',
    [['proof', 'coins on the step'], ['before-after', 'parcel turning teal']]),
  c('Special Commodities', 'mSpecial', 'L2', 'What is precious to you is precious to us.', 'Is something this valuable covered?', 'protect', 'before-after',
    ['check ring:hero:teal', 'safe:support:blue', 'policy plate:support:neutral'], [['something precious', 'a blue safe'], ['opening it', 'the door swinging aside'], ['covered', 'a teal check ring rising over it']],
    'A safe reads as storage; the check ring makes it about coverage, not security.',
    ['the blue safe takes its colour on its plate', 'its door slides open', 'a teal check ring rises above it'],
    'high-value goods are covered', 'A blue safe opens on a plate and a teal check ring rises above it.',
    [['direct claim', 'an item rising from a box'], ['contrast', 'three different boxes']]),
  c('Select My Coverage', 'mSelect', 'L3', 'A few honest answers, and the right protection lights up.', 'Which coverage fits what I ship?', 'fit', 'before-after',
    ['shield:hero:teal', 'claim document:support:chalk', 'check ring:support:teal'], [['your answers', 'three rings on a sheet ticking'], ['the fit', 'a shield lighting up beside it']],
    'A checklist could read as paperwork; the shield at the end makes it the result.',
    ['the question sheet takes its colour', 'its three rings tick one after another', 'a teal shield lights up beside it'],
    'the right coverage is found', 'A question sheet whose rings tick, then a teal shield lights up beside it.',
    [['metaphor', 'stepped plates'], ['proof', 'a dial in the teal band']]),
  c('Get a Quote', 'mQuote', 'L4', 'Your price grows only with what you ship.', 'What will it cost?', 'scale', 'number made physical',
    ['coin stack:hero:teal', 'parcel group:support:kraft'], [['your volume', 'a stack of parcels'], ['the estimate', 'coins rising to match']],
    'Coins could read as payout; they rise beside the parcels as their price.',
    ['the parcel stack takes its colour', 'coins rise beside it one by one', 'the top coin lights teal'],
    'the estimate is ready', 'A stack of parcels with coins rising beside it, the top one teal.',
    [['metonymy', 'a quote sheet with a coin'], ['contrast', 'small and large stacks']]),
  // ---------------- Solutions
  c('DeliveryDefense', 'mDefense', 'L5', 'Know the right door before the parcel leaves.', 'Will this reach the right door?', 'verify', 'before-after',
    ['pin:hero:teal', 'home:support:neutral'], [['the street', 'two homes lighting up'], ['the right address', 'a teal pin landing at one door']],
    'A pin reads as maps; it lands before anything is shipped.',
    ['two homes light up', 'a pin hovers between them', 'the teal pin lands at the right door'],
    'the address is confirmed', 'Two homes light up and a teal pin lands at one door.',
    [['mechanism', 'label with a check'], ['proof', 'a dial']]),
  c('Delivery Orchestration', 'mOrchestrate', 'L3', 'Take the way home that keeps the parcel safe.', 'Is there a safer way?', 'transit', 'cause-effect',
    ['route:hero:teal', 'cloud:support:coral', 'home:support:neutral'], [['the usual way', 'a branch under a coral cloud'], ['the safer way', 'the other branch lighting teal to the home']],
    'Must not imply weather is stopped; the route goes round it.',
    ['the home lights up at the end of the road', 'a coral cloud gathers over one branch', 'the other branch lights teal all the way home'],
    'a safer option is chosen', 'A coral cloud over one branch; the other branch lights teal to a home.',
    [['contrast', 'parcel under a cloud'], ['proof', 'plates with one teal']]),
  c('CommerceShield', 'mCommerce', 'L5', 'Sell with confidence: risky orders are flagged before they cost you.', 'Can I trust this order?', 'verify', 'before-after',
    ['check ring:hero:teal', 'laptop:support:neutral', 'coral mark:support:coral'], [['your store', 'a laptop screen lighting up'], ['a doubt', 'a coral mark'], ['screened', 'a teal check ring']],
    'Must not promise all fraud stops; the ring says the order was screened.',
    ['the laptop screen lights up', 'a coral mark appears over the order', 'it turns into a teal check ring'],
    'the order is screened', 'A laptop lights up, a coral mark appears and becomes a teal check ring.',
    [['contrast', 'two parcels, one held'], ['mechanism', 'a gate ring']]),
  c('InsureShield® Shipping Insurance', 'mInsure', 'L5', 'When something goes wrong, you are not left alone with it.', 'What if it arrives damaged?', 'recovery', 'cause-effect',
    ['shield:hero:teal', 'parcel:support:coral'], [['the bad day', 'a parcel turning coral'], ['the promise', 'a shield lighting up behind it']],
    'A shield behind a damaged parcel could read as "too late"; it is the policy that pays.',
    ['the parcel takes its kraft colour', 'it is dented: it turns coral', 'a large teal shield lights up behind it and the coral fades'],
    'covered loss is made whole', 'A parcel turns coral, then a large teal shield lights up behind it.',
    [['proof', 'coins beside it'], ['mechanism', 'claim → check → coins']]),
  // ---------------- Partners
  c('Connect with a Partner', 'mConnect', 'L3', 'Your platform and InsureShield light up together.', 'Does it fit what I already use?', 'connect', 'metaphor',
    ['dock block:hero:teal', 'laptop:support:neutral', 'route:support:teal'], [['your platform', 'a laptop'], ['the connection', 'a teal block seating on it and a route lighting out']],
    'A block could read as hardware; the route makes it a connection.',
    ['the laptop lights up', 'a teal block seats onto it', 'a teal route lights out from it'],
    'coverage is connected', 'A laptop lights up, a teal block seats on it and a route lights out.',
    [['proof', 'a row of blocks'], ['metonymy', 'a storefront awning']]),
  c('Become a Partner', 'mBecome', 'L5', 'Your shop can protect every customer who trusts it.', 'Can I offer this to my customers?', 'protect', 'metonymy',
    ['storefront:hero:teal', 'parcel group:support:kraft'], [['your business', 'a shop opening up'], ['your customers', 'parcels leaving the door'], ['the offer', 'the awning lighting teal']],
    'A teal awning could read as branding; it lights as the parcels leave, as the offer.',
    ['the shop windows light up', 'two parcels go out of the door', 'the awning lights teal'],
    'the shop offers coverage', 'A shop lights up, parcels leave and its awning turns teal.',
    [['connect', 'dock block'], ['proof', 'many shops']]),
  // ---------------- Resources
  c('Help & Support', 'mHelp', 'L3', 'Even late at night, your question gets an answer.', 'Can someone help me now?', 'contact', 'before-after',
    ['check ring:hero:teal', 'home:support:neutral', 'claim document:support:chalk'], [['you', 'one lit window at night'], ['the answer', 'a document arriving'], ['resolved', 'a teal check ring']],
    'A lit window could read as a mood picture; the document and check make it an answer.',
    ['one window lights up', 'a document arrives at the door', 'a teal check ring lights over it'],
    'the question is answered', 'One window lights up, a document arrives and a teal check ring lights over it.',
    [['proof', 'a clock'], ['contact', 'a mailbox flag']]),
  c('Customer Stories', 'mStories', 'L5', 'Businesses like yours had a hard day, and got back up.', 'Has this worked for others?', 'recovery', 'cause-effect',
    ['coin stack:hero:teal', 'storefront:support:neutral', 'coral mark:support:coral'], [['a hard day', 'a dark shop with a coral mark'], ['recovery', 'coins rising'], ['back in business', 'the windows lighting up']],
    'Coins could read as profit; they rise as the payout that turns the lights back on.',
    ['the shop shows a coral mark', 'teal coins rise beside it and the mark fades', 'the shop windows light up again'],
    'the business recovered', 'A dark shop with a coral mark; coins rise and its windows light up again.',
    [['proof', 'a damaged parcel and coins'], ['relatable moment', 'storefront step']]),
  c('Insights', 'mInsights', 'L4', 'See the pattern before it costs you.', 'What does the data say about my risk?', 'inform', 'number made physical',
    ['bars:hero:teal', 'claim document:support:chalk'], [['the data', 'bars on a sheet'], ['the insight', 'the tallest lighting teal']],
    'Bars read as growth; they stand on a sheet as an article\'s chart.',
    ['the sheet takes its colour', 'the bars light up one by one', 'the tallest lights teal'],
    'the pattern is clear', 'Bars on a sheet light up one by one, the tallest teal.',
    [['risk shown', 'cloud over a sheet'], ['metaphor', 'route on a sheet']]),
  c('Whitepapers & Guides', 'mGuides', 'L2', 'The whole way through, laid out for you.', 'Is there a complete guide?', 'inform', 'metaphor',
    ['sheets:hero:teal', 'route:support:teal'], [['the guide', 'a stack of sheets'], ['the way through', 'a route drawing across it'], ['your place', 'a teal tab']],
    'A route on paper could read as a map; it is a how-to path.',
    ['the stack of guides takes its colour', 'a teal route draws across the top sheet', 'a teal tab lights at your chapter'],
    'the way through is mapped', 'A stack of guides with a teal route drawing across the top and a teal tab.',
    [['direct claim', 'a binder'], ['proof', 'a tall stack']]),
  // ---------------- About
  c('Contact Us', 'mContact', 'L5', 'A real person is ready to write back.', 'Can I talk to someone?', 'contact', 'metonymy',
    ['mailbox:hero:teal', 'home:support:neutral'], [['you', 'a home lighting up'], ['a reply', 'the mailbox flag rising']],
    'A mailbox reads as post; the raised flag means a reply is waiting.',
    ['the home lights up', 'the mailbox takes its teal colour', 'its flag rises'],
    'a reply is waiting', 'A home lights up and its teal mailbox raises its flag.',
    [['proof', 'document with a check'], ['mechanism', 'route to a mailbox']]),
  c('Product Availability', 'mAvail', 'L4', 'Coverage reaches the place you call home.', 'Is it offered where I am?', 'reach', 'number made physical',
    ['puck:hero:teal', 'pin:support:teal'], [['places', 'a row of pucks'], ['yours', 'the last one lighting teal under a pin']],
    'Pucks could read as buttons; the pins make them places.',
    ['the row of pucks takes its colour', 'pins land on them one by one', 'the nearest puck lights teal'],
    'coverage reaches you', 'Pins land on a row of pucks; the nearest lights teal.',
    [['proof', 'region tiles'], ['metaphor', 'route to a home']]),
  c('Announcements', 'mAnnounce', 'L5', 'News for you arrives at your door.', 'What\'s new with InsureShield?', 'inform', 'metonymy',
    ['sheets:hero:teal', 'home:support:neutral'], [['you', 'a home lighting up'], ['the news', 'a teal sheet landing on the mat']],
    'A sheet on a mat could read as junk mail; it lands teal, the brand voice.',
    ['the home lights up', 'a sheet drops onto the doormat', 'it lights teal'],
    'the news has arrived', 'A home lights up and a teal sheet lands on its mat.',
    [['proof', 'a stack of sheets'], ['metaphor', 'open box']]),
  c('In The News', 'mNews', 'L2', 'People are talking about the company behind your cover.', 'What do others say about them?', 'protect', 'double meaning',
    ['shield:hero:teal', 'sheets:support:chalk'], [['press', 'printed sheets'], ['coverage', 'a teal shield standing up on them']],
    'A shield on paper could read as a certificate; it stands upright on the stack.',
    ['the printed sheets take their colour', 'their headlines appear', 'a teal shield stands up on top'],
    'the company is in the news', 'Printed sheets with headlines and a teal shield standing up on top.',
    [['proof', 'pin on a sheet'], ['metaphor', 'shield behind homes']])
];
fs.writeFileSync(new URL('./v6-dream.json', import.meta.url), JSON.stringify({ set: 'InsureShield nav V6 · Light up the dream', cards }, null, 1));
console.log('cards:', cards.length);
