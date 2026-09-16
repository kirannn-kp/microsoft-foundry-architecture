/**
 * Architecture content model.
 *
 * Rendering logic never hardcodes capability text; every label, module and
 * relationship the scene draws originates from this file.
 *
 * Layout convention: each platform places its *named* components in a front
 * rank (roughly y 65–78) because that band stays visible when the layer above
 * partially overlaps it. The back of each plane carries infrastructure texture.
 */

export type Accent = 'neutral' | 'blue' | 'cyan' | 'purple' | 'green' | 'amber';

export type ModuleKind =
  | 'block' // low modular platform unit
  | 'tower' // taller extruded unit (storage, deployments)
  | 'node' // small illuminated point
  | 'hub' // primary orchestration / aggregation element
  | 'gate' // endpoint or ingress surface
  | 'shield' // governance marker
  | 'gauge' // measurement surface
  | 'cube' // model unit
  | 'panel' // application surface
  | 'device'; // mobile/device frame

export type ArchitectureModule = {
  id: string;
  label: string;
  category: string;
  kind: ModuleKind;
  /** Position as a percentage of the plane surface. */
  position: { x: number; y: number };
  /** Footprint in plane-space pixels. */
  size?: number;
  /** Extrusion height in plane-space pixels. */
  height?: number;
  accent?: Accent;
  /** Key into the glyph registry; modules with an icon render a labelled pin. */
  icon?: string;
  /** Larger pin for the most important component on a layer. */
  emphasis?: boolean;
};

export type LayerCaption = {
  id: string;
  text: string;
  position: { x: number; y: number };
  align?: 'left' | 'right';
  /** Zone labels stay visible even when the layer is not focused. */
  persistent?: boolean;
};

export type ArchitectureLayer = {
  id: string;
  step: number;
  label: string;
  shortLabel: string;
  /** Compact label drawn beside the platform in the diagram. */
  planeLabel: string;
  headline: string;
  description: string;
  valueStatement: string;
  accent: Accent;
  capabilities: string[];
  connections: string[];
  modules: ArchitectureModule[];
  captions: LayerCaption[];
};

/** Builds a regular cluster of identical modules used as platform texture. */
function cluster(
  prefix: string,
  options: {
    cols: number;
    rows: number;
    x: number;
    y: number;
    stepX: number;
    stepY: number;
    label: string;
    category: string;
    kind?: ModuleKind;
    size?: number;
    height?: number;
    accent?: Accent;
    accentIndexes?: number[];
  }
): ArchitectureModule[] {
  const modules: ArchitectureModule[] = [];
  let i = 0;
  for (let row = 0; row < options.rows; row += 1) {
    for (let col = 0; col < options.cols; col += 1) {
      const highlighted = options.accentIndexes?.includes(i) ?? false;
      modules.push({
        id: `${prefix}-${i}`,
        label: options.label,
        category: options.category,
        kind: options.kind ?? 'block',
        position: {
          x: options.x + col * options.stepX,
          y: options.y + row * options.stepY
        },
        size: options.size ?? 24,
        height: options.height ?? 12,
        accent: highlighted ? options.accent ?? 'blue' : 'neutral'
      });
      i += 1;
    }
  }
  return modules;
}

/** Builds an evenly spaced row of labelled, icon-bearing components. */
function frontRank(
  items: Array<{
    id: string;
    label: string;
    icon: string;
    category: string;
    accent?: Accent;
    emphasis?: boolean;
  }>,
  options: { y: number; from?: number; to?: number; kind?: ModuleKind } = { y: 76 }
): ArchitectureModule[] {
  const from = options.from ?? 14;
  const to = options.to ?? 90;
  const stepX = items.length > 1 ? (to - from) / (items.length - 1) : 0;
  return items.map((item, index) => ({
    id: item.id,
    label: item.label,
    category: item.category,
    kind: options.kind ?? 'block',
    position: { x: from + index * stepX, y: options.y },
    size: item.emphasis ? 26 : 20,
    height: 8,
    accent: item.accent ?? 'neutral',
    icon: item.icon,
    emphasis: item.emphasis
  }));
}

