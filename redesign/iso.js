// iso.js — the Momentum / InsureShield isometric engine.
// One projection, one light, one stroke system. Every illustration built with this
// file lines up with the live shipping-insurance page and the Secure Commerce Figma file.
//
// World axes (right-handed, y up):
//   +x  → screen right-and-down at 17.5°   (the RIGHT face looks along +x; it is the lit face)
//   +z  → screen left-and-down at 17.5°    (the LEFT face looks along +z; it is the shade face)
//   +y  → screen up                         (the TOP face)
// Units: 1 world unit = 1 CSS px along an axis before foreshortening. Build objects in
// whole or half units on a 4-unit grid so edges land on clean coordinates.
//
// Works in the browser (ES module) and in Node (import { ... } from './iso.js').

// ---------------------------------------------------------------- projection
export const ANGLE_DEG = 17.5;                          // measured: 746 + 422 edges on the live page
const T = Math.tan((ANGLE_DEG * Math.PI) / 180);        // 0.31530
export const PITCH = Math.asin(T);                      // camera tilt ≈ 18.38°
const COS_P = Math.cos(PITCH);                          // vertical foreshortening ≈ 0.9490
const C = Math.SQRT1_2;                                 // yaw 45°
export const GROUND_ELLIPSE_RATIO = T;                  // a ground circle of radius r → ellipse rx=r, ry=r·0.3153
const CAM = [COS_P * C, Math.sin(PITCH), COS_P * C];    // unit vector from scene toward camera

// ext (InsureShield nav): screen scale. Geometry grows, but strokes (non-scaling) and the hatch
// pattern (user space) stay at true on-screen px, so one scene can ship at card and stage size.
let SCALE = 1;
export function setScale(k = 1) { SCALE = k; }

/** World [x,y,z] → screen [sx,sy] (y down). Orthographic: parallel lines never converge. */
export function project([x, y, z]) {
  return [(x - z) * C * SCALE, ((x + z) * C * T - y * COS_P) * SCALE];
}
/** Larger = nearer the viewer. Paint in ascending order (painter's algorithm). */
export function depth([x, y, z]) {
  return x * CAM[0] + y * CAM[1] + z * CAM[2];
}
/** Inverse for points on the ground plane (y = 0). */
export function unprojectGround([sx, sy]) {
  const a = sx / SCALE / C, b = sy / SCALE / (C * T);
  return [(a + b) / 2, 0, (b - a) / 2];
}

// ---------------------------------------------------------------- light
// Measured on the live illustrations: right faces lightest, left faces darkest, cast hatch
// falls to screen-left. The light travels along -x and down; elevation 45° (shadow length = height).
export const LIGHT_DIR = norm([-1, -1, 0]);      // direction light TRAVELS
export const SKY_HEIGHT = 160;                   // world units above ground where a cast shadow has fully dissolved

// ---------------------------------------------------------------- tokens
// Colour tokens used by the live site. Faces never use raw hex in shipped code; the hex is
// here for previews, Figma export (inline mode) and the validator.
export const TOKENS = {
  'teal-tint': '#e7f2f2', 'teal-light': '#9fcbcb', 'teal-strong': '#0a8080', 'teal-shade': '#075a5a',
  'blue-light': '#99c0e1', 'blue-strong': '#0662bb', 'blue-shade': '#064d93',
  'kraft-light': '#ddbf98', 'kraft-strong': '#c49a6c', 'kraft-shade': '#8f6a44',
  'chalk-light': '#fbfaf8', 'chalk-strong': '#eceae6', 'chalk-shade': '#cfccc6',
  'charcoal-strong': '#5f5753',
  'outline-default': '#85858e', 'outline-variant': '#b2b2bb',
  'surface-high': '#eceae9', 'surface-low': '#f0ede9', 'surface-lowest': '#fcfaf8',
  // coral + carrier stripes: values now measured in Figma (momentum-iso-motion update); confirm the names in Momentum
  'coral-light': '#f5ab99', 'coral-strong': '#e65533', 'coral-shade': '#b22101',   // Figma-measured (momentum-iso-motion update)
  'carrier-ups': '#330000', 'carrier-dhl-yellow': '#ffcc00', 'carrier-dhl-red': '#d40511',   // Figma-measured; USPS = blue-strong
  // V2-V4 only (not measured, kept so older art still builds): 
  'carrier-ups-gold': '#ffb500', 'carrier-fedex': '#4d148c', 'carrier-dhl': '#ffcc00', 'carrier-usps': '#33507a'
};
const VAR = {
  'outline-default': '--m-color-outline-default', 'outline-variant': '--m-color-outline-variant',
  'surface-high': '--m-color-surface-container-high', 'surface-low': '--m-color-surface-container-low',
  'surface-lowest': '--m-color-surface-container-lowest'
};
for (const k of Object.keys(TOKENS)) if (!VAR[k]) VAR[k] = /^(kraft|chalk|charcoal)/.test(k) ? `--m-graphic-material-${k}` : `--m-graphic-${k}`;

