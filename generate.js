const pptxgen = require('pptxgenjs');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'GitHub Copilot';
pptx.company = 'Microsoft';
pptx.subject = 'Microsoft Foundry enterprise AI reference architecture';
pptx.title = 'Microsoft Foundry: From Models to Agents to Enterprise AI';
pptx.lang = 'en-US';
pptx.theme = {
  headFontFace: 'Aptos Display',
  bodyFontFace: 'Aptos',
  lang: 'en-US'
};
pptx.defineLayout({ name: 'CUSTOM_WIDE', width: 13.333, height: 7.5 });
pptx.layout = 'CUSTOM_WIDE';
pptx.margin = 0;

const C = {
  bg: 'F7F9FC', paper: 'FFFFFF', ink: '172033', muted: '657084', hair: 'BCC6D4',
  pale: 'E9EEF5', pale2: 'DCE5EF', azure: '0078D4', cyan: '00B7C3', purple: '6B4EFF',
  violet: '8B5CF6', teal: '0F8B8D', green: '39A96B', red: 'D83B3E', amber: 'C78600'
};

const makeShadow = (opacity = 0.15, blur = 7, offset = 2) => ({
  type: 'outer', color: '68758A', opacity, blur, offset, angle: 45
});
const nm = (name) => ({ objectName: name, name });
const T = (slide, text, name, o) => slide.addText(text, { fontFace: 'Aptos', margin: 0, ...nm(name), ...o });
const S = (slide, type, name, o) => slide.addShape(type, { ...nm(name), ...o });
const L = (slide, name, x, y, w, h, color = C.hair, dash = 'solid', width = 0.8, transparency = 0) =>
  S(slide, pptx.ShapeType.line, name, { x, y, w, h, line: { color, width, dashType: dash, transparency } });

const planes = {
  experiences: { order: 6, y: 1.50, label: 'AI EXPERIENCES', accent: C.azure },
  agents: { order: 5, y: 2.38, label: 'MICROSOFT FOUNDRY\nAGENT SERVICE', accent: C.purple },
  models: { order: 4, y: 3.38, label: 'MODELS & KNOWLEDGE', accent: C.cyan },
  operations: { order: 3, y: 4.40, label: 'QUALITY & OPERATIONS', accent: C.teal },
  governance: { order: 2, y: 5.36, label: 'GOVERNANCE &\nCONTROL PLANE', accent: C.ink },
  azure: { order: 1, y: 6.28, label: 'AZURE FOUNDATION', accent: C.azure }
};
const x0 = 3.55;
const planeW = 8.55;
const planeH = 0.48;
const skew = 0.58;

const slideSpecs = [
  { headline: 'Built on Azure', reveal: 1, focus: 'azure' },
  { headline: 'Govern enterprise AI from the foundation', reveal: 2, focus: 'governance' },
  { headline: 'Bring intelligence and enterprise context together', reveal: 4, focus: 'models', hideOps: true },
  { headline: 'Evaluate, observe and continuously improve', reveal: 4, focus: 'operations' },
  { headline: 'Turn intelligence into autonomous action', reveal: 5, focus: 'agents' },
  { headline: 'Bring agents into every experience', reveal: 6, focus: 'experiences' },
  { headline: 'Microsoft Foundry', subhead: 'From Models to Agents to Enterprise AI', reveal: 6, focus: 'all', final: true }
];

function isVisible(key, spec) {
  if (key === 'operations' && spec.hideOps) return false;
  return planes[key].order <= spec.reveal;
}
function layerY(key, spec) {
  if (isVisible(key, spec)) return planes[key].y;
  return 6.72 + (6 - planes[key].order) * 0.015;
}
function alpha(key, spec) { return isVisible(key, spec) ? 0 : 100; }
function textColor(key, spec, color = C.ink) { return isVisible(key, spec) ? color : C.bg; }

