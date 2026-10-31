// Runs the plugin against a minimal fake Figma API to catch script errors before it reaches Figma.
const fs = require('fs'), path = require('path'), vm = require('vm');
let id = 0, reactions = 0, vars = [], instances = 0, comps = 0;
function node(type, extra = {}) {
  const n = {
    id: String(++id), type, name: type, children: [], width: 100, height: 100, x: 0, y: 0, fills: [], strokes: [], effects: [],
    absoluteTransform: [[1, 0, 0], [0, 1, 0]], pluginData: {},
    appendChild(c) { if (c.parent) c.parent.children.splice(c.parent.children.indexOf(c), 1); c.parent = this; this.children.push(c); },
    remove() { if (this.parent) this.parent.children.splice(this.parent.children.indexOf(this), 1); },
    resize(w, h) { if (!(w > 0) || !(h > 0)) throw new Error(`resize(${w},${h}) on ${this.name}`); this.width = w; this.height = h; },
    resizeWithoutConstraints(w, h) { this.resize(w, h); },
    rescale(k) { this.width *= k; this.height *= k; },
    findOne(fn) { for (const c of this.children) { if (fn(c)) return c; const r = c.findOne(fn); if (r) return r; } return null; },
    findAll(fn) { let o = []; for (const c of this.children) { if (fn(c)) o.push(c); o = o.concat(c.findAll(fn)); } return o; },
    createInstance() { if (this.type !== 'COMPONENT') throw new Error('createInstance on ' + this.type + ' ' + this.name); instances++; const i = node('INSTANCE'); i.mainComponent = this; i.name = this.name; i.width = this.width; i.height = this.height; return i; },
    setProperties(p) { for (const k of Object.keys(p)) if (p[k] === undefined) throw new Error('undefined prop ' + k); },
    async setReactionsAsync(r) { for (const x of r) for (const a of x.actions) { if (a.type === 'NODE' && !a.destinationId) throw new Error('no destination'); } reactions += r.length; },
    setBoundVariable(f, v) { if (!v || !v.id) throw new Error('bad variable for ' + f); },
    async setTextStyleIdAsync(i) { if (!i) throw new Error('no style id'); },
    async setEffectStyleIdAsync(i) { if (!i) throw new Error('no effect id'); },
    setRangeFills() {}, setRangeTextDecoration() {},
    addComponentProperty(name) { return name + '#' + (++id); },
    getPluginData(k) { return this.pluginData[k] || ''; }, setPluginData(k, v) { this.pluginData[k] = v; }
  };
  return Object.assign(n, extra);
}
const page = node('PAGE', { name: 'InsureShield V2', flowStartingPoints: [] });
const figma = {
  root: { children: [page] }, currentPage: page,
  async setCurrentPageAsync(p) { this.currentPage = p; },
  createPage() { const p = node('PAGE'); this.root.children.push(p); return p; },
  variables: {
    async getLocalVariableCollectionsAsync() { return []; },
    createVariableCollection(name) { return { id: 'c' + (++id), name, modes: [{ modeId: 'm' + id }], renameMode() {} }; },
    async getLocalVariablesAsync() { return vars; },
    createVariable(name, col, type) { if (typeof col !== 'object') throw new Error('collection'); const v = { id: 'v' + (++id), name, variableCollectionId: col.id, resolvedType: type, setValueForMode(m, val) { if (val === undefined) throw new Error('value ' + name); } }; vars.push(v); return v; },
    setBoundVariableForPaint(p, f, v) { if (!v) throw new Error('paint var'); return Object.assign({}, p, { boundVariables: { color: v.id } }); }
  },
  async loadFontAsync() {}, createTextStyle() { return { id: 's' + (++id) }; }, async getLocalTextStylesAsync() { return []; },
  createEffectStyle() { return { id: 'e' + (++id), effects: [] }; }, async getLocalEffectStylesAsync() { return []; },
  createFrame() { return node('FRAME'); }, createComponent() { comps++; return node('COMPONENT'); }, createText() { return node('TEXT', { characters: '' }); },
  createRectangle() { return node('RECTANGLE'); }, createSection() { return node('SECTION'); },
  createNodeFromSvg(svg) { if (!svg || !svg.startsWith('<svg')) throw new Error('bad svg'); const m = svg.match(/width="(\d+)" height="(\d+)"/); const n = node('FRAME'); if (m) { n.width = +m[1]; n.height = +m[2]; } return n; },
  createComponentFromNode(n) { comps++; n.type = 'COMPONENT'; return n; },
  createImage() { return { hash: 'h' }; }, base64Decode(s) { return Buffer.from(s, 'base64'); },
  combineAsVariants(cs, parent) { const s = node('COMPONENT_SET'); cs.forEach(c => s.appendChild(c)); parent.appendChild(s); return s; },
  notify() {}, viewport: { scrollAndZoomIntoView() {} },
  closePlugin(msg) { console.log('closePlugin:', msg); console.log({ components: comps, instances, reactions, variables: vars.length, topLevel: page.children.map(c => c.name) }); }
};
const code = fs.readFileSync(path.join(__dirname, 'InsureShield V2 Builder', 'code.js'), 'utf8');
vm.runInNewContext(code, { figma, console, Buffer, setTimeout });