const azureFoundation: ArchitectureLayer = {
  id: 'azure-foundation',
  step: 1,
  label: 'Azure Foundation',
  shortLabel: 'Foundation',
  planeLabel: 'Azure Foundation',
  headline: 'Built on Azure',
  description: 'Secure, scalable cloud infrastructure for enterprise AI.',
  valueStatement:
    'Enterprise AI inherits the compute, network and security posture your organisation already trusts.',
  accent: 'blue',
  capabilities: [
    'Azure compute',
    'Azure Storage',
    'Networking',
    'Private Link',
    'Key Vault',
    'Azure Monitor'
  ],
  connections: ['Every Foundry layer above', 'Enterprise network', 'Existing Azure landing zones'],
  modules: [
    ...cluster('compute', {
      cols: 4,
      rows: 3,
      x: 9,
      y: 20,
      stepX: 4.2,
      stepY: 7.5,
      label: 'Compute capacity',
      category: 'Azure compute',
      size: 21,
      height: 13,
      accent: 'blue',
      accentIndexes: [0, 5, 10]
    }),
    ...cluster('storage', {
      cols: 3,
      rows: 1,
      x: 32,
      y: 24,
      stepX: 4.2,
      stepY: 0,
      label: 'Storage',
      category: 'Azure Storage',
      kind: 'tower',
      size: 21,
      height: 30,
      accent: 'blue',
      accentIndexes: [1]
    }),
    { id: 'net-core', label: 'Virtual network', category: 'Networking', kind: 'hub', position: { x: 56, y: 28 }, size: 30, height: 14, accent: 'blue' },
    { id: 'net-1', label: 'Subnet', category: 'Networking', kind: 'node', position: { x: 49, y: 20 }, size: 11, height: 10 },
    { id: 'net-2', label: 'Subnet', category: 'Networking', kind: 'node', position: { x: 63, y: 20 }, size: 11, height: 10 },
    { id: 'net-3', label: 'Subnet', category: 'Networking', kind: 'node', position: { x: 49, y: 38 }, size: 11, height: 10 },
    { id: 'net-4', label: 'Subnet', category: 'Networking', kind: 'node', position: { x: 63, y: 38 }, size: 11, height: 10 },
    ...cluster('rack', {
      cols: 6,
      rows: 2,
      x: 74,
      y: 22,
      stepX: 3.4,
      stepY: 9,
      label: 'Regional capacity',
      category: 'Azure compute',
      size: 12,
      height: 17,
      accent: 'neutral'
    }),
    ...frontRank(
      [
        { id: 'f-compute', label: 'Compute', icon: 'compute', category: 'Azure compute', accent: 'blue' },
        { id: 'f-storage', label: 'Storage', icon: 'storage', category: 'Azure Storage', accent: 'blue' },
        { id: 'f-network', label: 'Networking', icon: 'network', category: 'Networking', accent: 'blue' },
        { id: 'private-link', label: 'Private Link', icon: 'link', category: 'Private connectivity', accent: 'cyan' },
        { id: 'key-vault', label: 'Key Vault', icon: 'key', category: 'Secrets and keys', accent: 'blue' },
        { id: 'monitor', label: 'Azure Monitor', icon: 'monitor', category: 'Monitoring', accent: 'cyan' }
      ],
      { y: 76 }
    )
  ],
  captions: []
};