function addHeader(slide, spec, index) {
  T(slide, 'Microsoft Foundry', '00_Brand', { x: 0.65, y: 0.24, w: 2.2, h: 0.22, fontSize: 12, bold: true, color: C.ink });
  T(slide, 'THE AI APP AND AGENT FACTORY', '00_BrandSubtitle', { x: 2.22, y: 0.255, w: 2.5, h: 0.18, fontSize: 7.5, bold: true, charSpacing: 1.2, color: C.muted });
  T(slide, spec.headline, '00_Headline', { x: 0.65, y: 0.70, w: 11.9, h: spec.final ? 0.52 : 0.46, fontSize: spec.final ? 30 : 25, bold: true, color: C.ink, breakLine: false, fit: 'shrink' });
  if (spec.subhead) T(slide, spec.subhead, '00_Subhead', { x: 0.66, y: 1.23, w: 6.0, h: 0.28, fontSize: 14, color: C.muted });
  T(slide, String(index + 1).padStart(2, '0'), '00_SlideNumber', { x: 12.15, y: 0.27, w: 0.48, h: 0.18, align: 'right', fontSize: 8, bold: true, color: C.muted });
}

function addPlane(slide, key, spec) {
  const p = planes[key];
  const y = layerY(key, spec);
  const tr = alpha(key, spec);
  const active = spec.focus === key || spec.focus === 'all';
  const planeFill = key === 'agents' && active ? 'F2EFFF' : key === 'azure' ? 'F4F9FD' : C.paper;
  S(slide, pptx.ShapeType.parallelogram, `${String(p.order).padStart(2, '0')}_${key}_Shadow`, {
    x: x0 + 0.10, y: y + 0.11, w: planeW, h: planeH,
    fill: { color: '8C99AB', transparency: Math.min(100, tr + 82) }, line: { color: '8C99AB', transparency: 100 }
  });
  S(slide, pptx.ShapeType.parallelogram, `${String(p.order).padStart(2, '0')}_${key}_Plane`, {
    x: x0, y, w: planeW, h: planeH,
    fill: { color: planeFill, transparency: tr },
    line: { color: active ? p.accent : C.hair, width: active ? 1.4 : 0.8, transparency: tr },
    shadow: tr === 0 ? makeShadow(active ? 0.18 : 0.10, active ? 8 : 5, 1.5) : undefined
  });
  S(slide, pptx.ShapeType.parallelogram, `${String(p.order).padStart(2, '0')}_${key}_Edge`, {
    x: x0 + 0.06, y: y + planeH - 0.03, w: planeW - 0.04, h: 0.12,
    fill: { color: active ? p.accent : C.pale2, transparency: tr + (active ? 12 : 0) },
    line: { color: active ? p.accent : C.hair, width: 0.5, transparency: tr }
  });
  L(slide, `${String(p.order).padStart(2, '0')}_${key}_Leader`, 2.78, y + 0.22, 0.72, 0, p.accent, 'solid', 0.8, tr);
  T(slide, p.label, `${String(p.order).padStart(2, '0')}_${key}_Label`, {
    x: 0.66, y: y + 0.08, w: 2.05, h: key === 'agents' || key === 'governance' ? 0.34 : 0.18,
    fontSize: key === 'agents' && active ? 11 : 8.5, bold: true, charSpacing: 0.8,
    color: textColor(key, spec, active ? p.accent : C.ink), valign: 'mid', fit: 'shrink'
  });
}

function addGrid(slide, key, spec) {
  const y = layerY(key, spec);
  const tr = alpha(key, spec);
  for (let i = 0; i < 8; i++) L(slide, `${planes[key].order}_${key}_GridV_${i}`, x0 + 0.60 + i * 0.90, y + 0.10, skew * 0.26, 0.27, C.pale2, 'solid', 0.35, tr + 20);
  for (let i = 0; i < 3; i++) L(slide, `${planes[key].order}_${key}_GridH_${i}`, x0 + 0.45 + i * 0.16, y + 0.13 + i * 0.10, 7.15, 0, C.pale2, 'solid', 0.35, tr + 20);
}