/**
 * Materials: which token goes on which face. Measured, not invented:
 * top = strong, right (+x, lit) = light, left (+z, shade) = shade, edge = shade, detail = light.
 * "neutral" is the grey family used for houses, doors, ground props (outline/surface tokens).
 */
export const MATERIALS = {
  teal:     { top: 'teal-strong',  right: 'teal-light',  left: 'teal-shade',  edge: 'teal-shade',      detail: 'teal-tint' },
  blue:     { top: 'blue-strong',  right: 'blue-light',  left: 'blue-shade',  edge: 'blue-shade',      detail: 'blue-light' },
  kraft:    { top: 'kraft-strong', right: 'kraft-light', left: 'kraft-shade', edge: 'kraft-shade',     detail: 'kraft-light' },
  chalk:    { top: 'chalk-strong', right: 'chalk-light', left: 'chalk-shade', edge: 'outline-default', detail: 'chalk-strong' },
  neutral:  { top: 'outline-variant', right: 'surface-high', left: 'outline-default', edge: 'outline-default', detail: 'surface-lowest' },
  ghost:    { top: 'surface-lowest', right: 'surface-lowest', left: 'surface-high', edge: 'outline-variant', detail: 'surface-lowest' },
  coral:    { top: 'coral-strong', right: 'coral-light', left: 'coral-shade', edge: 'coral-shade', detail: 'coral-light' },  // the one problem mark
  carrier:  { top: 'kraft-strong', right: 'kraft-light', left: 'kraft-shade', edge: 'kraft-shade', detail: 'kraft-light' }    // kraft parcel; stripes added as details
};

// Stroke system (on-screen px, kept constant with vector-effect="non-scaling-stroke")
export const STROKE = { edge: 1, seal: 0.6, detail: 0.6, ground: 1 };

// ---------------------------------------------------------------- vector helpers
function norm(v) { const l = Math.hypot(...v) || 1; return v.map((c) => c / l); }
const add = (a, b) => a.map((c, i) => c + b[i]);
const fmt = (n) => (Math.round(n * 100) / 100).toString();
const pts = (arr) => arr.map((p) => project(p)).map(([x, y]) => `${fmt(x)} ${fmt(y)}`);
const poly = (arr) => 'M' + pts(arr).join('L') + 'Z';

// ---------------------------------------------------------------- scene
/**
 * A scene collects drawables into the four illustration layers, sorts subjects back-to-front,
 * and writes one self-contained SVG.
 *   layer 0  ground   ground plates, grid, routes lying on the ground
 *   layer 10 shadow   hatch cast shadows
 *   layer 20 subject  objects (painter-sorted by depth)
 *   layer 30 overlay  labels, marks floating above everything in the illustration
 * (Page-level stacking is separate: use the Momentum z-index tokens for nav, popovers, modals.)
 */
export function scene(opts = {}) {
  const items = [];
  const api = {
    items,
    add(item) { items.push(item); return api; },
    box: (o) => api.add(box(o)),
    cylinder: (o) => api.add(cylinder(o)),
    prism: (o) => api.add(prism(o)),
    groundPlate: (o) => api.add(groundPlate(o)),
    route: (o) => api.add(route(o)),
    shadowOf: (obj, o) => api.add(hatchShadow(obj, o)),
    toSVG: (o = {}) => toSVG(items, { ...opts, ...o })
  };
  return api;
}

// ---------------------------------------------------------------- primitives
/**
 * Axis-aligned box. `at` = [x, y, z] of its min corner (y = altitude of its bottom).
 * `size` = [w (x), h (y), d (z)]. Only the three visible faces are emitted.
 */
export function box({ at = [0, 0, 0], size = [32, 32, 32], material = 'teal', name = 'box', details = [] }) {
  const [x, y, z] = at, [w, h, d] = size, M = MATERIALS[material] || material;
  const v = {
    a: [x, y, z], b: [x + w, y, z], c: [x + w, y, z + d], e: [x, y, z + d],
    A: [x, y + h, z], B: [x + w, y + h, z], Cc: [x + w, y + h, z + d], E: [x, y + h, z + d]
  };
  const faces = [
    { pts: [v.A, v.B, v.Cc, v.E], tone: M.top, side: 'top' },
    { pts: [v.b, v.c, v.Cc, v.B], tone: M.right, side: 'right' },
    { pts: [v.e, v.c, v.Cc, v.E], tone: M.left, side: 'left' }
  ];
  // Visible outline: silhouette hexagon + the three creases that meet at the near-top corner.
  const edges = [
    [v.A, v.B, v.b, v.c, v.e, v.E, v.A],   // silhouette
    [v.Cc, v.c], [v.Cc, v.B], [v.Cc, v.E]  // creases
  ];
  return {
    kind: 'object', name, layer: 20, depth: depth([x + w / 2, y + h / 2, z + d / 2]),
    bounds: { min: [x, y, z], max: [x + w, y + h, z + d] },
    footprint: [[x, z], [x + w, z], [x + w, z + d], [x, z + d]], base: y, height: h,
    faces, edges, edgeTone: M.edge, details
  };
}

