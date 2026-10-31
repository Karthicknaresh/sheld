# InsureShield nav: Stage + Diorama

## Open the pages

- V2 Stage: `redesign/insureshield-nav-stage.html`
- V2 Diorama: `redesign/insureshield-nav-diorama.html`
- V3-A Panorama: `redesign/insureshield-nav-panorama.html`
- V3-B Atelier: `redesign/insureshield-nav-atelier.html`
- V3-C Icon rail: `redesign/insureshield-nav-rail.html`

## V7 · two options on the APPROVED Stage layout (current direction)

- Approved layout: "Header / Stage" and "Mega menu / Stage" on the Figma page "InsureShield _Testing" (nodes 10009:58136 and 10009:54246).
- V7 clones those exactly. Manager's change: the caption sits above the picture. Pointing at an option tells its story in the left picture.
- Pages:
  - Option A · Light up the dream: `redesign/insureshield-nav-v7a.html`
  - Option B · Thread of care: `redesign/insureshield-nav-v7b.html`
- Figma: page "InsureShield V7", with:
  - Libraries: "Library/V7-A …" and "Library/V7-B …" (Rest → Beat 1 → Beat 2 → Lit, chained).
  - Blocks: "Block/Mega menu Stage A" and "… B".
  - Headers: "Block/Header Stage A" and "… B".
  - Two 1440 pages and two flows.
- Concepts: `concepts/v7-concepts.mjs` → `v7-a.json` (5 new overviews + the 19 V6 stories) and `v7-b.json` (24 new). Both 0 errors.
- Art: `scenes-v7.mjs` (Option A overviews and the Option B thread stories) plus `scenes-v6.mjs` (Option A options).
- Figma rebuild: `node redesign/figma-export-v7.mjs`.
- Test: `node redesign/v7beats.cjs v7a <outdir>`. Both options: 19/19 stories play, no errors.

### V7-B mobile (Figma only, page "InsureShield V7", sections "V7-B Thread of care · Mobile …")

- **Option 1 · Story drawer:** the menu list drills into a menu, with the thread story at the top and the options below.
- **Option 2 · Story cards:** Momentum Tab Strip plus swipeable story cards. The centred card plays; seen cards stay lit.
- **Option 3 · Thread list:** an accordion where the thread runs down the list and lights options as you scroll.
- **Layout:** follows the Secure Commerce "Version A / Phone 390" frame: 16 margins, 64 header, 44 pill buttons, Inter in Momentum mobile sizes.
- **Library parts:** from the Momentum Design Library (Button, Button Icon, Tab Strip, Material Symbols). The InsureShield theme isn't published to this file, so the primary button colour is overridden to teal and labels to Inter.
- **Prototype:** three flows, "InsureShield V7-B Mobile – Option 1/2/3".

## V6 · Light up the dream (built on the lead-approved V2 Diorama)

- Page: `redesign/insureshield-nav-v6.html`
- Figma: page "InsureShield V6", flow "InsureShield V6 – Light up the dream".
- Manager's comment applied: each card shows its title and description first, with the picture below. The pictures sit on a common baseline.
- 19 new illustrations: concepts in `concepts/v6-concepts.mjs` → `v6-dream.json` (0 errors), drawings in `scenes-v6.mjs`.
- At rest each card is a pencil sketch. On hover it plays a three-beat story, 320 ms per beat:
  1. The world switches on (lit windows).
  2. The moment happens.
  3. The teal outcome lights up.
- Engine extension in `iso.js`: `b` is the beat on which colour arrives; `ab` is the beat on which the change plays. CSS: `.V6` rules in `page.template.html`.
- Exception to the one-change rule for menu tiles: a short three-beat story (about 1.2 s, no loop), lead-approved.
- Figma rebuild: `node redesign/figma-export-v6.mjs`. Each picture has the variants Rest → Beat 1 → Beat 2 → Lit, chained with After delay 320 ms.

## V5 · Journey (built with all three updated skills)