function module(slide, key, spec, id, x, yOffset, w, label, color, shape = pptx.ShapeType.rect) {
  const y = layerY(key, spec) + yOffset;
  const tr = alpha(key, spec);
  S(slide, shape, `${planes[key].order}_${key}_${id}_Node`, {
    x, y, w, h: 0.18, fill: { color: 'FFFFFF', transparency: tr },
    line: { color, width: 0.8, transparency: tr }, shadow: tr === 0 ? makeShadow(0.10, 3, 1) : undefined
  });
  T(slide, label, `${planes[key].order}_${key}_${id}_Text`, {
    x: x - 0.08, y: y + 0.22, w: w + 0.16, h: 0.18, align: 'center', fontSize: 6.3, bold: true,
    color: textColor(key, spec, C.ink), fit: 'shrink'
  });
}

function addAzure(slide, spec) {
  const key = 'azure'; addGrid(slide, key, spec);
  const y = layerY(key, spec); const tr = alpha(key, spec);
  const items = [
    ['Compute', 4.20, 0.32, 0.46, 'COMPUTE', C.azure], ['Storage', 5.35, 0.27, 0.52, 'STORAGE', C.cyan],
    ['Network', 6.57, 0.31, 0.42, 'NETWORK', C.azure], ['Private', 7.62, 0.25, 0.48, 'PRIVATE LINK', C.ink],
    ['Vault', 8.78, 0.30, 0.42, 'KEY VAULT', C.amber], ['Monitor', 9.84, 0.26, 0.52, 'MONITOR', C.teal]
  ];
  items.forEach(([id, x, yo, w, label, color]) => module(slide, key, spec, id, x, yo, w, label, color));
  S(slide, pptx.ShapeType.hexagon, '1_azure_Azure_Node', { x: 11.02, y: y + 0.20, w: 0.52, h: 0.45, fill: { color: C.azure, transparency: tr }, line: { color: C.azure, transparency: tr } });
  T(slide, 'AZURE', '1_azure_Azure_Text', { x: 10.84, y: y + 0.69, w: 0.88, h: 0.16, align: 'center', fontSize: 6.6, bold: true, color: textColor(key, spec, C.azure) });
}

function addGovernance(slide, spec) {
  const key = 'governance'; addGrid(slide, key, spec);
  const y = layerY(key, spec); const tr = alpha(key, spec);
  L(slide, '2_governance_Spine', 4.05, y + 0.27, 7.32, 0, C.ink, 'solid', 1.1, tr);
  const nodes = [
    ['Entra', 4.12, 'ENTRA ID', C.azure], ['RBAC', 5.10, 'RBAC', C.ink], ['Policy', 6.02, 'POLICY', C.ink],
    ['Purview', 6.98, 'PURVIEW', C.cyan], ['Defender', 8.00, 'DEFENDER', C.green], ['Safety', 9.05, 'CONTENT SAFETY', C.purple],
    ['Isolation', 10.23, 'ISOLATION', C.ink], ['Guardrails', 11.24, 'GUARDRAILS', C.ink]
  ];
  nodes.forEach(([id, x, label, color], i) => {
    S(slide, i % 2 ? pptx.ShapeType.diamond : pptx.ShapeType.hexagon, `2_governance_${id}_Node`, { x, y: y + 0.12, w: 0.27, h: 0.27, fill: { color: C.paper, transparency: tr }, line: { color, width: 1, transparency: tr } });
    T(slide, label, `2_governance_${id}_Text`, { x: x - 0.18, y: y + 0.44, w: 0.64, h: 0.15, align: 'center', fontSize: 5.7, bold: true, color: textColor(key, spec, C.ink), fit: 'shrink' });
  });
}