const governance: ArchitectureLayer = {
  id: 'governance',
  step: 2,
  label: 'Governance & Control Plane',
  shortLabel: 'Govern',
  planeLabel: 'Governance',
  headline: 'Govern enterprise AI from the foundation',
  description: 'Identity, policy, security and compliance across the AI lifecycle.',
  valueStatement:
    'Governance is inherited by every model, agent and experience above it — not bolted on at the end.',
  accent: 'purple',
  capabilities: [
    'Microsoft Entra ID',
    'RBAC',
    'Azure Policy',
    'Microsoft Purview',
    'Microsoft Defender',
    'Content Safety',
    'Private networking',
    'Enterprise guardrails',
    'Audit and compliance'
  ],
  connections: ['Azure Foundation', 'Models & Knowledge', 'Agent Service', 'AI Experiences'],
  modules: [
    ...cluster('rbac', {
      cols: 4,
      rows: 2,
      x: 14,
      y: 24,
      stepX: 4,
      stepY: 8,
      label: 'Role assignments',
      category: 'Authorisation',
      kind: 'node',
      size: 13,
      height: 10,
      accent: 'purple',
      accentIndexes: [0, 5]
    }),
    { id: 'gov-boundary', label: 'Network isolation', category: 'Isolation', kind: 'gate', position: { x: 40, y: 30 }, size: 26, height: 16, accent: 'cyan' },
    { id: 'audit', label: 'Audit and compliance', category: 'Assurance', kind: 'gauge', position: { x: 56, y: 28 }, size: 26, height: 10, accent: 'neutral' },
    ...cluster('guardrail', {
      cols: 6,
      rows: 2,
      x: 70,
      y: 22,
      stepX: 4.2,
      stepY: 9,
      label: 'Guardrails',
      category: 'Enterprise guardrails',
      kind: 'node',
      size: 12,
      height: 13,
      accent: 'purple',
      accentIndexes: [0, 3, 7, 10]
    }),
    ...frontRank(
      [
        { id: 'entra', label: 'Entra ID', icon: 'identity', category: 'Identity', accent: 'purple' },
        { id: 'rbac-anchor', label: 'RBAC', icon: 'lock', category: 'Authorisation', accent: 'purple' },
        { id: 'policy', label: 'Azure Policy', icon: 'policy', category: 'Policy', accent: 'purple' },
        { id: 'purview', label: 'Purview', icon: 'catalogue', category: 'Compliance', accent: 'blue' },
        { id: 'defender', label: 'Defender', icon: 'shield', category: 'Security', accent: 'blue' },
        { id: 'content-safety', label: 'Content Safety', icon: 'shieldCheck', category: 'Responsible AI', accent: 'purple' }
      ],
      { y: 76 }
    )
  ],
  captions: [{ id: 'c-gov-zone', text: 'Applies to every layer above', position: { x: 12, y: 12 }, persistent: false }]
};

const qualityOperations: ArchitectureLayer = {
  id: 'quality-operations',
  step: 3,
  label: 'Quality & Operations',
  shortLabel: 'Operate',
  planeLabel: 'Quality & Ops',
  headline: 'Evaluate, observe and continuously improve',
  description: 'Evaluate, observe and continuously improve AI systems.',
  valueStatement:
    'Continuous evaluation and telemetry turn AI from a demo into a measurable production system.',
  accent: 'cyan',
  capabilities: [
    'Evaluations',
    'AI red teaming',
    'Tracing',
    'Monitoring',
    'Experimentation',
    'Agent optimization',
    'Quality and safety',
    'Cost, latency, health',
    'Versioning and CI/CD'
  ],
  connections: ['Agent Service', 'Models & Knowledge', 'Governance & Control Plane'],
  modules: [
    { id: 'optimization', label: 'Agent optimization', category: 'Optimization', kind: 'hub', position: { x: 22, y: 30 }, size: 28, height: 16, accent: 'cyan' },
    ...cluster('experiment', {
      cols: 5,
      rows: 2,
      x: 40,
      y: 22,
      stepX: 4.4,
      stepY: 9,
      label: 'Experiment runs',
      category: 'Experimentation',
      kind: 'node',
      size: 12,
      height: 12,
      accent: 'cyan',
      accentIndexes: [1, 3, 6, 9]
    }),
    ...cluster('signal', {
      cols: 5,
      rows: 1,
      x: 72,
      y: 30,
      stepX: 4.4,
      stepY: 0,
      label: 'Cost, latency, health',
      category: 'Operations',
      kind: 'node',
      size: 11,
      height: 16,
      accent: 'cyan',
      accentIndexes: [0, 2, 4]
    }),
    ...frontRank(
      [
        { id: 'evaluations', label: 'Evaluations', icon: 'gauge', category: 'Quality', accent: 'cyan' },
        { id: 'redteam', label: 'Red teaming', icon: 'redteam', category: 'Safety', accent: 'amber' },
        { id: 'tracing', label: 'Tracing', icon: 'trace', category: 'Observability', accent: 'cyan' },
        { id: 'monitoring', label: 'Monitoring', icon: 'monitor', category: 'Observability', accent: 'cyan' },
        { id: 'experimentation', label: 'Experiments', icon: 'experiment', category: 'Experimentation', accent: 'cyan' },
        { id: 'cicd', label: 'CI/CD', icon: 'cicd', category: 'Lifecycle', accent: 'green' }
      ],
      { y: 76 }
    )
  ],
  captions: [{ id: 'c-signals', text: 'Cost · Latency · Health', position: { x: 72, y: 18 } }]
};