/** Vertical cylinder (puck, coin, wheel hub laid flat, globe base). */
export function cylinder({ center = [0, 0, 0], r = 16, h = 8, material = 'teal', name = 'cylinder', segments = 48 }) {
  const M = MATERIALS[material] || material;
  const [cx, cy, cz] = center;
  const ring = (yy) => Array.from({ length: segments }, (_, i) => {
    const t = (i / segments) * Math.PI * 2; return [cx + r * Math.cos(t), yy, cz + r * Math.sin(t)];
  });
  const bottom = ring(cy), top = ring(cy + h);
  // Side silhouette: the two points where the ring is tangent to the view (t = -45° and 135°).
  const tan1 = (3 * Math.PI) / 4, tan2 = -Math.PI / 4;
  const sidePts = [];
  for (let i = 0; i <= 24; i++) { const t = tan2 + (i / 24) * (tan1 - tan2); sidePts.push([cx + r * Math.cos(t), cy, cz + r * Math.sin(t)]); }
  const side = [...sidePts, ...sidePts.slice().reverse().map(([a, , c]) => [a, cy + h, c])];
  // Split the side into the lit half (facing +x) and the shade half (facing +z) at t = 45°
  const split = (from, to) => { const p = []; for (let i = 0; i <= 12; i++) { const t = from + (i / 12) * (to - from); p.push([cx + r * Math.cos(t), cy, cz + r * Math.sin(t)]); } return [...p, ...p.slice().reverse().map(([a, , c]) => [a, cy + h, c])]; };
  return {
    kind: 'object', name, layer: 20, depth: depth([cx, cy + h / 2, cz]),
    bounds: { min: [cx - r, cy, cz - r], max: [cx + r, cy + h, cz + r] },
    footprint: bottom.map(([a, , c]) => [a, c]), base: cy, height: h,
    faces: [
      { pts: split(tan2, Math.PI / 4), tone: M.right, side: 'right' },
      { pts: split(Math.PI / 4, tan1), tone: M.left, side: 'left' },
      { pts: top, tone: M.top, side: 'top' }
    ],
    edges: [[...top, top[0]], sidePts, [sidePts[0], [sidePts[0][0], cy + h, sidePts[0][2]]], [sidePts[24], [sidePts[24][0], cy + h, sidePts[24][2]]]],
    edgeTone: M.edge, details: [], ellipse: { center: [cx, cy + h, cz], r }
  };
}

/**
 * Extruded outline on a vertical plane (shields, signs, document sheets, tags).
 * `outline` = 2D points [u, v] (u along the plane's horizontal axis, v up).
 * `plane` = 'z' puts the outline on the LEFT face plane (it faces +z, the viewer-left),
 *           'x' puts it on the RIGHT face plane (faces +x). `thickness` extrudes toward the viewer.
 * Front face tone follows the plane (x → light, z → shade). Emblems that must read as "the brand
 * object" (the coverage shield) override with frontTone: 'teal-strong', exactly as the live page does.
 * Keep the top edge of an outline FLAT (two points at the same v) so it runs along the 17.5° axis.
 */