function addOperations(slide, spec) {
  const key = 'operations'; addGrid(slide, key, spec);
  const y = layerY(key, spec); const tr = alpha(key, spec);
  const items = [
    ['Eval', 4.18, 'EVALUATE', C.teal], ['Red', 5.06, 'RED TEAM', C.red], ['Trace', 5.96, 'TRACE', C.purple],
    ['Monitor', 6.84, 'MONITOR', C.azure], ['Experiment', 7.72, 'EXPERIMENT', C.cyan], ['Optimize', 8.71, 'OPTIMIZE', C.purple],
    ['Health', 9.67, 'COST · LATENCY · HEALTH', C.teal], ['CICD', 10.88, 'VERSION · CI/CD', C.ink]
  ];
  items.forEach(([id, x, label, color], i) => {
    S(slide, pptx.ShapeType.ellipse, `3_operations_${id}_Node`, { x, y: y + 0.12 + (i % 2) * 0.05, w: 0.24, h: 0.24, fill: { color, transparency: tr + 8 }, line: { color, transparency: tr } });
    T(slide, label, `3_operations_${id}_Text`, { x: x - 0.24, y: y + 0.43, w: 0.72, h: 0.15, align: 'center', fontSize: 5.5, bold: true, color: textColor(key, spec), fit: 'shrink' });
  });
  L(slide, '3_operations_FeedbackLoopA', 4.32, y + 0.24, 6.65, 0.05, C.teal, 'dash', 0.8, tr + 8);
}

function addModels(slide, spec) {
  const key = 'models'; addGrid(slide, key, spec);
  const y = layerY(key, spec); const tr = alpha(key, spec);
  L(slide, '4_models_Divider', 7.76, y + 0.07, 0.18, 0.38, C.hair, 'solid', 0.7, tr);
  T(slide, 'FOUNDRY MODELS', '4_models_ModelsHeading', { x: 4.05, y: y + 0.08, w: 1.7, h: 0.16, fontSize: 8, bold: true, color: textColor(key, spec, C.azure) });
  T(slide, 'FOUNDRY IQ', '4_models_IQHeading', { x: 8.10, y: y + 0.08, w: 1.4, h: 0.16, fontSize: 8, bold: true, color: textColor(key, spec, C.cyan) });
  const modelNodes = [['Catalog', 4.30, 'CATALOG'], ['AOAI', 5.05, 'AZURE OPENAI'], ['Open', 5.92, 'OPEN + PARTNER'], ['Router', 6.82, 'MODEL ROUTER']];
  modelNodes.forEach(([id, x, label], i) => module(slide, key, spec, id, x, 0.27 + (i % 2) * 0.03, 0.28, label, i === 3 ? C.purple : C.azure, i === 3 ? pptx.ShapeType.hexagon : pptx.ShapeType.rect));
  T(slide, 'FINE-TUNE  ·  DEPLOY', '4_models_TuneDeploy', { x: 4.10, y: y + 0.68, w: 3.20, h: 0.15, fontSize: 5.8, bold: true, color: textColor(key, spec, C.muted), align: 'center' });
  const iqNodes = [['KB', 8.35, 'KNOWLEDGE BASES'], ['Retrieve', 9.25, 'AGENTIC RETRIEVAL'], ['Search', 10.22, 'SEARCH + CITATIONS'], ['Permissions', 11.18, 'PERMISSIONS']];
  iqNodes.forEach(([id, x, label], i) => module(slide, key, spec, id, x, 0.27 + (i % 2) * 0.03, 0.28, label, C.cyan, i === 1 ? pptx.ShapeType.hexagon : pptx.ShapeType.rect));
  L(slide, '4_models_IntelligenceContext', 7.12, y + 0.30, 1.18, 0, C.purple, 'dash', 1.0, tr);
  const sources = ['SHAREPOINT', 'ONELAKE', 'AZURE DATA', 'DATABASES', 'FILES', 'WEB', 'APIs'];
  sources.forEach((label, i) => T(slide, label, `4_models_Source_${i}`, { x: 8.05 + i * 0.54, y: y + 0.68 + (i % 2) * 0.06, w: 0.54, h: 0.13, fontSize: 4.8, bold: true, align: 'center', color: textColor(key, spec, C.muted), fit: 'shrink' }));
}