const modelsKnowledge: ArchitectureLayer = {
  id: 'models-knowledge',
  step: 4,
  label: 'Models & Knowledge',
  shortLabel: 'Intelligence',
  planeLabel: 'Models & Knowledge',
  headline: 'Bring intelligence and enterprise context together',
  description: 'Combine model intelligence with permission-aware enterprise context.',
  valueStatement:
    'Models provide intelligence. Foundry IQ provides the enterprise context that makes answers correct.',
  accent: 'blue',
  capabilities: [
    'Model catalog',
    'Azure OpenAI models',
    'Open and partner models',
    'Model Router',
    'Fine-tuning',
    'Model deployment',
    'Knowledge bases',
    'Agentic retrieval',
    'Enterprise search',
    'Citations',
    'Permissions-aware access'
  ],
  connections: ['Agent Service', 'Enterprise data sources', 'Quality & Operations', 'Governance'],
  modules: [
    // Left half: enterprise knowledge sources feeding into Foundry IQ.
    { id: 'src-sharepoint', label: 'SharePoint', category: 'Knowledge source', kind: 'node', position: { x: 14, y: 58 }, size: 20, height: 11, accent: 'neutral', icon: 'sharepoint' },
    { id: 'src-onelake', label: 'OneLake', category: 'Knowledge source', kind: 'node', position: { x: 24, y: 58 }, size: 20, height: 11, accent: 'neutral', icon: 'onelake' },
    { id: 'src-db', label: 'Databases', category: 'Knowledge source', kind: 'node', position: { x: 34, y: 58 }, size: 20, height: 11, accent: 'neutral', icon: 'database' },
    { id: 'src-files', label: 'Files', category: 'Knowledge source', kind: 'node', position: { x: 14, y: 76 }, size: 20, height: 11, accent: 'neutral', icon: 'files' },
    { id: 'src-web', label: 'Web', category: 'Knowledge source', kind: 'node', position: { x: 24, y: 76 }, size: 20, height: 11, accent: 'neutral', icon: 'web' },
    { id: 'src-mcp', label: 'MCP', category: 'Knowledge source', kind: 'node', position: { x: 34, y: 76 }, size: 20, height: 11, accent: 'cyan', icon: 'api' },

    // Right half: the model catalog and Foundry IQ, grouped together.
    ...cluster('catalog', {
      cols: 3,
      rows: 2,
      x: 56,
      y: 20,
      stepX: 4.4,
      stepY: 8,
      label: 'Model catalog',
      category: 'Foundry Models',
      kind: 'cube',
      size: 18,
      height: 16,
      accent: 'blue',
      accentIndexes: [0, 3]
    }),
    { id: 'deployment', label: 'Deployments', category: 'Foundry Models', kind: 'gate', position: { x: 86, y: 30 }, size: 22, height: 15, accent: 'cyan' },
    { id: 'catalog-anchor', label: 'Model catalog', category: 'Foundry Models', kind: 'block', position: { x: 58, y: 58 }, size: 20, height: 10, accent: 'blue', icon: 'models' },
    { id: 'router', label: 'Model Router', category: 'Foundry Models', kind: 'block', position: { x: 70, y: 58 }, size: 26, height: 10, accent: 'blue', icon: 'router', emphasis: true },
    { id: 'finetune', label: 'Fine-tuning', category: 'Foundry Models', kind: 'block', position: { x: 82, y: 58 }, size: 20, height: 10, accent: 'blue', icon: 'tune' },
    { id: 'iq-hub', label: 'Foundry IQ', category: 'Foundry IQ', kind: 'block', position: { x: 58, y: 76 }, size: 26, height: 10, accent: 'purple', icon: 'knowledge', emphasis: true },
    { id: 'kb-1', label: 'Knowledge bases', category: 'Foundry IQ', kind: 'block', position: { x: 70, y: 76 }, size: 20, height: 10, accent: 'purple', icon: 'book' },
    { id: 'kb-3', label: 'Citations', category: 'Foundry IQ', kind: 'block', position: { x: 82, y: 76 }, size: 20, height: 10, accent: 'purple', icon: 'citation' }
  ],
  captions: [{ id: 'c-sources', text: 'Enterprise knowledge sources', position: { x: 10, y: 46 } }]
};