export function prism({ outline, origin = [0, 0, 0], plane = 'z', thickness = 8, material = 'teal', name = 'prism', frontTone, sideTone }) {
  const M = MATERIALS[material] || material;
  const [ox, oy, oz] = origin;
  const to3 = ([u, v], t) => (plane === 'z' ? [ox + u, oy + v, oz + t] : [ox + t, oy + v, oz - u]);
  const back = outline.map((p) => to3(p, 0)), front = outline.map((p) => to3(p, thickness));
  const cu = outline.reduce((a, p) => a + p[0], 0) / outline.length, cv = outline.reduce((a, p) => a + p[1], 0) / outline.length;
  const sides = [];
  for (let i = 0; i < outline.length; i++) {
    const j = (i + 1) % outline.length;
    const du = outline[j][0] - outline[i][0], dv = outline[j][1] - outline[i][1];
    let n2 = [dv, -du];
    const mu = (outline[i][0] + outline[j][0]) / 2 - cu, mv = (outline[i][1] + outline[j][1]) / 2 - cv;
    if (n2[0] * mu + n2[1] * mv < 0) n2 = [-n2[0], -n2[1]];
    const n3 = plane === 'z' ? [n2[0], n2[1], 0] : [0, n2[1], -n2[0]];
    if (n3[0] * CAM[0] + n3[1] * CAM[1] + n3[2] * CAM[2] <= 1e-6) continue;
    const q = [back[i], back[j], front[j], front[i]];
    const up = n3[1] / Math.hypot(...n3) > 0.35; // roofs and slopes read as top surfaces
    sides.push({ pts: q, tone: sideTone || (up ? M.top : M.right), side: 'rim', d: depth(q[0].map((c, k) => (c + q[2][k]) / 2)) });
  }
  sides.sort((a, b) => a.d - b.d);
  const all3 = [...back, ...front], xs = all3.map((p) => p[0]), zs = all3.map((p) => p[2]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), z0 = Math.min(...zs), z1 = Math.max(...zs);
  const minV = Math.min(...outline.map((p) => p[1])), maxV = Math.max(...outline.map((p) => p[1]));
  return {
    kind: 'object', name, layer: 20, depth: depth([(x0 + x1) / 2, oy + (minV + maxV) / 2, (z0 + z1) / 2]),
    bounds: { min: [x0, oy + minV, z0], max: [x1, oy + maxV, z1] },
    footprint: [[x0, z0], [x1, z0], [x1, z1], [x0, z1]], base: oy + minV, height: maxV - minV,
    faces: [...sides, { pts: front, tone: frontTone || (plane === 'x' ? M.right : M.left), side: 'front' }],
    edges: [[...front, front[0]]], edgeTone: M.edge, details: []
  };
}

/** Circle lying on any axis plane → 4-arc Bézier path (exact affine image of a circle, 4 anchors). */
export function circlePath(center, r, plane = 'y') {
  const ax = plane === 'y' ? [[r, 0, 0], [0, 0, r]] : plane === 'x' ? [[0, 0, r], [0, r, 0]] : [[r, 0, 0], [0, r, 0]];
  const c = project(center);
  const u = project(add(center, ax[0])).map((v, i) => v - c[i]), w = project(add(center, ax[1])).map((v, i) => v - c[i]);
  const k = 0.5522847498;
  const P = (t) => [c[0] + u[0] * Math.cos(t) + w[0] * Math.sin(t), c[1] + u[1] * Math.cos(t) + w[1] * Math.sin(t)];
  const D = (t) => [-u[0] * Math.sin(t) + w[0] * Math.cos(t), -u[1] * Math.sin(t) + w[1] * Math.cos(t)];
  let d = `M${P(0).map(fmt).join(' ')}`;
  for (let i = 0; i < 4; i++) {
    const t0 = (i * Math.PI) / 2, t1 = t0 + Math.PI / 2, p0 = P(t0), p1 = P(t1), d0 = D(t0), d1 = D(t1);
    d += `C${fmt(p0[0] + k * d0[0])} ${fmt(p0[1] + k * d0[1])} ${fmt(p1[0] - k * d1[0])} ${fmt(p1[1] - k * d1[1])} ${fmt(p1[0])} ${fmt(p1[1])}`;
  }
  return d + 'Z';
}

/**
 * Ground plate: the drafting rectangle under a scene. Its four edges are separate lines that
 * run past every corner (measured overshoot ≈ 14–15 px on screen), 1 px, outline-variant.
 */
export function groundPlate({ min = [-80, -80], max = [80, 80], overshoot = 14, tone = 'outline-variant' }) {
  const [x0, z0] = min, [x1, z1] = max;
  const corners = [[x0, 0, z0], [x1, 0, z0], [x1, 0, z1], [x0, 0, z1]];
  const lines = [];
  for (let i = 0; i < 4; i++) {
    const a = corners[i], b = corners[(i + 1) % 4];
    const dir = norm(b.map((c, k) => c - a[k]));
    const o = project([0, 0, 0]), ext = overshoot / Math.hypot(...project(dir).map((v, k) => v - o[k]));
    lines.push([a.map((c, k) => c - dir[k] * ext), b.map((c, k) => c + dir[k] * ext)]);
  }
  return { kind: 'ground', layer: 0, lines, tone };
}

/**
 * Route: a dashed path lying ON the ground (e.g. parcel → shield → home). The live page draws
 * route dashes as thin filled ground-plane strips, not stroke-dasharray, so they foreshorten.
 * `points` = [[x, z], ...] waypoints; a smooth quadratic is fitted through them.
 */
