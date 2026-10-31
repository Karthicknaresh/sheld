// InsureShield nav V5 · Journey — concept cards (momentum-concept skill, set mode; slots come from the
// momentum-sections spec in concepts/v5-spec.json).
//   The mega menu is a Library "Tile" matrix. The tiles' 144 px media slots join into ONE continuous strip:
//   a dashed route runs through every tile, each tile owns one stop. The merchant's parcel travels the
//   route to the hovered stop (the view never moves; only the parcel does), the route fills teal behind it,
//   visited stops keep their colour and the next stop waits as an outline. It reads like parcel tracking,
//   the screen every merchant already checks most.
// Two sets: the journey mechanism (1 card, shared by all five menus) and the 19 stops.
// Run: node concepts/v5-concepts.mjs  → v5-journey.json, v5-stops.json
import fs from 'node:fs';

const COPY = {
  'Shipping Insurance': 'Protect shipments from covered loss, damage, and theft.',
  'Multi-Carrier Shipments': 'Parcel and freight across UPS, FedEx, DHL, and USPS', 'UPS Shipments': 'Coverage designed for packages shipped with UPS', 'Special Commodities': 'High-value, perishable, and specialty goods',
  'Select My Coverage': 'Answer a few questions to find the right fit', 'Get a Quote': 'Estimate cost for your shipping volume', CommerceShield: 'Order risk signals and chargeback protection',
  DeliveryDefense: 'Address confidence scores before you ship', 'Delivery Orchestration': 'Choose delivery options that lower risk', 'InsureShield® Shipping Insurance': 'Protection against loss, damage, and theft',
  'Connect with a Partner': 'Add coverage inside the platforms you use', 'Become a Partner': 'Offer InsureShield to your customers', Insights: 'Articles on shipping risk and protection',
  'Whitepapers & Guides': 'In-depth research and how-to guides', 'Customer Stories': 'How businesses recover faster', 'Help & Support': 'Answers about coverage, billing, and claims',
  Announcements: 'Product and company news', 'In The News': 'Press coverage of UPS Capital', 'Product Availability': 'Where coverage is offered', 'Contact Us': 'Reach our team'
};
const M = { base: { trigger: 'hover', duration: 'base', easing: 'standard' }, slow: { trigger: 'hover', duration: 'slow', easing: 'enter' } };
function c(title, scene, layout, message, viewerQuestion, relationship, device, objs, mapping, breaksDown, active, meaning, alt, alts, o = {}) {
  return {
    id: scene, scene, slot: o.slot || 'media', frequency: 'frequent',
    copy: { title, body: COPY[title], status: o.status || message }, message, viewerQuestion, relationship, device,
    mapping: mapping.map(([concept, object]) => ({ concept, object })), breaksDown,
    objects: objs.map((s) => { const [name, role, material] = s.split(':'); return { name, role, material }; }),
    layout, states: { rest: o.rest || 'Outline: ghost hairline on the strip, waiting for the parcel', active, meaning },
    motion: o.motion || M.base, reducedMotion: o.rm || `show the end state: ${active.replace(/^the /, '')}`,
    alt, alternatives: alts.map(([angle, idea]) => ({ angle, idea }))
  };
}
const ARRIVE = 'when the parcel arrives, ';

const journey = [
  c('Shipping Insurance', 'journey', 'L3', 'Your parcel is looked after at every stop of its journey.', 'Where does InsureShield help along the way?', 'transit', 'metaphor',
    ['parcel:hero:kraft', 'route:support:teal', 'policy plate:support:neutral'],
    [['your shipment', 'the parcel travelling the route'], ['the InsureShield process', 'the teal route filling behind it'], ['each product or answer', 'a stop on the route']],
    'A travelling parcel could read as delivery; InsureShield does not deliver. The parcel is the merchant\'s shipment and the route is the process, never a road.',
    'the parcel travels to the pointed stop, the route fills teal behind it and its tape turns teal', 'the shipment is covered as it goes',
    'A kraft parcel on a dashed route that runs through a row of stops; the route turns teal behind it.',
    [['proof', 'a stop counter made of boxes'], ['direct claim', 'one long policy plate under the whole route']], { motion: M.slow, status: 'Point at a stop to send your parcel there' })
];