- Page: `redesign/insureshield-nav-v5.html`
- Build: `node redesign/build-v5.mjs`
- Figma: page "InsureShield V5", flow "InsureShield V5 – Journey".
- Concept and spec files: `concepts/v5-spec.json` (momentum-sections), `v5-journey.json` and `v5-stops.json`.
- The mega menu works like parcel tracking: a tile matrix with one continuous strip; the parcel travels to the pointed stop.
- Checks: `check-section` 0 errors, cards 0 errors, `validate.mjs` 0 errors.
- The updated skills are unpacked in `../Updated Skill/unpacked/`.
- Coral and carrier colours now use the measured values from the updated momentum-iso-motion skill (all pages rebuilt).

## V4 (three new directions from the NAV research ticket)

- V4-A Worry → Relief: `redesign/insureshield-nav-relief.html`
- V4-B Doorstep moments: `redesign/insureshield-nav-doorstep.html`
- V4-C Ask-first (no illustration): `redesign/insureshield-nav-askfirst.html`

Every V4 page keeps all current links, regrouped by visitor task (`TASKS` in `page.template.html`). Urgent tasks come first, and Claims stays a top-level link. V2 and V3 pages keep the original grouping.

| Concept | Layout | Illustration | Motion |
|---|---|---|---|
| A · Worry → Relief | Feeling question, then task groups, then a 440 × 260 moment panel with Worry and Relief lines | 24 scenes (`RELIEF` in `scenes-v4.mjs`); coral = a real risk, grey = "not sure yet" | The scene draws, holds the worry for 550 ms (lifted 4 px, thin hatch), then resolves to teal and settles (320 ms, enter) |
| B · Doorstep moments | A storyboard of close-up frames (SC 01…) under task "act" labels; an overview card fills short menus | 19 cropped frames (`DOOR`, using the iso.js `crop`, `focus` and `zoom` options) | A pencil sketch at rest; on hover the frame fills with colour, the camera pushes in (1.08, slow, enter) and the moment plays |
| C · Ask-first | "What brings you here?" with task chips, a 2-column link list and a "Something went wrong?" strip | None | The chip fill glides; matching links slide to the front (FLIP, 320 ms, 34 ms apart) and the others dim |

- Concept cards: `concepts/v4-concepts.mjs` writes `v4-relief.json` and `v4-doorstep.json`, plus `.md` versions. All 43 cards: 0 errors, 0 warnings.
- New copy (the feeling questions, the Worry and Relief lines, and the chip labels) is proposed and needs approval.
- Figma: page "InsureShield V4", https://www.figma.com/design/q6QB351g0MeKGULGXyiJML/InsureShield---V2?node-id=10071-27796
  - Flows: "InsureShield V4 – Worry → Relief", "– Doorstep" and "– Ask-first".
- To rebuild the Figma SVGs: `node redesign/figma-export-v4.mjs`. A copy and the test screenshots are in `figma-export/v4-svg` and `figma-export/v4-screens`.
- Tests: `node redesign/v4test.cjs` (real mouse) and `node redesign/v4mobile.cjs` (mobile drawer and reduced motion). Both need playwright-core and Chrome.

## V3 (three Stage-based concepts, each with its own art and motion)

| Concept | Layout | Illustration | Motion |
|---|---|---|---|
| A · Panorama | Options left, a 560 × 280 window right | One isometric world per menu, one station per option (`PANO` in `scenes-v3.mjs`) | The camera travels to the hovered station and spotlights it; the overview zooms out (320 ms, standard) |
| B · Atelier | Numbered editorial list + a tall 320 × 400 drafting stage | An exploded view per option (`ATELIER`) | The parts assemble (320 ms, enter, 34 ms apart); a teal rule draws under the hovered row |
| C · Icon rail | A 44 px isometric icon on every option row + a feature card per menu | Icons (`ICON`) + feature art (`FEATURE`) | The hovered row's icon lifts and fills (200 ms); the feature card builds up when the menu opens |

- Concept cards: `concepts/v3-concepts.mjs` → `v3-panorama/atelier/rail.json` + `.md`. All 72 cards pass `check-card.mjs` with 0 errors and 0 warnings.
- To rebuild the Figma SVGs: `node redesign/figma-export-v3.mjs`. This writes `redesign/figma-export-v3/`.
- Figma: page "InsureShield V3", https://www.figma.com/design/q6QB351g0MeKGULGXyiJML/InsureShield---V2?node-id=10041-2
  - flows: "InsureShield V3 – Panorama", "– Atelier" and "– Icon rail"