export function route({ points, dash = 10, gap = 7, width = 1.6, tone = 'teal-strong', samples = 200, act, d0 = 0, y = 0, b }) {
  // ext: y = height of the surface the route lies on (0 = ground; a sheet's top for a drawn route)
  // ext: act = 'in' → the dashes appear one after another on hover (the route draws on), from d0
  // Catmull-Rom through waypoints
  const P = points.map(([x, z]) => [x, z]);
  const curve = [];
  for (let s = 0; s < P.length - 1; s++) {
    const p0 = P[Math.max(0, s - 1)], p1 = P[s], p2 = P[s + 1], p3 = P[Math.min(P.length - 1, s + 2)];
    for (let i = 0; i < samples / (P.length - 1); i++) {
      const t = i / (samples / (P.length - 1)), t2 = t * t, t3 = t2 * t;
      curve.push([0, 1].map((k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)));
    }
  }
  curve.push(P[P.length - 1]);
  // walk in world length, emit dash strips
  const strips = []; let acc = 0, on = true, cur = [curve[0]];
  for (let i = 1; i < curve.length; i++) {
    const seg = Math.hypot(curve[i][0] - curve[i - 1][0], curve[i][1] - curve[i - 1][1]);
    acc += seg; cur.push(curve[i]);
    if (acc >= (on ? dash : gap)) { if (on && cur.length > 1) strips.push(cur); cur = [curve[i]]; acc = 0; on = !on; }
  }
  const quads = strips.map((s) => {
    const a = s[0], b = s[s.length - 1], dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz) || 1;
    const nx = (-dz / L) * width / 2, nz = (dx / L) * width / 2;
    const left = s.map(([x, z]) => [x + nx, y, z + nz]), right = s.map(([x, z]) => [x - nx, y, z - nz]).reverse();
    return [...left, ...right];
  });
  return { kind: 'route', layer: 0, quads, tone, act, d0, b };
}
/** ext: a route painted ON an object's face (pass as one of its details), e.g. a path drawn on a sheet. */
export function routeDetail(o) {
  const r = route(o);
  return { svg: (col) => r.quads.map((q, k) => `<path d="${poly(q)}" fill="${col(r.tone)}" stroke="${col(r.tone)}" stroke-width="${STROKE.seal}" stroke-linejoin="round" vector-effect="non-scaling-stroke"${r.act ? ` data-act="in" style="--d:${fmt(r.d0 + k * 0.4)}${r.b != null ? `;--b:${r.b}` : ''}"` : ''}/>`).join('') };
}

/**
 * Hatch cast shadow for an object (the only shadow this style allows — no blur, no grey fills).
 * Footprint + light-projected copy of the top outline, hatch-filled at 1 px lines every 3 px,
 * lines parallel to the 17.5° axis. As the object rises (`base` > 0) the hatch thins and fades;
 * at SKY_HEIGHT it is gone. Self-shading (face tones) always stays.
 */
export function hatchShadow(obj, { light = LIGHT_DIR } = {}) {
  if (obj.base >= SKY_HEIGHT) return { kind: 'none', layer: 10 };
  const k = -1 / light[1];
  const shift = (h) => [light[0] * k * h, light[2] * k * h];
  const fp = obj.footprint;
  const lo = fp.map(([x, z]) => { const s = shift(obj.base); return [x + s[0], z + s[1]]; });
  const hi = fp.map(([x, z]) => { const s = shift(obj.base + obj.height); return [x + s[0], z + s[1]]; });
  const hull = convexHull([...lo, ...hi]);
  const lift = obj.base / SKY_HEIGHT;            // 0 on the ground → 1 at the sky
  return {
    kind: 'shadow', layer: 10, pts: hull.map(([x, z]) => [x, 0, z]), for: obj.name,   // ext: link to its object
    lineWidth: +(1 - 0.6 * lift).toFixed(2),    // 1 px → 0.4 px
    opacity: +(1 - 0.85 * lift).toFixed(2)      // contact = full strength, high = faint
  };
}