const agentService: ArchitectureLayer = {
  id: 'agent-service',
  step: 5,
  label: 'Microsoft Foundry Agent Service',
  shortLabel: 'Agents',
  planeLabel: 'Agent Service',
  headline: 'Turn intelligence into autonomous action',
  description:
    'A managed platform for building, orchestrating, deploying and operating enterprise agents.',
  valueStatement: 'Move from agent prototypes to governed production systems.',
  accent: 'purple',
  capabilities: [
    'Prompt agents',
    'Hosted agents',
    'Microsoft Agent Framework',
    'Multi-agent orchestration',
    'Agent-to-agent communication',
    'Memory and state',
    'Workflows',
    'Tools and toolboxes',
    'MCP',
    'APIs and Functions',
    'Managed runtime',
    'Agent endpoints'
  ],
  connections: [
    'Foundry Models',
    'Foundry IQ',
    'Enterprise tools',
    'AI Experiences',
    'Evaluation and observability'
  ],
  modules: [
    { id: 'orchestrator', label: 'Orchestration', category: 'Runtime', kind: 'hub', position: { x: 48, y: 42 }, size: 44, height: 24, accent: 'purple', icon: 'orchestrate', emphasis: true },
    { id: 'agent-1', label: 'Prompt agent', category: 'Agents', kind: 'node', position: { x: 30, y: 30 }, size: 20, height: 18, accent: 'purple', icon: 'agent' },
    { id: 'agent-2', label: 'Hosted agent', category: 'Agents', kind: 'node', position: { x: 42, y: 22 }, size: 20, height: 18, accent: 'blue', icon: 'agent' },
    { id: 'agent-3', label: 'Hosted agent', category: 'Agents', kind: 'node', position: { x: 56, y: 22 }, size: 20, height: 18, accent: 'purple', icon: 'agent' },
    { id: 'agent-4', label: 'Prompt agent', category: 'Agents', kind: 'node', position: { x: 68, y: 30 }, size: 20, height: 18, accent: 'blue', icon: 'agent' },
    { id: 'runtime-1', label: 'Managed runtime', category: 'Runtime', kind: 'block', position: { x: 16, y: 26 }, size: 22, height: 14, accent: 'neutral' },
    { id: 'runtime-2', label: 'Managed runtime', category: 'Runtime', kind: 'block', position: { x: 84, y: 26 }, size: 22, height: 14, accent: 'neutral' },
    ...frontRank(
      [
        { id: 'workflows', label: 'Workflows', icon: 'workflow', category: 'Agent Framework', accent: 'blue' },
        { id: 'memory', label: 'Memory', icon: 'memory', category: 'Runtime', accent: 'purple' },
        { id: 'tools', label: 'Tools', icon: 'tools', category: 'Tools', accent: 'blue' },
        { id: 'mcp', label: 'MCP', icon: 'api', category: 'MCP connectivity', accent: 'cyan' },
        { id: 'endpoints', label: 'Endpoints', icon: 'endpoint', category: 'Runtime', accent: 'cyan' }
      ],
      { y: 76, from: 15, to: 85 }
    )
  ],
  captions: [{ id: 'c-agents', text: 'Agents', position: { x: 49, y: 12 }, persistent: true }]
};

