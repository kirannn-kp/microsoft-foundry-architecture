import { AnimatePresence, motion } from 'framer-motion';
import { layerIndexById } from '../data/architecture';
import { flows, primaryFlowIds, type Flow, type FlowKind } from '../data/flows';
import { curvePath, DESIGN_H, DESIGN_W, projectOnLayer, toSvg } from '../lib/iso';

type Props = {
  revealedSteps: number;
  focusedLayerId: string | null;
  flowFilter: FlowKind | null;
  animateDraw: boolean;
  reducedMotion: boolean;
};

const kindColor: Record<FlowKind, string> = {
  request: '#2b3440',
  knowledge: '#0078d4',
  telemetry: '#00a4ef',
  policy: '#6b4fd3'
};

function isVisible(flow: Flow, revealedSteps: number) {
  return (
    layerIndexById[flow.from.layer] < revealedSteps && layerIndexById[flow.to.layer] < revealedSteps
  );
}

function touches(flow: Flow, layerId: string | null) {
  if (!layerId) return false;
  return flow.from.layer === layerId || flow.to.layer === layerId;
}

export function FlowLines({
  revealedSteps,
  focusedLayerId,
  flowFilter,
  animateDraw,
  reducedMotion
}: Props) {
  const active = flows.filter((flow) => {
    if (!isVisible(flow, revealedSteps)) return false;
    if (flowFilter) return flow.kind === flowFilter;
    return focusedLayerId ? touches(flow, focusedLayerId) : primaryFlowIds.has(flow.id);
  });

  return (
    <svg
      className="flow-lines"
      viewBox={`0 0 ${DESIGN_W} ${DESIGN_H}`}
      width={DESIGN_W}
      height={DESIGN_H}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {(Object.keys(kindColor) as FlowKind[]).map((kind) => (
          <marker
            key={kind}
            id={`arrow-${kind}`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill={kindColor[kind]} />
          </marker>
        ))}
      </defs>

      <AnimatePresence>
        {active.map((flow) => {
          const from = projectOnLayer(
            flow.from.x,
            flow.from.y,
            layerIndexById[flow.from.layer],
            flow.from.lift ?? 0
          );
          const to = projectOnLayer(
            flow.to.x,
            flow.to.y,
            layerIndexById[flow.to.layer],
            flow.to.lift ?? 0
          );
          const path = curvePath(from, to, flow.bow ?? 0.05);
          const start = toSvg(from);
          const end = toSvg(to);
          const mid = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };

          return (
            <motion.g
              key={flow.id}
              className={`flow flow--${flow.kind}`}
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.3 }}
            >
              <motion.path
                d={path}
                className="flow__path"
                markerEnd={`url(#arrow-${flow.kind})`}
                initial={animateDraw && !reducedMotion ? { pathLength: 0 } : { pathLength: 1 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: reducedMotion ? 0 : 0.8, ease: 'easeInOut' }}
              />
              <circle className="flow__cap" cx={start.x} cy={start.y} r="2.4" />

              {flow.label ? (
                <g className="flow__tag" transform={`translate(${mid.x} ${mid.y})`}>
                  {flow.order ? (
                    <>
                      <circle className="flow__badge" cx="-7" cy="0" r="8" />
                      <text className="flow__badge-text" x="-7" y="0" textAnchor="middle" dominantBaseline="central">
                        {flow.order}
                      </text>
                      <text className="flow__label" x="6" y="0" textAnchor="start" dominantBaseline="central">
                        {flow.label}
                      </text>
                    </>
                  ) : (
                    <text className="flow__label" x="0" y="0" textAnchor="middle" dominantBaseline="central">
                      {flow.label}
                    </text>
                  )}
                </g>
              ) : null}
            </motion.g>
          );
        })}
      </AnimatePresence>
    </svg>
  );
}