function convexHull(p) {
  const s = p.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of s) { while (lo.length > 1 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of s.slice().reverse()) { while (up.length > 1 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}

// ---------------------------------------------------------------- paint order
/**
 * Painter's order for objects. Centre depth alone fails for stacked or long thin boxes (a chassis
 * under a cargo box would paint on top of it). Rule: A paints before B when A lies entirely
 * behind B on some axis — A.max.x <= B.min.x, A.max.z <= B.min.z (further from the viewer) or
 * A.max.y <= B.min.y (below). Unrelated pairs fall back to centre depth. Topological sort.
 */
export function paintOrder(list) {
  const eps = 1e-6, n = list.length;
  const before = (A, B) => {
    if (!A.b || !B.b) return null;
    const a = A.b, b = B.b;
    if (a.max[0] <= b.min[0] + eps || a.max[2] <= b.min[2] + eps || a.max[1] <= b.min[1] + eps) return true;
    if (b.max[0] <= a.min[0] + eps || b.max[2] <= a.min[2] + eps || b.max[1] <= a.min[1] + eps) return false;
    return null;
  };
  const byDepth = list.map((x, i) => i).sort((i, j) => list[i].d - list[j].d);
  const edges = Array.from({ length: n }, () => []), indeg = new Array(n).fill(0);
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const r = before(list[i], list[j]);
    if (r === true) { edges[i].push(j); indeg[j]++; } else if (r === false) { edges[j].push(i); indeg[i]++; }
  }
  const out = [], ready = byDepth.filter((i) => indeg[i] === 0);
  while (ready.length) {
    ready.sort((i, j) => list[i].d - list[j].d);
    const i = ready.shift(); out.push(list[i]);
    for (const j of edges[i]) if (--indeg[j] === 0) ready.push(j);
  }
  if (out.length < n) for (const i of byDepth) if (!out.includes(list[i])) out.push(list[i]); // cycle fallback
  return out;
}

// ---------------------------------------------------------------- output
/**
 * toSVG(items, { width, height, padding, inline, title, id, idPrefix })
 *   inline: true → raw hex instead of CSS variables (use for Figma import; Figma ignores CSS vars)
 * Output contract (what validate.mjs checks):
 *   - fluid viewBox, no fixed px size unless width/height passed
 *   - every stroke 1 px or 0.6 px with vector-effect="non-scaling-stroke"
 *   - faces filled with a token AND sealed with a 0.6 px stroke of the same token (closes AA seams)
 *   - edges are open/closed paths in the material's edge token, 1 px, round caps and joins
 *   - hatch = <pattern> rotated -17.5°, line:period = 1:3
 */
// ext: the state change. spec = 'in' | 'out' | { act: 'in' | 'out' | 'move' | 'in move', from: [x,y,z], d, slow }
//   in   = hidden at rest, appears on hover        out  = shown at rest, gone on hover (crossfades)
//   move = displaced by `from` (world units) at rest, travels home on hover
//   d    = order in the stagger (× 34 ms)           slow = 320 ms instead of 200 ms (rises, drops)
export function actAttrs(spec) {
  if (!spec) return { attr: '', style: '' };
  const o = typeof spec === 'string' ? { act: spec } : spec;
  // ext (V6): b = story beat (0, 1, 2 …). The object takes its colour and plays its change on that beat.
  // A spec with only b (no act / from / d) sets the beat without any state change.
  // ab = the beat the change plays on, when it differs from the colour beat (a coral mark lit on beat 0, resolved on beat 1)
  let style = (o.b != null ? `--b:${o.b};` : '') + (o.ab != null ? `--ab:${o.ab};` : '');
  if (o.b != null && !o.act && !o.from && o.d == null) return { attr: '', style };
  const acts = o.act || (o.from ? 'move' : 'in');
  if (o.from) { const a = project(o.from), z = project([0, 0, 0]); style += `--ax:${fmt(a[0] - z[0])}px;--ay:${fmt(a[1] - z[1])}px;`; }
  if (o.d) style += `--d:${o.d};`;
  return { attr: ` data-act="${acts}${o.slow ? ' slow' : ''}"`, style };
}
/** Wrap face details so they change state on their own (a check appearing, tape sealing, a flag raising). */
export function actG(spec, ...details) {
  const { attr, style } = actAttrs(spec);
  return { svg: (col) => `<g${attr}${style ? ` style="${style}"` : ''}>${details.map((d) => d.svg(col)).join('')}</g>` };
}

export function toSVG(items, { width, height, padding = 12, inline = false, title, idPrefix = 'iso', frame, hero, drop = [], acts = {}, shift = 0, crop = false, focus = [0, 0] } = {}) {
  // ext: crop = keep the viewBox exactly frame-sized even when the art is bigger (close-up framing; the
  //      slot clips it). focus = [dx, dy] px to move the framing centre off the art's centre.
  // ext: shift = px the art sits lower inside the frame (headroom for exploded parts above it)
  // ext: drop = object names that settle into place, in order, 34 ms apart (stacking choreography).
  // ext: frame = [W, H] → fixed viewBox centred on the art (1 user unit = 1 px in a W×H slot);
  //      hero  = object name that lifts in the Filled phase (gets data-hero; its hatch gets data-hero too).
  const col = (t) => (inline ? TOKENS[t] || t : `var(${VAR[t] || t})`);
  const NS = 'vector-effect="non-scaling-stroke"';
  const layers = { 0: [], 10: [], 20: [], 30: [] };
  const defs = [];
  let hatchN = 0;
  const all = [];
  for (const it of items) {
    if (it.kind === 'ground') {
      for (const [a, b] of it.lines) { all.push(project(a), project(b)); layers[0].push(`<path d="M${pts([a, b]).join('L')}" fill="none" stroke="${col(it.tone)}" stroke-width="${STROKE.ground}" ${NS}/>`); }
    } else if (it.kind === 'route') {
      it.quads.forEach((q, k) => { q.forEach((p) => all.push(project(p)));
        const a = it.act ? ` data-act="in" style="--d:${fmt(it.d0 + k * 0.4)}${it.b != null ? `;--b:${it.b}` : ''}"` : '';
        layers[0].push(`<path d="${poly(q)}" fill="${col(it.tone)}" stroke="${col(it.tone)}" stroke-width="${STROKE.seal}" stroke-linejoin="round" ${NS}${a}/>`); });
    } else if (it.kind === 'shadow') {
      const id = `${idPrefix}-hatch-${hatchN++}`;
      // pattern in screen space: 1 px line every 3 px (scaled by lineWidth), rotated to the 17.5° axis
      const period = 3, line = it.lineWidth;
      defs.push(`<pattern id="${id}" patternUnits="userSpaceOnUse" width="24" height="${period}" patternTransform="rotate(-${ANGLE_DEG})"><rect width="24" height="${line}" fill="${col('outline-default')}"/></pattern>`);
      it.pts.forEach((p) => all.push(project(p)));
      // a shadow fades with its object (in/out), but never travels: it stays on the ground
      const sp = acts[it.for] && (typeof acts[it.for] === 'string' ? { act: acts[it.for] } : acts[it.for]);
      // a beat-only spec ({ b }) colours the object but changes nothing: its shadow gets no act
      const sk = sp && !(sp.b != null && !sp.act && !sp.from && sp.d == null) && ((sp.act || (sp.from ? 'move' : 'in')).match(/\b(in|out)\b/) || [])[1];
      const sSt = sp ? `${sp.d ? `--d:${sp.d};` : ''}${sp.b != null ? `--b:${sp.b};` : ''}` : '';
      const sAct = (sk ? ` data-act="${sk}"` : '') + (sSt ? ` style="${sSt}"` : '');
      layers[10].push(`<path d="${poly(it.pts)}" fill="url(#${id})" opacity="${it.opacity}" data-shadow="hatch" data-thin="${+(1 - it.lineWidth).toFixed(2)}"${it.for ? ` data-for="${it.for}"` : ''}${hero && it.for === hero ? ' data-hero=""' : ''}${sAct}/>`);
    } else if (it.kind === 'object') {
      const g = [];
      for (const f of it.faces) {
        f.pts.forEach((p) => all.push(project(p)));
        g.push(`<path d="${poly(f.pts)}" fill="${col(f.tone)}" stroke="${col(f.tone)}" stroke-width="${STROKE.seal}" stroke-linejoin="round" ${NS} data-face="${f.side}"/>`);
      }
      for (const dtl of it.details || []) g.push(dtl.svg ? dtl.svg(col) : '');
      for (const e of it.edges) {
        const closed = e.length > 2 && e[0] === e[e.length - 1];
        g.push(`<path d="M${pts(closed ? e.slice(0, -1) : e).join('L')}${closed ? 'Z' : ''}" fill="none" stroke="${col(it.edgeTone)}" stroke-width="${STROKE.edge}" stroke-linecap="round" stroke-linejoin="round" ${NS}/>`);
      }
      layers[20].push({ d: it.depth, b: it.bounds, name: it.name, inner: g.join('') });
    }
  }
  // ext: paint order index → --i (34 ms draw-on stagger), hero flag
  layers[20] = paintOrder(layers[20]).map((l, i) => { const A = actAttrs(acts[l.name]);
    return { ...l, svg: `<g data-object="${l.name}" style="--i:${i + 1};${drop.includes(l.name) ? `--d:${drop.indexOf(l.name)};` : ''}${A.style}"${l.name === hero ? ' data-hero=""' : ''}${drop.includes(l.name) ? ' data-drop=""' : ''}${A.attr}>${l.inner}</g>` }; });
  const xs = all.map((p) => p[0]), ys = all.map((p) => p[1]);
  let minX = Math.min(...xs) - padding, minY = Math.min(...ys) - padding;
  let W = Math.max(...xs) - Math.min(...xs) + padding * 2, H = Math.max(...ys) - Math.min(...ys) + padding * 2;
  if (frame) {
    const cx = minX + W / 2 + focus[0], cy = minY + H / 2 - shift + focus[1], k = crop ? 1 : Math.max(1, W / frame[0], (H + 2 * shift) / frame[1]);
    W = frame[0] * k; H = frame[1] * k; minX = cx - W / 2; minY = cy - H / 2;
  }
  const size = width ? ` width="${width}" height="${height || Math.round((width * H) / W)}"` : '';
  const a11y = title ? `role="img" aria-label="${title.replace(/"/g, '&quot;')}"` : 'aria-hidden="true" focusable="false"';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${fmt(minX)} ${fmt(minY)} ${fmt(W)} ${fmt(H)}"${size} ${a11y} data-iso="${ANGLE_DEG}" data-objects="${layers[20].length}">` +
    (defs.length ? `<defs>${defs.join('')}</defs>` : '') +
    `<g data-layer="0">${layers[0].join('')}</g>` +
    `<g data-layer="10">${layers[10].join('')}</g>` +
    `<g data-layer="20">${layers[20].map((l) => l.svg).join('')}</g>` +
    `<g data-layer="30">${layers[30].join('')}</g></svg>`;
}

// ---------------------------------------------------------------- face details
/**
 * Detail helpers: draw on a face plane (labels, tape, check marks). They inherit the 0.6 px
 * detail weight. `plane` 'x' = right face at x = const, 'z' = left face at z = const, 'y' = top.
 */
export function faceRect({ plane, at, u, v, w, h, tone }) {
  const P = plane === 'x' ? [[at, v, u], [at, v, u + w], [at, v + h, u + w], [at, v + h, u]]
    : plane === 'z' ? [[u, v, at], [u + w, v, at], [u + w, v + h, at], [u, v + h, at]]
      : [[u, at, v], [u + w, at, v], [u + w, at, v + h], [u, at, v + h]];
  return { svg: (col) => `<path d="${poly(P)}" fill="${col(tone)}" stroke="${col(tone)}" stroke-width="${STROKE.detail}" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>` };
}
export function faceLine({ plane, at, from, to, tone, width = STROKE.detail }) {
  const P3 = ([u, v]) => (plane === 'x' ? [at, v, u] : plane === 'z' ? [u, v, at] : [u, at, v]);
  return { svg: (col) => `<path d="M${pts([P3(from), P3(to)]).join('L')}" fill="none" stroke="${col(tone)}" stroke-width="${width}" stroke-linecap="round" vector-effect="non-scaling-stroke"/>` };
}

/**
 * A solid stroke painted ON a face plane (check marks, ticks, arrows on emblems). Built as a
 * filled ribbon in world units so it foreshortens with the face, like the live check mark.
 * `points` are [u, v] in the plane; `w` is the ribbon width in world units (live check ≈ 6).
 */
export function faceRibbon({ plane, at, points, w = 6, tone = 'teal-tint' }) {
  const P3 = ([u, v]) => (plane === 'x' ? [at, v, -u] : plane === 'z' ? [u, v, at] : [u, at, v]);
  const left = [], right = [];
  for (let i = 0; i < points.length; i++) {
    const a = points[Math.max(0, i - 1)], b = points[Math.min(points.length - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    const n = [(-dy / L) * w / 2, (dx / L) * w / 2];
    left.push([points[i][0] + n[0], points[i][1] + n[1]]); right.push([points[i][0] - n[0], points[i][1] - n[1]]);
  }
  const ring = [...left, ...right.reverse()].map(P3);
  return { svg: (col) => `<path d="${poly(ring)}" fill="${col(tone)}" stroke="${col(tone)}" stroke-width="${STROKE.detail}" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>` };
}

/**
 * Wheel / disc standing on a side face (truck wheels, coins on edge, gauges on a wall).
 * A circle on a vertical plane is NEVER a screen circle: it is the projected ellipse from
 * circlePath(). The wheel's centre sits at height r so the tyre touches the ground (y = 0).
 *   axis 'z' → wheel on the LEFT face (axle along z), axis 'x' → on the RIGHT face.
 *   `at` = [x, z] of the centre on the ground plan, `outer` = the plane coordinate of the visible side.
 */
export function wheel({ at = [0, 0], r = 12, axis = 'z', width = 6, outer, tyre = 'charcoal-strong', hub = 'chalk-shade', edge = 'outline-default', name = 'wheel' }) {
  const [ax, az] = at;
  const out = outer ?? (axis === 'z' ? az : ax);
  const plane = axis === 'z' ? 'z' : 'x';
  const c = (off, y = r) => (axis === 'z' ? [ax, y, out - off] : [out - off, y, az]);
  const front = circlePath(c(0), r, plane), back = circlePath(c(width), r, plane), hubP = circlePath(c(-0.01), r * 0.45, plane);
  return {
    kind: 'object', name, layer: 20, depth: depth(c(width / 2)),
    // sort by the visible outer disc only, so a wheel set into a body still paints in front of it
    bounds: axis === 'z' ? { min: [ax - r, 0, out - 0.5], max: [ax + r, 2 * r, out] } : { min: [out - 0.5, 0, az - r], max: [out, 2 * r, az + r] },
    footprint: axis === 'z' ? [[ax - r, out - width], [ax + r, out - width], [ax + r, out], [ax - r, out]] : [[out - width, az - r], [out, az - r], [out, az + r], [out - width, az + r]],
    base: 0, height: 2 * r,
    faces: [], edges: [],
    details: [{ svg: (col) =>
      `<path d="${back}" fill="${col(tyre)}" stroke="${col(edge)}" stroke-width="1" vector-effect="non-scaling-stroke"/>` +
      `<path d="${front}" fill="${col(tyre)}" stroke="${col(edge)}" stroke-width="1" vector-effect="non-scaling-stroke"/>` +
      `<path d="${hubP}" fill="${col(hub)}" stroke="${col(hub)}" stroke-width="0.6" vector-effect="non-scaling-stroke"/>` }]
  };
}