function addAgents(slide, spec) {
  const key = 'agents'; addGrid(slide, key, spec);
  const y = layerY(key, spec); const tr = alpha(key, spec);
  S(slide, pptx.ShapeType.parallelogram, '5_agents_CoreField', { x: 4.05, y: y + 0.06, w: 7.45, h: 0.34, fill: { color: C.purple, transparency: Math.min(100, tr + 79) }, line: { color: C.purple, width: 0.9, transparency: tr } });
  const agents = [['Prompt', 4.50, 'PROMPT'], ['Hosted', 5.55, 'HOSTED'], ['Framework', 6.67, 'AGENT FRAMEWORK'], ['Multi', 7.92, 'MULTI-AGENT']];
  agents.forEach(([id, x, label], i) => {
    S(slide, pptx.ShapeType.hexagon, `5_agents_${id}_Node`, { x, y: y + 0.10 + (i % 2) * 0.06, w: 0.42, h: 0.38, fill: { color: i < 2 ? C.purple : C.azure, transparency: tr }, line: { color: C.paper, width: 0.8, transparency: tr } });
    T(slide, label, `5_agents_${id}_Text`, { x: x - 0.20, y: y + 0.53, w: 0.82, h: 0.15, align: 'center', fontSize: 5.8, bold: true, color: textColor(key, spec), fit: 'shrink' });
  });
  const tools = [['Memory', 9.06, 'MEMORY'], ['Workflow', 9.76, 'WORKFLOWS'], ['Tools', 10.50, 'TOOLS'], ['MCP', 11.14, 'MCP']];
  tools.forEach(([id, x, label], i) => module(slide, key, spec, id, x, 0.17 + (i % 2) * 0.04, 0.25, label, i === 3 ? C.cyan : C.purple, i === 3 ? pptx.ShapeType.chevron : pptx.ShapeType.rect));
  T(slide, 'APIs  ·  FUNCTIONS  ·  ENTERPRISE SYSTEMS', '5_agents_Connectivity', { x: 8.86, y: y + 0.68, w: 2.85, h: 0.14, align: 'center', fontSize: 5.7, bold: true, color: textColor(key, spec, C.muted) });
}

function addExperiences(slide, spec) {
  const key = 'experiences'; addGrid(slide, key, spec);
  const y = layerY(key, spec); const tr = alpha(key, spec);
  const apps = [
    ['M365', 4.18, 0.28, 0.74, 'MICROSOFT 365 COPILOT', C.azure], ['Teams', 5.35, 0.23, 0.68, 'TEAMS', C.purple],
    ['Studio', 6.44, 0.29, 0.72, 'COPILOT STUDIO', C.cyan], ['Web', 7.63, 0.20, 0.84, 'WEB APPS', C.ink],
    ['Mobile', 8.94, 0.24, 0.42, 'MOBILE', C.azure], ['API', 9.89, 0.28, 0.52, 'APIs', C.cyan],
    ['Enterprise', 10.94, 0.20, 0.80, 'ENTERPRISE APPS', C.ink]
  ];
  apps.forEach(([id, x, yo, w, label, color], i) => {
    const h = id === 'Mobile' ? 0.48 : 0.36;
    S(slide, pptx.ShapeType.rect, `6_experiences_${id}_Surface`, { x, y: y + yo - h, w, h, fill: { color: C.paper, transparency: tr }, line: { color, width: 0.9, transparency: tr }, shadow: tr === 0 ? makeShadow(0.11, 4, 1) : undefined });
    L(slide, `6_experiences_${id}_UI`, x + 0.08, y + yo - h + 0.10, Math.max(0.18, w - 0.16), 0, color, 'solid', 1.4, tr);
    T(slide, label, `6_experiences_${id}_Text`, { x: x - 0.08, y: y + 0.35, w: w + 0.16, h: 0.15, align: 'center', fontSize: 5.6, bold: true, color: textColor(key, spec), fit: 'shrink' });
  });
  T(slide, 'BUILD ONCE IN FOUNDRY  ·  DELIVER ACROSS ENTERPRISE EXPERIENCES', '6_experiences_Message', { x: 6.10, y: y + 0.70, w: 4.40, h: 0.15, align: 'center', fontSize: 6.1, bold: true, charSpacing: 0.7, color: textColor(key, spec, C.azure) });
}

