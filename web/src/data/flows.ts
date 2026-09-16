/**
 * Cross-layer relationships drawn by the SVG overlay.
 *
 * Endpoints are addressed in layer-relative coordinates (percentage of the
 * plane surface) so they stay attached to the geometry at any scale.
 *
 * The numbered flows form the primary request path shown at rest. They connect
 * *adjacent* layers only, which keeps every resting line short and near
 * vertical instead of sweeping across the whole stack.
 */

export type FlowKind = 'request' | 'knowledge' | 'telemetry' | 'policy';

export type FlowEndpoint = {
  layer: string;
  x: number;
  y: number;
  /** Extra elevation so a line leaves from the top of a module, not the plane. */
  lift?: number;
};

export type Flow = {
  id: string;
  kind: FlowKind;
  from: FlowEndpoint;
  to: FlowEndpoint;
  bow?: number;
  /** Short verb phrase drawn on the line. */
  label?: string;
  /** Position in the primary request narrative. */
  order?: number;
};

export const flowKindMeta: Record<FlowKind, { label: string; description: string }> = {
  request: { label: 'Request and control', description: 'Experiences call agents; agents call models and tools.' },
  knowledge: { label: 'Knowledge and data', description: 'Enterprise sources feed Foundry IQ; IQ grounds agents.' },
  telemetry: { label: 'Telemetry', description: 'Agents and models emit traces, evaluations and health.' },
  policy: { label: 'Policy and governance', description: 'Identity and policy enforced through every layer.' }
};

export const flows: Flow[] = [
  // ---- Primary request path (shown at rest, numbered) ----
  {
    id: 'req-experiences-agents',
    kind: 'request',
    order: 1,
    label: 'Request',
    from: { layer: 'experiences', x: 27, y: 58, lift: 10 },
    to: { layer: 'agent-service', x: 30, y: 50, lift: 24 }
  },
  {
    id: 'req-agents-models',
    kind: 'request',
    order: 2,
    label: 'Call model',
    from: { layer: 'agent-service', x: 44, y: 56, lift: 20 },
    to: { layer: 'models-knowledge', x: 74, y: 50, lift: 42 }
  },
  {
    id: 'know-models-agents',
    kind: 'knowledge',
    order: 3,
    label: 'Ground with context',
    from: { layer: 'models-knowledge', x: 60, y: 50, lift: 44 },
    to: { layer: 'agent-service', x: 78, y: 42, lift: 22 }
  },
  {
    id: 'tel-models-ops',
    kind: 'telemetry',
    order: 4,
    label: 'Trace & evaluate',
    from: { layer: 'models-knowledge', x: 86, y: 60, lift: 16 },
    to: { layer: 'quality-operations', x: 84, y: 56, lift: 16 }
  },
  {
    id: 'pol-gov-ops',
    kind: 'policy',
    label: 'Policy enforced',
    from: { layer: 'governance', x: 13, y: 62, lift: 16 },
    to: { layer: 'quality-operations', x: 12, y: 60, lift: 14 }
  },

  // ---- Shown when a related layer is selected ----
  {
    id: 'req-api-agents',
    kind: 'request',
    label: 'API call',
    from: { layer: 'experiences', x: 62, y: 66, lift: 12 },
    to: { layer: 'agent-service', x: 70, y: 60, lift: 20 }
  },
  {
    id: 'tel-agents-ops',
    kind: 'telemetry',
    label: 'Telemetry',
    from: { layer: 'agent-service', x: 78, y: 66, lift: 16 },
    to: { layer: 'quality-operations', x: 76, y: 60, lift: 16 }
  },
  {
    id: 'pol-gov-agents',
    kind: 'policy',
    label: 'Identity & policy',
    from: { layer: 'governance', x: 58, y: 62, lift: 16 },
    to: { layer: 'agent-service', x: 54, y: 66, lift: 16 }
  },
  {
    id: 'pol-gov-experiences',
    kind: 'policy',
    label: 'Governed access',
    from: { layer: 'governance', x: 86, y: 62, lift: 16 },
    to: { layer: 'experiences', x: 88, y: 62, lift: 12 }
  },
  {
    id: 'pol-azure-gov',
    kind: 'policy',
    label: 'Managed identity',
    from: { layer: 'azure-foundation', x: 72, y: 64, lift: 14 },
    to: { layer: 'governance', x: 72, y: 60, lift: 14 }
  },
  {
    id: 'tel-azure-ops',
    kind: 'telemetry',
    label: 'Platform signals',
    from: { layer: 'azure-foundation', x: 88, y: 66, lift: 14 },
    to: { layer: 'governance', x: 90, y: 58, lift: 14 }
  }
];

/** The narrative shown when no layer is focused. */
export const primaryFlowIds = new Set(
  flows.filter((flow) => flow.order !== undefined || flow.id === 'pol-gov-ops').map((flow) => flow.id)
);