const experiences: ArchitectureLayer = {
  id: 'experiences',
  step: 6,
  label: 'AI Experiences',
  shortLabel: 'Experiences',
  planeLabel: 'AI Experiences',
  headline: 'Bring agents into every experience',
  description:
    'Deliver governed agents across the places where people and applications already work.',
  valueStatement: 'Build once in Foundry. Deliver across enterprise experiences.',
  accent: 'blue',
  capabilities: [
    'Microsoft 365 Copilot',
    'Microsoft Teams',
    'Copilot Studio',
    'Web applications',
    'Mobile applications',
    'APIs',
    'Enterprise applications'
  ],
  connections: ['Microsoft Foundry Agent Service', 'Enterprise identity', 'Line-of-business systems'],
  modules: [
    ...frontRank(
      [
        { id: 'm365', label: 'Microsoft 365 Copilot', icon: 'copilot', category: 'Microsoft experience', accent: 'blue', emphasis: true },
        { id: 'teams', label: 'Teams', icon: 'teams', category: 'Microsoft experience', accent: 'purple' },
        { id: 'copilot-studio', label: 'Copilot Studio', icon: 'studio', category: 'Microsoft experience', accent: 'purple' }
      ],
      { y: 36, from: 18, to: 62 }
    ),
    ...frontRank(
      [
        { id: 'web-app', label: 'Web apps', icon: 'browser', category: 'Custom experience', accent: 'neutral' },
        { id: 'mobile-app', label: 'Mobile apps', icon: 'mobile', category: 'Custom experience', accent: 'neutral' },
        { id: 'api-surface', label: 'APIs', icon: 'api', category: 'Programmatic', accent: 'cyan' },
        { id: 'enterprise-apps', label: 'Enterprise apps', icon: 'enterprise', category: 'Line of business', accent: 'neutral' }
      ],
      { y: 70, from: 16, to: 86 }
    )
  ],
  captions: [
    { id: 'c-build-once', text: 'Build once · deliver everywhere', position: { x: 84, y: 22 }, align: 'right', persistent: true }
  ]
};

/** Ordered bottom to top — index 0 sits on the ground plane. */
export const architectureLayers: ArchitectureLayer[] = [
  azureFoundation,
  governance,
  qualityOperations,
  modelsKnowledge,
  agentService,
  experiences
];

export const layerIndexById: Record<string, number> = Object.fromEntries(
  architectureLayers.map((layer, index) => [layer.id, index])
);

export const TOTAL_STEPS = architectureLayers.length + 1;