function addVerticalFlows(slide, spec) {
  const top = isVisible('experiences', spec) ? planes.experiences.y + 0.46 : planes.agents.y + 0.46;
  const bottom = planes.azure.y + 0.10;
  const visibleAll = spec.reveal >= 5;
  const tr = visibleAll ? 0 : 100;
  L(slide, '90_Flow_AgentControl', 5.02, top, 0, bottom - top, C.purple, 'solid', 1.1, tr);
  L(slide, '90_Flow_Knowledge', 8.58, Math.max(top, planes.agents.y + 0.45), 0, planes.models.y - planes.agents.y + 0.44, C.cyan, 'dash', 1.0, tr);
  L(slide, '90_Flow_Telemetry', 10.60, Math.max(top, planes.agents.y + 0.45), 0, planes.operations.y - planes.agents.y + 0.40, C.teal, 'dot', 0.9, tr);
  const govTr = spec.reveal >= 2 ? 8 : 100;
  [4.46, 7.36, 10.18].forEach((x, i) => {
    L(slide, `90_Flow_Policy_${i}`, x, planes.governance.y - 0.08, 0, -(planes.governance.y - (isVisible('experiences', spec) ? planes.experiences.y + 0.55 : planes.azure.y)), C.ink, 'dash', 0.55, govTr + 35);
    S(slide, pptx.ShapeType.diamond, `90_Flow_PolicyMarker_${i}`, { x: x - 0.055, y: planes.governance.y - 0.05, w: 0.11, h: 0.11, fill: { color: C.ink, transparency: govTr }, line: { color: C.ink, transparency: govTr } });
  });
  if (spec.final) {
    const legend = [['REQUEST / CONTROL', C.purple, 'solid'], ['KNOWLEDGE / DATA', C.cyan, 'dash'], ['TELEMETRY', C.teal, 'dot'], ['POLICY', C.ink, 'dash']];
    legend.forEach(([label, color, dash], i) => {
      L(slide, `91_LegendLine_${i}`, 0.68 + i * 1.62, 7.13, 0.34, 0, color, dash, 1.0, 0);
      T(slide, label, `91_LegendText_${i}`, { x: 1.08 + i * 1.62, y: 7.07, w: 1.18, h: 0.14, fontSize: 5.7, bold: true, color: C.muted, fit: 'shrink' });
    });
  }
}

function addArchitecture(slide, spec) {
  ['azure', 'governance', 'operations', 'models', 'agents', 'experiences'].forEach(key => addPlane(slide, key, spec));
  addAzure(slide, spec);
  addGovernance(slide, spec);
  addOperations(slide, spec);
  addModels(slide, spec);
  addAgents(slide, spec);
  addExperiences(slide, spec);
  addVerticalFlows(slide, spec);
}

slideSpecs.forEach((spec, index) => {
  const slide = pptx.addSlide();
  slide.background = { color: C.bg };
  addHeader(slide, spec, index);
  addArchitecture(slide, spec);
  slide.addNotes(`Slide ${index + 1}: ${spec.headline}. Architecture objects use stable names for Morph matching.`);
});

pptx.writeFile({ fileName: 'Microsoft-Foundry-Enterprise-AI-Architecture.pptx' });
