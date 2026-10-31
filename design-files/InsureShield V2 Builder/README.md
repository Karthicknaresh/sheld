# InsureShield V2 Builder (Figma plugin)

Builds the **Stage** and **Diorama** header concepts on the **InsureShield V2** page.

## Run it (Figma desktop app)

1. Open the file that contains the **InsureShield V2** page (in the InsureShield redesign project).
2. Menu > **Plugins > Development > Import plugin from manifest…**
3. Choose `manifest.json` in this folder.
4. Menu > **Plugins > Development > InsureShield V2 Builder**.
5. Wait for the "built" message (about a minute). Run it again any time: it replaces only what it created before.

If the file has no page called exactly `InsureShield V2`, the plugin creates one.

## What it creates

Sections are placed to the right of anything already on the page. Nothing else is touched.

| Section | Contents |
|---|---|
| Pages | `Shipping Insurance – Stage – Desktop 1440`, `Shipping Insurance – Diorama – Desktop 1440` (prototype flows start here) |
| Foundations | Logo, Button (Type × Size), Nav item (State), Menu link (State), Utility bar, patterns, icons |
| Illustrations | 20 vector component sets, `State = Outline / Drawn / Filled` |
| Diorama cards | One card set per menu option, `State = Outline / Active` |
| Mega menus | `Mega menu / Stage` (Menu × Item, 22 variants), `Mega menu / Diorama` (Menu, 5 variants) |
| Header & hero | `Header / Stage`, `Header / Diorama` (`Menu = Closed` + 5 menus), `Hero / Shipping insurance` |

Variables: **Momentum / InsureShield** (colours, spacing, radius), **Motion** (durations, delays, easing), **Nav state** (`nav/open-menu`, `nav/hovered-option`, `nav/is-open`, `nav/concept`).
Text styles `Momentum/…` and effect styles `Momentum/Shadow 3–5`.

## Interactions

- Nav item **mouse enter** → header variant for that menu (Smart animate, 320 ms, cubic-bezier 0.2, 0, 0, 1) and **sets** `nav/open-menu`, `nav/is-open`.
- Header **mouse leave** (240 ms delay) → `Menu = Closed`.
- Stage options **mouse enter** (70 ms intent) → `Item` variant, sets `nav/hovered-option`.
- Diorama card **while hovering** → `Active`.
- Illustration `Drawn` **after 300 ms** → `Filled` (Smart animate 600 ms), which replays the build.

Note: Figma can't bind transition durations to variables, so the Motion variables document the timings for handoff.