/** One-line explanations shown when a single component is selected. */
export const moduleDescriptions: Record<string, string> = {
  // Azure Foundation
  'f-compute': 'Elastic compute capacity that runs models, agents and tools.',
  'f-storage': 'Durable storage for documents, artefacts and agent state.',
  'f-network': 'Virtual networks and subnets that isolate AI workloads.',
  'private-link': 'Keeps traffic to Foundry on the Microsoft backbone, off the public internet.',
  'key-vault': 'Central store for secrets, keys and certificates used by agents.',
  monitor: 'Platform metrics and logs for the infrastructure under Foundry.',

  // Governance & Control Plane
  entra: 'Enterprise identity for users, agents and workloads.',
  'rbac-anchor': 'Role-based access control over projects, models and agents.',
  policy: 'Organisational rules applied automatically to every deployment.',
  purview: 'Data governance, classification and lineage across AI assets.',
  defender: 'Threat protection and posture management for AI workloads.',
  'content-safety': 'Filters harmful content on both prompts and responses.',

  // Quality & Operations
  evaluations: 'Scores quality, groundedness and safety against test sets.',
  redteam: 'Adversarial testing that probes agents for unsafe behaviour.',
  tracing: 'End-to-end traces of every agent run, tool call and model request.',
  monitoring: 'Live quality, cost, latency and health signals in production.',
  experimentation: 'Compare prompts, models and configurations side by side.',
  cicd: 'Versioning and automated promotion from development to production.',

  // Models & Knowledge
  'catalog-anchor': 'Foundry, OpenAI, open and partner models in one catalog.',
  router: 'Picks the best model per request to balance quality and cost.',
  finetune: 'Adapts a base model to your domain, tone and tasks.',
  'iq-hub': 'Reusable, permission-aware enterprise knowledge for agents.',
  'kb-1': 'Curated collections of enterprise content agents can retrieve.',
  'kb-3': 'Answers carry source citations back to the original content.',
  'src-sharepoint': 'Documents and sites, retrieved with existing permissions.',
  'src-onelake': 'Analytical data in Microsoft Fabric.',
  'src-db': 'Operational and line-of-business databases.',
  'src-files': 'File shares and unstructured document stores.',
  'src-web': 'Public web content where it is permitted.',
  'src-mcp': 'Model Context Protocol — a standard connector to live enterprise tools and data.',
  deployment: 'Governed endpoints that serve a deployed model in production.',

  // Agent Service
  orchestrator: 'Coordinates multiple agents, tools and models to complete a task.',
  'agent-1': 'Declarative agent defined by instructions, tools and knowledge.',
  'agent-2': 'Custom-code agent running on the managed Foundry runtime.',
  'agent-3': 'Custom-code agent running on the managed Foundry runtime.',
  'agent-4': 'Declarative agent defined by instructions, tools and knowledge.',
  workflows: 'Durable, multi-step processes built with the Agent Framework.',
  memory: 'Threads, state and long-term memory across conversations.',
  tools: 'Capabilities an agent can invoke, grouped into toolboxes.',
  mcp: 'Model Context Protocol — a standard way to connect tools and data.',
  endpoints: 'Governed endpoints applications call to reach an agent.',

  // AI Experiences
  m365: 'Reach employees where they already work, inside Microsoft 365.',
  teams: 'Agents in chats, channels and meetings.',
  'copilot-studio': 'Low-code authoring and publishing of agents.',
  'web-app': 'Custom web front ends built on agent endpoints.',
  'mobile-app': 'Mobile experiences backed by the same governed agents.',
  'api-surface': 'Direct programmatic access for system-to-system use.',
  'enterprise-apps': 'Embed agents into existing line-of-business software.'
};

export type ModuleLocation = { module: ArchitectureModule; layer: ArchitectureLayer };

export function findModule(moduleId: string): ModuleLocation | undefined {
  for (const layer of architectureLayers) {
    const module = layer.modules.find((item) => item.id === moduleId);
    if (module) return { module, layer };
  }
  return undefined;
}

export const finalStory = {
  step: TOTAL_STEPS,
  headline: 'From Models to Agents to Enterprise AI',
  label: 'Complete reference architecture',
  description:
    'Microsoft Foundry is the enterprise AI factory that connects infrastructure, governance, models, knowledge, agents, operations and experiences.',
  valueStatement: 'One governed platform from Azure infrastructure to production AI experiences.'
};