- Editing note: on this PC, Windows PowerShell's `Get-Content` misreads UTF-8 (®, ·, ’ come out garbled). Edit files with an editor or Node, not with `Get-Content | Set-Content`.

Review links (add to the file URL):

- `?open=insurance&hover=2` opens a menu with an option hovered.
- `&still` shows the resting frame with no animation.

## Figma (page "InsureShield V2" in the InsureShield – V2 file)

- Page: https://www.figma.com/design/q6QB351g0MeKGULGXyiJML/InsureShield---V2?node-id=10035-2
- Prototype flows: "InsureShield V2 – Stage" and "InsureShield V2 – Diorama".
- To rebuild the Figma SVGs: `node redesign/figma-export.mjs`. This writes `redesign/figma-export/`. A copy of those SVGs and screenshots of both headers are in `figma-export/`.
- Component names follow Secure Commerce Designs: `Library/Nav illustration/<item>` with `State=Rest, Play, Active`, `Library/Diorama card/<item>` with `Rest, Hover`, then `Block/Mega menu Stage`, `Block/Mega menu Diorama`, `Block/Header Stage` and `Block/Header Diorama`.

## How the illustrations are made (v2, two skills)

1. **Concept** (momentum-concept skill): `redesign/concepts/nav-concepts.mjs` holds one concept card per illustration: 24 cards, one per menu option plus the 5 menu overviews. Each card has the message, the objects, the layout and the one change on hover. `concepts/nav-concepts.md` is the readable version.
2. **Drawing** (momentum-iso-motion skill): `redesign/scenes.mjs` draws each card with `iso.js`. The card's `scene` field names the builder.

Every picture rests as a pencil outline and fills with colour on hover. It then plays its one change, for example the parcel turns teal, the flag goes up, or the check appears. The change uses the 200 ms or 320 ms Momentum timings, with 34 ms steps between objects, and returns to rest in 550 ms. With reduced motion, the end state shows instantly.

## Folders

| Folder | What's in it |
|---|---|
| `redesign/` | The current version |
| `redesign/concepts/` | Concept cards (JSON + readable .md) |
| `redesign/art/stage`, `redesign/art/card` | SVGs that use the Momentum colour tokens (use these in code) |
| `redesign/art/figma` | SVGs with hex colours, for importing into Figma |
| `redesign/scenes.v1-before-concepts.mjs` | The previous illustrations, kept for reference |
| `design-files/` | Earlier work, including the v1 pages (`insureshield-nav-*.v1.html`) |
| `conversations/` | Saved Claude Code chats (.jsonl) |
| `../skills/momentum-iso-motion/`, `../skills/momentum-concept/` | The two skills, unpacked |

## Rebuild after editing

```
cd redesign
node concepts/nav-concepts.mjs
node ../../skills/momentum-concept/scripts/check-card.mjs concepts/nav-concepts.json --md > concepts/nav-concepts.md
node build.mjs
node ../../skills/momentum-iso-motion/scripts/validate.mjs insureshield-nav-stage.html insureshield-nav-diorama.html art/stage art/card
```

- To change an idea, edit its card in `concepts/nav-concepts.mjs` and re-run the check.
- To change a drawing, edit `scenes.mjs`.
- To change the page, layout or motion, edit `page.template.html`.
- `iso.js` is the skill's engine. The additions are marked `ext:`: scale, the hover change (`acts`), and routes on surfaces.

## Colours to confirm

Coral (the "something went wrong" mark) and the carrier stripes (UPS brown and gold, FedEx purple, DHL yellow, USPS blue) are placeholder values in `tokens.css`, marked CONFIRM. Get the real values from the Momentum library before production. Until then, the Figma exports for Multi-Carrier, UPS Shipments, CommerceShield and Customer Stories fail the checker's colour rule; the code versions pass.

Last check: concept cards 0 errors and 0 warnings; illustrations and pages 0 errors. The 36 warnings are all roofs, pin tips and route forks, which the skill allows.