const stops = [
  // Shipping Insurance — "From your counter to covered"
  c('Select My Coverage', 'vSelect', 'L2', 'Of three plates, the one that fits your parcel lights up.', 'Which coverage fits what I ship?', 'fit', 'metaphor',
    ['stepped plates:hero:teal', 'parcel:support:kraft'], [['coverage sizes', 'three stepped plates'], ['the fit', 'the middle plate turning teal']],
    'Plates could read as a podium; they stay low and the fit is the middle one, not the biggest.', ARRIVE + 'the middle of three stepped plates turns teal', 'the right coverage is found',
    'Three stepped plates beside the route; the middle one turns teal.', [['contrast', 'three shields, one teal'], ['mechanism', 'a question sheet with rings']], { status: 'The right fit, in a few answers' }),
  c('Get a Quote', 'vQuote', 'L2', 'The price is on the table before you commit.', 'What will it cost?', 'scale', 'number made physical',
    ['coin stack:hero:teal', 'claim document:support:chalk'], [['the quote', 'a sheet on a plate'], ['the estimate', 'coins rising on it']],
    'Coins could read as a payout; they stand on the quote sheet as the price.', ARRIVE + 'three teal coins rise on the quote sheet', 'the estimate is ready',
    'A quote sheet beside the route with a short teal coin stack rising on it.', [['proof', 'parcels beside coins'], ['metaphor', 'a dial']], { motion: M.slow, status: 'An estimate for your volume' }),
  c('Multi-Carrier Shipments', 'vMulti', 'L3', 'Every carrier\'s route joins the same coverage.', 'Am I covered whichever carrier I use?', 'protect', 'metaphor',
    ['route:hero:teal', 'parcel group:support:carrier'], [['each carrier', 'a striped parcel on a short spur'], ['one policy', 'the spurs joining the teal route']],
    'Spurs could read as a delivery network; they start at carrier-striped parcels and end on the policy route.', ARRIVE + 'three short spurs from striped parcels draw into the teal route', 'one policy for every carrier',
    'Three carrier-striped parcels whose short spurs join the main teal route.', [['direct claim', 'parcels on one plate'], ['contrast', 'one shield, many parcels']], { status: 'One policy covers every carrier' }),
  c('UPS Shipments', 'vUps', 'L5', 'Your UPS package is covered when it reaches the door.', 'Is it covered once it\'s delivered?', 'protect', 'metonymy',
    ['shield:hero:teal', 'door:support:neutral', 'parcel:support:carrier'], [['the delivery moment', 'a UPS parcel at a door'], ['coverage', 'a shield rising beside it']],
    'A shield at a door could read as a guard; it is the policy beside the parcel, not a lock.', ARRIVE + 'a teal shield rises beside the UPS parcel at the door', 'the package is covered at the door',
    'A UPS-banded parcel at a door with a teal shield rising beside it.', [['proof', 'coins on the step'], ['before-after', 'parcel turning teal']], { motion: M.slow, status: 'Covered right up to the door' }),
  c('Special Commodities', 'vSpecial', 'L5', 'Even your most valuable goods ride on a policy.', 'Is something this valuable covered?', 'protect', 'metonymy',
    ['policy plate:hero:teal', 'safe:support:blue'], [['high value', 'a blue safe'], ['the policy', 'the plate under it turning teal']],
    'A safe reads as storage; the teal plate makes it a covered shipment.', ARRIVE + 'the plate under the blue safe turns teal', 'high-value goods are covered',
    'A blue safe on a plate beside the route; the plate turns teal.', [['direct claim', 'an item rising from a box'], ['contrast', 'three different boxes']], { status: 'High-value goods ride covered' }),
  // Solutions — "Lower the risk at every stop"
  c('DeliveryDefense', 'vDefense', 'L5', 'You know the address is good before the parcel leaves.', 'Will this reach the right door?', 'verify', 'before-after',
    ['pin:hero:teal', 'home:support:neutral'], [['the address', 'a home'], ['confidence', 'a teal pin landing at it']],
    'A pin could read as maps; it lands before the parcel moves on.', ARRIVE + 'a teal pin drops onto the home ahead', 'the address is confirmed',
    'A home beside the route; a teal pin drops onto it.', [['mechanism', 'a label with a check'], ['proof', 'a dial in the teal band']], { motion: M.slow, status: 'Address checked before you ship' }),
  c('Delivery Orchestration', 'vOrchestrate', 'L3', 'At the fork, the safer way is the one that lights up.', 'Is there a safer way to deliver this?', 'transit', 'metaphor',
    ['check ring:hero:teal', 'route:support:teal'], [['delivery options', 'a fork off the route'], ['the safer choice', 'a check ring on its branch']],
    'A fork could read as navigation; the check marks a choice, not a turn.', ARRIVE + 'a check ring rises on the safer branch of the fork', 'a safer option is chosen',
    'A fork off the route with a teal check ring rising on one branch.', [['contrast', 'a parcel under a cloud'], ['proof', 'plates with one teal']], { status: 'The safer delivery option' }),
  c('CommerceShield', 'vCommerce', 'L5', 'A risky order is flagged before it ships.', 'Can I trust this order?', 'verify', 'before-after',
    ['check ring:hero:teal', 'laptop:support:neutral', 'coral mark:support:coral'], [['the order', 'a laptop'], ['the risk', 'a coral mark'], ['screened', 'a teal check ring']],
    'Must not promise every fraud is stopped; the ring says the order was screened.', ARRIVE + 'the coral mark over the laptop turns into a teal check ring', 'the order is screened',
    'A laptop with a coral mark that becomes a teal check ring.', [['contrast', 'two parcels, one held'], ['mechanism', 'gate on a route']], { status: 'Orders screened for risk' }),
  c('InsureShield® Shipping Insurance', 'vInsureShield', 'L3', 'The parcel passes under the shield and comes out covered.', 'What protects it once it leaves me?', 'protect', 'metaphor',
    ['shield:hero:teal', 'route:support:teal'], [['coverage', 'a shield standing over the route'], ['the shipment', 'the parcel passing it']],
    'A shield over a route could read as a toll gate; it stands beside the route, never blocking it.', ARRIVE + 'a large teal shield rises beside the route and gains its check', 'the parcel is covered',
    'A large teal shield rising beside the route, gaining a check.', [['proof', 'coins beside a damaged parcel'], ['before-after', 'kraft parcel turning teal']], { motion: M.slow, status: 'Loss, damage and theft covered' }),
  // Partners — "Plug coverage into the way you sell"
  c('Connect with a Partner', 'vConnect', 'L5', 'Coverage clicks into the platform you already use.', 'Does it fit what I already have?', 'connect', 'metaphor',
    ['dock block:hero:teal', 'laptop:support:neutral'], [['your platform', 'a laptop'], ['the connection', 'a teal block seating on it']],
    'A block could read as hardware; it seats flush, one unit, no more.', ARRIVE + 'a teal block drops and seats on the laptop', 'coverage is connected',
    'A laptop beside the route with a teal block seating onto it.', [['metaphor', 'a route to a plate'], ['proof', 'a row of connected blocks']], { motion: M.slow, status: 'Coverage inside your platform' }),
  c('Become a Partner', 'vBecome', 'L3', 'Your shop sends every parcel out covered.', 'Can I offer this to my customers?', 'protect', 'metonymy',
    ['storefront:hero:teal', 'parcel group:support:kraft'], [['your business', 'a storefront'], ['the offer', 'its awning turning teal as parcels leave sealed']],
    'A teal awning could read as branding; parcels leaving with teal tape tie it to coverage.', ARRIVE + 'the storefront awning turns teal and its parcels gain teal tape', 'the shop offers coverage',
    'A storefront beside the route whose awning turns teal as its parcels are sealed.', [['connect', 'dock block'], ['proof', 'many storefronts']], { status: 'Offer coverage to your customers' }),
  // Resources — "Help is never more than one stop away"
  c('Help & Support', 'vHelp', 'L2', 'Your question gets answered.', 'Can someone help me now?', 'verify', 'before-after',
    ['claim document:hero:chalk', 'check ring:support:teal'], [['your question', 'a document standing on a plate'], ['answered', 'a teal check ring rising over it']],
    'A check could read as "approved claim"; here it stands for an answer.', ARRIVE + 'a teal check ring rises over the standing document', 'the question is answered',
    'A document standing on a plate with a teal check ring rising over it.', [['contact', 'a mailbox flag'], ['proof', 'a clock']], { status: 'Answers on coverage, billing and claims' }),
  c('Customer Stories', 'vStories', 'L5', 'Businesses like yours got their money back.', 'Has this worked for others?', 'recovery', 'cause-effect',
    ['coin stack:hero:teal', 'parcel:support:coral'], [['the loss', 'a damaged coral parcel'], ['the recovery', 'a teal coin stack beside it']],
    'Coins could read as profit; they rise next to the damaged parcel as the payout.', ARRIVE + 'the coral parcel fades to grey and a teal coin stack rises beside it', 'the business recovered',
    'A damaged coral parcel beside the route; it fades as a teal coin stack rises.', [['proof', 'three storefronts'], ['relatable moment', 'a storefront step']], { motion: M.slow, status: 'How businesses recover faster' }),
  c('Insights', 'vInsights', 'L2', 'Patterns in shipping risk become plain to see.', 'What does the data say about my risk?', 'inform', 'number made physical',
    ['bars:hero:teal', 'claim document:support:chalk'], [['the data', 'bars on a sheet'], ['the insight', 'the tallest bar turning teal']],
    'Bars read as growth; they stand on a sheet as an article\'s chart.', ARRIVE + 'the tallest bar on the sheet turns teal', 'the pattern is clear',
    'A sheet beside the route with box bars, the tallest turning teal.', [['risk shown', 'a cloud over a sheet'], ['mechanism', 'a route on a sheet']], { status: 'Articles on shipping risk' }),
  c('Whitepapers & Guides', 'vGuides', 'L3', 'The whole route is mapped out for you.', 'Is there a complete guide?', 'inform', 'metaphor',
    ['sheets:hero:teal', 'route:support:teal'], [['the guide', 'a stack of sheets'], ['the way through', 'a teal route drawn on the top sheet']],
    'A route on paper could read as a map; it is a how-to path drawn on the guide.', ARRIVE + 'a teal route draws across the top sheet of the stack', 'the way through is mapped',
    'A stack of sheets with a teal route drawing across the top one.', [['direct claim', 'a binder with a tab'], ['proof', 'a tall stack']], { status: 'In-depth research and how-to guides' }),
  // About — "The team that rides along with you"
  c('Contact Us', 'vContact', 'L5', 'Someone is ready to write back.', 'Can I talk to someone?', 'contact', 'metonymy',
    ['mailbox:hero:teal', 'home:support:neutral'], [['reaching out', 'a mailbox at the roadside'], ['a reply', 'its flag rising']],
    'A mailbox reads as post; the raised flag means a reply is waiting.', ARRIVE + 'the mailbox flag rises', 'a reply is waiting',
    'A teal mailbox at the roadside raising its flag.', [['proof', 'a document with a check'], ['mechanism', 'a route to a mailbox']], { status: 'Reach our team' }),
  c('Product Availability', 'vAvail', 'L2', 'Coverage reaches your corner of the map.', 'Is it offered where I am?', 'reach', 'metonymy',
    ['puck:hero:teal', 'pin:support:teal'], [['places', 'a row of pucks'], ['yours', 'the nearest turning teal as a pin lands']],
    'Pucks in a row could read as buttons; the pin makes them places.', ARRIVE + 'a pin lands on the nearest puck, which turns teal', 'coverage reaches you',
    'A row of pucks on a plate; a pin lands on the nearest, which turns teal.', [['proof', 'region tiles'], ['metaphor', 'route to a home']], { motion: M.slow, status: 'Where coverage is offered' }),
  c('Announcements', 'vAnnounce', 'L2', 'What is new arrives on top.', 'What\'s new with InsureShield?', 'inform', 'before-after',
    ['sheets:hero:teal', 'policy plate:support:neutral'], [['news', 'a stack of sheets'], ['the latest', 'a teal sheet landing on top']],
    'A sheet landing could read as filing; it lands teal, the newest one.', ARRIVE + 'a teal sheet lands on top of the stack', 'the news has arrived',
    'A stack of sheets on a plate with a teal sheet landing on top.', [['metonymy', 'a sheet on a doormat'], ['proof', 'an open box']], { motion: M.slow, status: 'Product and company news' }),
  c('In The News', 'vNews', 'L2', 'The press covers the company behind your cover.', 'What do others say about them?', 'protect', 'double meaning',
    ['shield:hero:teal', 'sheets:support:chalk'], [['press', 'printed sheets'], ['coverage', 'a teal shield standing up from them']],
    'A shield on paper could read as a certificate; it stands upright on the stack.', ARRIVE + 'a small teal shield stands up on the printed sheets', 'the company is in the news',
    'Printed sheets on a plate with a small teal shield standing up on them.', [['proof', 'pin on a sheet'], ['metaphor', 'shield behind homes']], { status: 'Press coverage of UPS Capital' })
];

const here = (f) => new URL(f, import.meta.url);
fs.writeFileSync(here('./v5-journey.json'), JSON.stringify({ set: 'InsureShield nav V5 · Journey (mechanism)', cards: journey }, null, 1));
fs.writeFileSync(here('./v5-stops.json'), JSON.stringify({ set: 'InsureShield nav V5 · Journey stops', cards: stops }, null, 1));
console.log('cards:', journey.length, stops.length);
